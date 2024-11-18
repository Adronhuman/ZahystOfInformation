import { createContext } from 'react';
import { FileKeyPair } from './api/types';

export interface RsaConfig {
    keyPair?: FileKeyPair;
    setKeyPair: (v: FileKeyPair) => void; 
}

export const RsaConfigDefault: RsaConfig = {
    setKeyPair: () => {}
}

export const RsaToolContext = createContext<RsaConfig>(RsaConfigDefault);