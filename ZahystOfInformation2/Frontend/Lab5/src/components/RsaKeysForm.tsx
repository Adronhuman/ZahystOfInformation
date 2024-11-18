import React from 'react';
import {toast} from "react-toastify";
import { RsaToolContext } from '../state';

export const RsaKeysForm: React.FC = () => {
    const state = React.useContext(RsaToolContext);
    const [publicPem, setPublicPem] = React.useState<File>();
    const [privatePem, setPrivatePem] = React.useState<File>();
    
    React.useEffect(() => {
        if (publicPem || privatePem) {
            toast.success("Keys loaded!");
            state.setKeyPair({public: publicPem, private: privatePem});
        }
    }, [publicPem, privatePem]);

    const process = (key: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = (event.target as HTMLInputElement).files![0];

        if (key == 'public') setPublicPem(file);
        else setPrivatePem(file);
    }

    return <>
        <div style={styles.container}>
            <div>
                <span style={styles.text}>Public key:</span>
                <span style={styles.text}>
                    <input type='file' accept=".pem,application/x-pem-file" onChange={(event) => process('public', event)}/>
                </span>
            </div>
            <div>
                <span style={styles.text}>Private key:</span>
                <span style={styles.text}>
                    <input type='file' accept=".pem,application/x-pem-file" onChange={(event) => process('private', event)}/>
                </span>
            </div>
        </div>
    </>
}

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
      marginBottom: '10px'
    },
    text: {
        color: "black",
        paddingRight: "5px"
    }
}