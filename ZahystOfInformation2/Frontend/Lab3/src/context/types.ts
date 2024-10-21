export type InputType = "text" | "file";

export interface State {
    inputType: InputType;
    disabled: boolean;
    changeState: (newState: State) => void;
}