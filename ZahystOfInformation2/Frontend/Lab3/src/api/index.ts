import { toast } from "react-toastify";

const server = "https://localhost:7078";
const apiUrl = `${server}/api`;

export interface Rc5Response {
    message: string;
}

export const encryptString = async (message: string, password: string): Promise<string> => {
    const requestBody = {message, password};

    try {
        const response = await fetch(`${apiUrl}/rc5-string-encrypt`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const res: Rc5Response = await response.json();
        return res.message;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const decryptString = async (message: string, password: string): Promise<string> => {
    const requestBody = {message, password};

    try {
        const response = await fetch(`${apiUrl}/rc5-string-decrypt`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (response.status.toString().startsWith("4")){
            toast.error("Bad request - wrong key");
            throw new Error(response.status.toString());
        }

        if (!response.ok) {
            toast.error("Network response was not ok");
            throw new Error('Network response was not ok');
        }


        const res: Rc5Response = await response.json();
        return res.message;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const encryptFile = async (file: File, password: string, name: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.set("password", password);

    try {
        const response = await fetch(`${apiUrl}/rc5-file-encrypt`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const res = await response.blob();
        downloadFile(res, `${name}_encrypted.bin`);
        
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const decryptFile = async (file: File, password: string, name: string, extension: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.set("password", password);

    try {
        const response = await fetch(`${apiUrl}/rc5-file-decrypt`, {
            method: 'POST',
            body: formData
        });

        if (response.status.toString().startsWith("4")){
            toast.error("Bad request - wrong key");
            throw new Error(response.status.toString());
        }

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const res = await response.blob();
        downloadFile(res, `${name}_decrypted.${extension}`);
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

function downloadFile(blob: Blob, fileName: string) {
    const file = window.URL.createObjectURL(blob);

    // Create a temporary anchor element
    const a = document.createElement('a');
    a.href = file;
    a.download = fileName;  // Specify the file name and extension

    // Append the anchor to the body, click it to trigger the download, then remove it
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Release the object URL to free up memory
    window.URL.revokeObjectURL(file);
}