import React from 'react';
import { decryptFile, encryptFile } from '../api';
import FileInput from './File';
import { toast } from 'react-toastify';

const CipherFile: React.FC = () => {
  const [password, setPassword] = React.useState('');
  const [file, setFile] = React.useState<File | undefined>(undefined);
  const [extension, setExtension] = React.useState('');

  const onSubmit = async (decrypt: boolean) => {
    if (!file) {
      toast.warn("attach some file🙁");
      return;
    }

    const fileInfo: string[] = file?.name.split(".");
    const name = fileInfo[0];
    // const extension = fileInfo[1];
    if (!decrypt){
        await encryptFile(file, password, name);
    } else {
        await decryptFile(file, password, name, extension);
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

      <label htmlFor="text-input">Input:</label>
      <FileInput setFile={setFile} disabled={false}/>

      <label htmlFor="fileext_input">File extension</label>
      <input
        id="fileext_input"
        type="text"
        value={extension}
        onChange={(e) => setExtension(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button style={{ padding: '10px 20px' }} onClick={() => onSubmit(false)}>Encrypt</button>
        <button style={{ padding: '10px 20px' }} onClick={() => onSubmit(true)}>Decrypt</button>
      </div>

      <label htmlFor="result-output">Result:</label>
      <textarea
        id="result-output"
        readOnly
        rows={5}
        placeholder="File will be downloaded..."
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

    </div>
  );
};

export default CipherFile;