import React, { useState } from 'react';
import { LoadingOverlay } from "../components/Overlay";
import { RsaToolContext } from '../state';
import { sign, signFile, verify, verifyFile } from "../api"
import "./DSSApp.css";
import { toast } from 'react-toastify';

function DSSApp() {
    const state = React.useContext(RsaToolContext);
    console.log('state', state);
    const [text, setText] = useState('');
    const [file, setFile] = useState(null);
    const [textV, setTextV] = useState('');
    const [fileV, setFileV] = useState(null);
    const [signature, setSignature] = useState('');
    const [verificationResult, setVerificationResult] = useState('');
    const [signatureFile, setSignatureFile] = useState(null);

    const handleTextChange = (e) => setText(e.target.value);
    const handleFileChange = (e) => setFile(e.target.files[0]);
    const handleTextVChange = (e) => setTextV(e.target.value);
    const handleFileVChange = (e) => setFileV(e.target.files[0]);
    const handleSignatureFileChange = (e) => setSignatureFile(e.target.files[0]);

    const generateSignature = async () => {
        if (!state.keyPair || !state.keyPair.private) {
            toast.error("Private key is expected(");
            return;
        }

        let signature;
        if (text) {
            const res = await sign(state.keyPair.private, text)
            signature = res.result;
        } else {
            if (!file) {
                toast.error("Either file or text should be provided");
                return;
            }
            const res = signFile(state.keyPair.private, file);
            signature = res.result;
        }
        setSignature(signature);
    };

    const verifySignature = async () => {
        if (!signatureFile) {
            toast.error("Signature must be provided!");
            return;
        }
        if (!state.keyPair || !state.keyPair.public) {
            toast.error("Public key must be provided!");
            return;
        }

        const setResult = (isValid) => {
            isValid = isValid == 'True';
            setVerificationResult(isValid ? "Signature is valid" : "valid is not")
        }

        if (textV) {
            const res = await verify(state.keyPair.public, textV, signatureFile);
            setResult(res.result);
        } else {
            if (!fileV) {
                toast.error("Either file or text should be provided");
                return;
            }
            const res = await verifyFile(state.keyPair.public, fileV, signatureFile);
            setResult(res.result);
        }
    };

    const saveToFile = async (data, filename) => {
        const blob = new Blob([data], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    };

    return (
        <div style={styles.container}>
            <LoadingOverlay active={!state.keyPair} />
            <h2>Digital Signature System (DSS)</h2>
            <div className="input-group">
                <label>Enter Text:</label>
                <textarea value={text} onChange={handleTextChange} rows="4" cols="50" placeholder="Enter text here..." />
            </div>

            <div className="input-group">
                <label>Or Select File:</label>
                <input type="file" onChange={handleFileChange} />
            </div>

            <button className="btn" onClick={generateSignature}>Generate Signature</button>

            {signature && (
                <div className="output-group">
                    <h3>Signature:</h3>
                    <textarea value={signature} readOnly rows="4" cols="50" />
                    <button className="btn" onClick={() => saveToFile(signature, 'signature.txt')}>
                        Save Signature to File
                    </button>
                </div>
            )}

            <hr />
            <div className="input-group">
                <label>Enter Text:</label>
                <textarea value={textV} onChange={handleTextVChange} rows="4" cols="50" placeholder="Enter text here..." />
            </div>

            <div className="input-group">
                <label>Select File to Verify:</label>
                <input type="file" onChange={handleFileVChange} />
            </div>
            <div className="input-group">
                <label>Upload Signature File:</label>
                <input type="file" onChange={handleSignatureFileChange} />
            </div>
            <button className="btn" onClick={verifySignature}>Verify Signature</button>

            {verificationResult && (
                <div className="output-group">
                    <h4>Verification Result:</h4>
                    <textarea value={verificationResult} readOnly rows="4" cols="50" />
                </div>
            )}
        </div>
    );
}

export default DSSApp;


const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      padding: '20px',
      maxWidth: '600px',
      margin: 'auto',
      backgroundColor: '#f8f8f8',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      position: 'relative'
}};