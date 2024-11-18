import React, { useState, ChangeEvent } from 'react';
import { FaCopy, FaDownload, FaLock, FaUnlock } from 'react-icons/fa';
import { LoadingOverlay } from '../common/Overlay';
import { RsaToolContext } from '../state';
import { encrypt, decrypt, encryptFile, decryptFile } from '../api';
import { FileKeyPair } from '../api/types';
import { Spinner } from '../common/Spinner';
import { toast } from 'react-toastify';

type StringOperation = (keyPair: FileKeyPair, message: string) => Promise<{result: string}>;
type FileOperation = (keyPair: FileKeyPair, message: File) => Promise<string>;

function verifyKeyForOperation(operation: string, keys: FileKeyPair): boolean {
  if (operation === 'cipher' && keys.public) {
    return true;
  }
  if (operation === 'decipher' && keys.private){
    return true;
  }
  toast.error(`${operation == 'cipher' ? 'public': 'private'} key is missing!`);
  return false;
}

function getStrOperation(operation: string): StringOperation {
  if (operation === 'cipher') {
    return encrypt;
  }
  return decrypt;
}

function getFileOperation(operation: string): FileOperation {
  if (operation === 'cipher') {
    return encryptFile;
  }
  return decryptFile;
}

const CipherForm: React.FC = () => {
  const state = React.useContext(RsaToolContext);
  const [spinner, setSpinner] = useState(false);
  const [inputMode, setInputMode] = useState<'text' | 'file'>('text');
  const [operation, setOperation] = useState<'cipher' | 'decipher'>('cipher');
  const [textInput, setTextInput] = useState('');
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [result, setResult] = useState('');

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setTextInput(e.target.value);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFileInput(file);
  };

  const handleModeToggle = () => {
    setInputMode(inputMode === 'text' ? 'file' : 'text');
    setTextInput('');
    setFileInput(null);
  };

  const handleOperationChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setOperation(e.target.value as 'cipher' | 'decipher');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
  };

  const handleDownload = () => {
    const blob = new Blob([result], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${operation}-result.txt`;
    link.click();
  };

  const handleProcess = () => {
    const finish = (v: string) => {
      console.log('finish', finish);
      setResult(v);
      setSpinner(false);
    }

    if (inputMode === 'text') {
      const apiCall = getStrOperation(operation);
      if (verifyKeyForOperation(operation, state.keyPair!))
         apiCall(state.keyPair!, textInput).then(r => r.result).then(finish);
    } else {
      const apiCall = getFileOperation(operation);
      if (!fileInput) {
        toast.error("Upload file!");
        return;
      }
      if (verifyKeyForOperation(operation, state.keyPair!))
        apiCall(state.keyPair!, fileInput!).then(finish);
    }
  };

  return (
    <div style={styles.container}>
      <LoadingOverlay active={!state.keyPair || spinner} />
      {spinner && <Spinner/>}
      <div style={styles.section}>
        <button onClick={handleModeToggle} style={styles.toggleButton}>
          {inputMode === 'text' ? 'Switch to File Input' : 'Switch to Text Input'}
        </button>
        
        {inputMode === 'text' ? (
          <textarea
            placeholder="Enter text here..."
            value={textInput}
            onChange={handleTextChange}
            style={styles.textarea}
          />
        ) : (
          <div>
            <input type="file" onChange={handleFileChange} style={styles.fileInput} />
            {fileInput && <p>Selected file: {fileInput.name}</p>}
          </div>
        )}
        
        <div style={styles.selectGroup}>
          <label>
            Operation:
            <select value={operation} onChange={handleOperationChange} style={styles.select}>
              <option value="cipher">Cipher</option>
              <option value="decipher">Decipher</option>
            </select>
          </label>
        </div>
        
        <button onClick={handleProcess} style={styles.actionButton}>
          {operation === 'cipher' ? <FaLock /> : <FaUnlock />} {operation === 'cipher' ? 'Cipher' : 'Decipher'}
        </button>
      </div>
      
      <div style={styles.section}>
        <textarea
          value={result}
          readOnly
          placeholder="Result will appear here..."
          style={styles.textarea}
        />
        <div style={styles.buttonGroup}>
          <button onClick={handleCopy}>
            <FaCopy /> Copy
          </button>
          <button onClick={handleDownload}>
            <FaDownload /> Download
          </button>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
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
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  textarea: {
    width: '100%',
    height: '100px',
    padding: '10px',
    resize: 'none',
    fontFamily: 'monospace',
    fontSize: '14px',
    backgroundColor: '#f0f0f0',
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxSizing: 'border-box',
  },
  fileInput: {
    marginTop: '10px',
  },
  selectGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '10px',
  },
  select: {
    padding: '5px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
    cursor: 'pointer',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
  },
  actionButton: {
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    backgroundColor: '#28a745',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  toggleButton: {
    padding: '8px 15px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    backgroundColor: '#17a2b8',
    color: 'white',
  },
};

export default CipherForm;
