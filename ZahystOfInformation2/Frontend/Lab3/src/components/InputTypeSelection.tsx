import React from 'react';
import { StateContext } from '../context';
import { InputType } from '../context/types';

const InputTypeSelection: React.FC = () => {
    const state = React.useContext(StateContext);
    const {inputType, disabled, changeState } = state;

    const setInputType = (inputType: InputType) => changeState({...state, inputType: inputType});

    return <>
    
    <label>
      <input disabled={disabled}
        type="radio"
        value="multiline"
        checked={inputType === 'text'}
        onChange={() => setInputType('text')}
      />
      Multiline Text
    </label>

    <label>
      <input disabled={disabled}
        type="radio"
        value="file"
        checked={inputType === 'file'}
        onChange={() => setInputType('file')}
      />
      File
    </label>
  </>
}

export default InputTypeSelection;