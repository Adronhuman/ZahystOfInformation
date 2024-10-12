
const server = "https://localhost:7078";
const apiUrl = `${server}/api`;

export interface Md5HashResponse {
    hash: string;
}

export const requestStringHash = async (str: string): Promise<string> => {
    const requestBody = {
        str
    };

    try {
        const response = await fetch(`${apiUrl}/md5-string`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const res: Md5HashResponse = await response.json();
        return res.hash;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const requestFileHash = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch(`${apiUrl}/md5-file`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const res: Md5HashResponse = await response.json();
        return res.hash;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};