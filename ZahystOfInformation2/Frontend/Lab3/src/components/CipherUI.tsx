import React from "react";
import { StateContext } from "../context";
import CipherText from "./CipherText";
import CipherFile from "./CipherFile";
import InputTypeSelection from "./InputTypeSelection";

const CipherUI: React.FC = () => {
    const { inputType } = React.useContext(StateContext);

    return <>
        <InputTypeSelection/>
        {inputType == "text" && <CipherText/>}
        {inputType == "file" && <CipherFile/>}
    </>
}

export default CipherUI;
