import { useState } from 'react';

import "./DSSApp.css";

function DSSApp() {
    const [text, setText] = useState('');
    const [file, setFile] = useState(null);
    const [signature, setSignature] = useState('');
    const [keys, setKeys] = useState({ publicKey: '', privateKey: '' });
    const [verificationResult, setVerificationResult] = useState('');
    const [signatureFile, setSignatureFile] = useState(null);

    // Handlers for input changes
    const handleTextChange = (e) => setText(e.target.value);
    const handleFileChange = (e) => setFile(e.target.files[0]);
    const handleSignatureFileChange = (e) => setSignatureFile(e.target.files[0]);

    // Placeholder functions for backend integration
    const generateSignature = async () => {
        // TODO: Integrate backend API to generate a signature for text or file
        setSignature('GeneratedSignature123');
    };

    const verifySignature = async () => {
        // TODO: Integrate backend API to verify the signature
        setVerificationResult('Signature is valid');
    };

    const generateKeys = async () => {
        // TODO: Integrate backend API to generate public/private keys
        setKeys({ publicKey: 'PublicKey123', privateKey: 'PrivateKey123' });
    };

    const saveToFile = async (data, filename) => {
        const blob = new Blob([data], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    };

    return (
        <div className="container">
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

            <h3>Key Management</h3>
            <button className="btn" onClick={generateKeys}>Generate Keys</button>
            {keys.publicKey && (
                <div className="output-group">
                    <h4>Public Key:</h4>
                    <textarea value={keys.publicKey} readOnly rows="4" cols="50" />
                    <button className="btn" onClick={() => saveToFile(keys.publicKey, 'publicKey.txt')}>
                        Save Public Key to File
                    </button>
                </div>
            )}
            {keys.privateKey && (
                <div className="output-group">
                    <h4>Private Key:</h4>
                    <textarea value={keys.privateKey} readOnly rows="4" cols="50" />
                    <button className="btn" onClick={() => saveToFile(keys.privateKey, 'privateKey.txt')}>
                        Save Private Key to File
                    </button>
                </div>
            )}

            <hr />

            <h3>Verify Signature</h3>
            <div className="input-group">
                <label>Select File to Verify:</label>
                <input type="file" onChange={handleFileChange} />
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
