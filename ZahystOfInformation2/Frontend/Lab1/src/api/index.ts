import { Parameters } from "../context/types";

interface GenerateLehmerSequenceRequest {
    a: number;
    m: number;
    c: number;
    x0: number;
    n: number;
}

interface GenerateLehmerSequenceResponse {
    sequence: number[];
}

interface CesaroTestResponse {
    estimatedPi: number;
}

const server = "https://localhost:7078";
const apiUrl = `${server}/api`;

export const generateLehmerSequence = async (parameters: Parameters, n: number): Promise<number[]> => {
    const requestBody: GenerateLehmerSequenceRequest = {
        ...parameters,
        n: n
    };

    try {
        const response = await fetch(`${apiUrl}/lehmer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result: GenerateLehmerSequenceResponse = await response.json();
        return result.sequence;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export const requestCesaroTest = async (sequence: number[]): Promise<number> => {
    const requestBody = { sequence };
    console.log(requestBody);

    try {
        const response = await fetch(`${apiUrl}/cesaro`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result: CesaroTestResponse = await response.json();
        // console.log(result);
        return result.estimatedPi;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};