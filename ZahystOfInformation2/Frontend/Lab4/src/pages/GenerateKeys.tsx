import "react";
import KeyPairGenerator from "../components/KeyPair";

const GenerateKeys: React.FC = () => {
    return <>
        <h2>Private&Public key pair</h2>
        <KeyPairGenerator/>
    </>
}

export default GenerateKeys;
