import React from 'react';
import { MD5Context } from '../../context';
import { If, Then } from 'react-if';

export interface ResultDisplayProps {
    generatedHash: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({generatedHash}) => {
    const { mode } = React.useContext(MD5Context);
    
    return <>
        <If condition={mode === "hash"}>
           <Then>
            {() => <p>Hash: "{generatedHash}"</p>}
            </Then>
        </If>
    </>
}

export default ResultDisplay;