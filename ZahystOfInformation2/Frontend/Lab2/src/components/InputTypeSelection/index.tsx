import React from 'react';
import { MD5Context } from '../../context';
import { InputType } from '../../context/types';

export interface InputTypeSelectionProps {
  disabled?: boolean;
}

const InputTypeSelection: React.FC<InputTypeSelectionProps> = ({disabled}) => {
    const state = React.useContext(MD5Context);
    const {inputType, changeState } = state;

    const setInputType = (inputType: InputType) => changeState({...state, inputType: inputType});

    return <>
    <label>
      <input disabled={disabled}
        type="radio"
        value="string"
        checked={inputType === 'string'}
        onChange={() => setInputType('string')}
      />
      String
    </label>

    <label>
      <input disabled={disabled}
        type="radio"
        value="multiline"
        checked={inputType === 'multiline'}
        onChange={() => setInputType('multiline')}
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
