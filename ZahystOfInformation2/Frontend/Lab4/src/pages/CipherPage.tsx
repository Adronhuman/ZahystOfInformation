import React from "react";
import CipherForm from "../components/CipherForm";
import { RsaKeysForm } from "../components/RsaKeysForm";
import { RsaConfig, RsaConfigDefault, RsaToolContext } from "../state";

const CipherPage: React.FC = () => {
    const [state, setState] = React.useState<RsaConfig>(RsaConfigDefault);
    state.setKeyPair = (v) => setState(state_ => ({...state_, keyPair: v}));

    return <RsaToolContext.Provider value={state}>
        <RsaKeysForm/>
        <CipherForm/>
    </RsaToolContext.Provider>
}

export default CipherPage;