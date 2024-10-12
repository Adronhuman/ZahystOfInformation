export type Md5Mode = "hash" | "verify";
export type InputType = "string" | "multiline" | "file";

export interface MD5State {
    mode: Md5Mode;
    inputType: InputType;
    expectedHash: string | undefined;
    isValid: boolean;
    changeState: (newState: MD5State) => void;
}