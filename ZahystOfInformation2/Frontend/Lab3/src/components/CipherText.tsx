import React from 'react';
import { decryptString, encryptString } from '../api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from "@fortawesome/free-solid-svg-icons";

const CipherText: React.FC = () => {
  const [password, setPassword] = React.useState('');
  const [text, setText] = React.useState('');
  const [result, setResult] = React.useState('');

  const onSubmit = async (decrypt: boolean) => {
    if (!decrypt){
        const encrypted = await encryptString(text, password);
        setResult(encrypted);
    } else {
        const decrypted = await decryptString(text, password);
        setResult(decrypted);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px', margin: '0 auto' }}>
      <label htmlFor="password-input">Password:</label>
      <input
        id="password-input"
        type="text"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      />

      <label htmlFor="text-input">Text:</label>
      <textarea
        id="text-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text"
        rows={5}
        style={{ width: '100%', padding: '8px' }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button style={{ padding: '10px 20px' }} onClick={() => onSubmit(false)}>Encrypt</button>
        <button style={{ padding: '10px 20px' }} onClick={() => onSubmit(true)}>Decrypt</button>
      </div>

      <label htmlFor="result-output">Result:</label>
      <textarea
        id="result-output"
        value={result}
        readOnly
        rows={5}
        placeholder="Result will appear here"
        style={{
          width: '100%',
          padding: '8px',
          backgroundColor: '#f0f0f0',
          color: '#333',
          fontWeight: 'bold',
          marginTop: '10px',
          border: '2px solid #ccc',
        }}
      />
      
    {result && <div className="copy-button"
     onClick={() => {
        navigator.clipboard.writeText(result);
     }}>
        <FontAwesomeIcon icon={faCopy}/>
    </div>
    }
    </div>
  );
};

export default CipherText;