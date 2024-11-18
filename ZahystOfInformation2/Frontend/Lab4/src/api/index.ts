import { toast } from "react-toastify";
import {KeyPair, FileKeyPair} from "./types";

const server = "https://localhost:7078";
const apiUrl = `${server}/api`;

function isBadRequest(res: Response): boolean {
    if (!res.ok){
        if (res.status === 400) {
            res.json().then(err => { toast.error(err.message) });
        }
        return true;
    }
    return false;
}

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

export async function encrypt(keyPair: FileKeyPair, message: string): Promise<{result: string}> {
    const formData = new FormData();
    formData.append("publicPem", keyPair.public!);
    formData.append("message", message);

    const response = await fetch(`${apiUrl}/rsa-encrypt`, {
        method: 'POST',
        body: formData
    });

    return response.json();
}

export async function decrypt(keyPair: FileKeyPair, message: string): Promise<{result: string}> {
    const formData = new FormData();
    formData.append("privatePem", keyPair.private!);
    formData.append("message", message);

    const response = await fetch(`${apiUrl}/rsa-decrypt`, {
        method: 'POST',
        body: formData
    });

    if (isBadRequest(response)){
        throw Error("couldn't do it");
    }

    return response.json();
}

export async function encryptFile(keyPair: FileKeyPair, data: File): Promise<string> {
    const formData = new FormData();
    formData.append("publicPem", keyPair.public!);
    formData.append("file", data);

    const queryParams = new URLSearchParams();
    queryParams.append("isFile", "true");

    const response = await fetch(`${apiUrl}/rsa-encrypt?` + queryParams.toString(), {
        method: 'POST',
        body: formData
    });

    
    if (isBadRequest(response)){
        throw Error("couldn't do it");
    }

    const blob = await response.blob();
    downloadFile(blob, data.name[0] + "_encrypted.bin");
    return "Encrypted file will be downloaded...";
}

export async function decryptFile(keyPair: FileKeyPair, data: File): Promise<string> {
    const formData = new FormData();
    formData.append("privatePem", keyPair.private!);
    formData.append("file", data);

    const queryParams = new URLSearchParams();
    queryParams.append("isFile", "true");

    const response = await fetch(`${apiUrl}/rsa-decrypt?` + queryParams.toString(), {
        method: 'POST',
        body: formData
    });

    
    if (isBadRequest(response)){
        throw Error("couldn't do it");
    }

    const blob = await response.blob();
    downloadFile(blob, data.name[0] + "_decrypted.bin");
    return "Decrypted file will be downloaded...";
}

export async function generateKeyPair(): Promise<KeyPair> {
    const response = await fetch(`${apiUrl}/rsa-generate-key-pair`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return response.json();
}