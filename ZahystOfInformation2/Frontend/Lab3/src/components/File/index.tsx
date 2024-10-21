import React from 'react';

export interface FileInputProps {
    disabled: boolean;
    setFile: (file: File) => void;
}

const FileInput: React.FC<FileInputProps> = ({disabled, setFile}) => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
          const file = event.target.files[0];
          setFile(file); // You can handle file content here if needed
        }
    };

    return <input disabled={disabled}
        type="file"
        onChange={handleFileChange}
        />
}

export default FileInput;
