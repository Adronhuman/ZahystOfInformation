
import React from 'react';
import ModeToggle from '../ModeToggle';
import InputTypeSelection from '../InputTypeSelection';
import { Case, Switch } from 'react-if';
import { MD5Context } from '../../context';
import Loader from '../Loader';
import FileInput from '../File';
import { requestFileHash, requestStringHash } from '../../api';
import ResultDisplay from './Result';
import { toast } from 'react-toastify';

const MD5: React.FC = () => {
    const { inputType, isValid, mode, expectedHash } = React.useContext(MD5Context);

    const [submitInProgress, setSubmitInProgress] = React.useState<boolean>(false);
    const [inputStr, setInputStr] = React.useState<string>('');
    const [file, setFile] = React.useState<File | undefined>();
    const [generatedHash, setHash] = React.useState<string | undefined>();

    React.useEffect(() => {
        if (submitInProgress) return;

        if (mode === "verify" && generatedHash && expectedHash) {
            const isTheSame = generatedHash.toLocaleLowerCase() == expectedHash.toLocaleLowerCase();
            if (isTheSame) {
                toast("Signature is correct!");
            } else {
                console.log("toast warning");
                toast.warning("Signature is not the same🤔");
            }
        }
    }, [generatedHash, submitInProgress]);

    React.useEffect(() => {
        setHash(undefined);
        setFile(undefined);
    }, [mode])

    const submit = async () => {
        setSubmitInProgress(true);
        
        if (inputType === "string" || inputType === "multiline") {
            const hash = await requestStringHash(inputStr);
            setHash(hash);
        }
        else if (file) {
            const hash = await requestFileHash(file);
            setHash(hash);
        }

        setSubmitInProgress(false);
    }

    console.log(inputStr, typeof inputStr);
    return <>
        <h1>MD5</h1>
        <ModeToggle disabled={submitInProgress}/>
        <div>
          <InputTypeSelection disabled={submitInProgress}/>
            <button 
                onClick={submit}
                disabled={submitInProgress || !isValid}
                >
                Run
            </button>
        </div>
      
        <Switch>
            <Case condition={inputType === "string"}>
                <input disabled={submitInProgress}
                    type="text"
                    placeholder="Enter string"
                    value={inputStr}
                    onChange={(e) => setInputStr(e.target.value)}
                    />
            </Case>
            <Case condition={inputType === "multiline"}>
                <textarea style={{minWidth: 300, minHeight:200}} disabled={submitInProgress}
                    placeholder="Enter multiline text"
                    value={inputStr}
                    onChange={(e) => setInputStr(e.target.value)}
                    />
            </Case>
            <Case condition={inputType === "file"}>
                <FileInput disabled={submitInProgress} setFile={setFile}/>
            </Case>
        </Switch>

        {submitInProgress && <Loader/>}
        {generatedHash && <ResultDisplay generatedHash={generatedHash}/>}
    </>
}

export default MD5;
