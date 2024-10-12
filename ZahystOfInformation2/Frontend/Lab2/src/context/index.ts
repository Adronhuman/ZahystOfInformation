import React from 'react';
import { MD5State } from "./types";

export const defaultState: MD5State = {
    mode: "hash",
    inputType: "string",
    expectedHash: undefined,
    isValid: true,
    changeState: () => {}
};

export const MD5Context = React.createContext<MD5State>(defaultState);