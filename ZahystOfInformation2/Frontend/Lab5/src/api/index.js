import { toast } from "react-toastify";

const server = "https://localhost:7078";
const apiUrl = `${server}/api`;

function isBadRequest(res) {
    if (!res.ok){
        if (res.status === 400) {
            res.json().then(err => { toast.error(err.message) });
        }
        return true;
    }
    return false;
}

function downloadFile(blob, fileName) {
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

export async function sign(privateKey, message) {
    const formData = new FormData();
    formData.append("privatePem", privateKey);
    formData.append("message", message);

    const response = await fetch(`${apiUrl}/dsa-signature`, {
        method: 'POST',
        body: formData
    });

    return await response.json();
}

export async function signFile(privateKey, file) {
    const formData = new FormData();
    formData.append("privatePem", privateKey);
    formData.append("file", file);

    const queryParams = new URLSearchParams();
    queryParams.append("isFile", "true");
    const response = await fetch(`${apiUrl}/dsa-signature?` + queryParams.toString(), {
        method: 'POST',
        body: formData
    });

    return await response.json();
}

export async function verify(publicKey, message, signatureFile) {
    const formData = new FormData();
    formData.append("publicPem", publicKey);
    formData.append("message", message);
    formData.append("signature", signatureFile);

    const response = await fetch(`${apiUrl}/dsa-verify`, {
        method: 'POST',
        body: formData
    });

    return await response.json();
}

export async function verifyFile(publicKey, file, signatureFile) {
    const formData = new FormData();
    formData.append("publicPem", publicKey);
    formData.append("file", file);
    formData.append("signature", signatureFile);

    const queryParams = new URLSearchParams();
    queryParams.append("isFile", "true");
    const response = await fetch(`${apiUrl}/dsa-verify?` + queryParams.toString(), {
        method: 'POST',
        body: formData
    });

    return await response.json();
}

export async function encrypt(keyPair, message) {
    const formData = new FormData();
    formData.append("publicPem", keyPair.public);
    formData.append("message", message);

    const response = await fetch(`${apiUrl}/rsa-encrypt`, {
        method: 'POST',
        body: formData
    });

    return response.json();
}

export async function decrypt(keyPair, message) {
    const formData = new FormData();
    formData.append("privatePem", keyPair.private);
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

export async function encryptFile(keyPair, data) {
    const formData = new FormData();
    formData.append("publicPem", keyPair.public);
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

export async function decryptFile(keyPair, data) {
    const formData = new FormData();
    formData.append("privatePem", keyPair.private);
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

export async function generateKeyPair(){
    const response = await fetch(`${apiUrl}/dsa-generate-key-pair`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return response.json();
}