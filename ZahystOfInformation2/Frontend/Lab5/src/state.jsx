import { createContext } from 'react';

export const RsaConfigDefault = {
    setKeyPair: (kp) => {}
}

export const RsaToolContext = createContext(RsaConfigDefault);