import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaCopy, FaDownload } from 'react-icons/fa';
import { generateKeyPair } from '../api';
import { KeyPair } from '../api/types';
import { Spinner } from '../common/Spinner';
import { When } from 'react-if';

const KeyPairGenerator: React.FC = () => {
  const [spinner, setSpinner] = React.useState<boolean>();
  const [keyPair, setKeyPair] = React.useState<KeyPair>();
  const [showPrivateKey, setShowPrivateKey] = useState<boolean>(false);

  const publicKey: string = '-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----';
  const privateKey: string = '-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----';

  const handleCopy = (keyType: 'public' | 'private') => {
    const key = keyType === 'public' ? publicKey : privateKey;
    navigator.clipboard.writeText(key);
    alert(`Copied ${keyType} key to clipboard`);
  };

  const handleDownload = (key: string, filename: string) => {
    const blob = new Blob([key], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="key-container" style={styles.container}>
      <button 
        style={{backgroundColor: "#26ff91", width: "100px", height: "30px"}}
        onClick={async () => {
          setSpinner(true);
          const keyPair = await generateKeyPair();
          setKeyPair(keyPair);
          setSpinner(false);
        }}
        >
          Generate
      </button> {spinner && <Spinner/>}
      <When condition={!!keyPair}>
        {() =>  {
          const publicKey = keyPair!.public;
          const privateKey = keyPair!.private;
          
          return <>
          <div className="key-section" style={styles.section}>
            <textarea
              readOnly
              value={publicKey}
              style={styles.textarea}
            ></textarea>
            <div style={styles.buttonGroup}>
              <button onClick={() => handleCopy('public')}>
                <FaCopy /> Copy
              </button>
              <button onClick={() => handleDownload(publicKey, 'public_key.pem')}>
                <FaDownload /> Download
              </button>
            </div>
          </div>

          <div className="key-section" style={styles.section}>
            <h3>Private Key</h3>
            <textarea
              readOnly
              value={showPrivateKey ? privateKey : '************'}
              style={styles.textarea}
            ></textarea>
            <div style={styles.buttonGroup}>
              <button onClick={() => setShowPrivateKey(!showPrivateKey)}>
                {showPrivateKey ? <FaEyeSlash /> : <FaEye />} {showPrivateKey ? 'Hide' : 'Show'}
              </button>
              <button onClick={() => handleCopy('private')}>
                <FaCopy /> Copy
              </button>
              <button onClick={() => handleDownload(privateKey, 'private_key.pem')}>
                <FaDownload /> Download
              </button>
            </div>
          </div>
          </>
          }
        }
      </When>
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
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  textarea: {
    width: '95%',
    height: '100px',
    padding: '10px',
    resize: 'none',
    fontFamily: 'monospace',
    fontSize: '14px',
    backgroundColor: '#f0f0f0',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
  },
};

export default KeyPairGenerator;
