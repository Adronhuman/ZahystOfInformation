import React from 'react';
import { State } from "./types";

export const defaultState: State = {
    inputType: "text",
    disabled: false,
    changeState: () => {}
};

export const StateContext = React.createContext<State>(defaultState);