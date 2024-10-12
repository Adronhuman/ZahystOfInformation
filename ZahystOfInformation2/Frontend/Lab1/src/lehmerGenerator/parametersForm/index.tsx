import React, { useState } from 'react';
import { Parameters } from '../../context/types';
import { GeneratorContext } from '../../context';

const ParametersForm: React.FC = () => {
  const state = React.useContext(GeneratorContext);
  const {parameters: {a,m,c,x0}, updateContext} = React.useContext(GeneratorContext);
  // const {a,m,c,x0} = parameters;

  const onChange = (prms: Parameters) => {
    updateContext({...state, parameters: prms});
  }

  const [isEditable, setIsEditable] = useState(false);
  const [formValues, setFormValues] = useState({ a: a.toString(), m: m.toString(), c: c.toString(), x0: x0.toString() });
  const [addNoise, setNoise] = useState(false);
  const [errors, setErrors] = useState({ a: '', m: '', c: '', x0: '' });

  const handleEditClick = () => {
    if (isEditable) {
      const validated = validateForm();
      if (!validated) return;
    }
    setIsEditable(!isEditable);
  };

  const validateForm = () => {
    const newErrors = { a: '', m: '', c: '', x0: '' };
    let isValid = true;

    // Validate each input to ensure it's a number
    for (const key in formValues) {
      if (formValues[key as keyof typeof formValues].trim() === '' || isNaN(Number(formValues[key as keyof typeof formValues]))) {
        newErrors[key as keyof typeof formValues] = 'Invalid number';
        isValid = false;
      }
    }

    setErrors(newErrors);
    if (isValid) {
      // Update the main values only if the form is valid
      const updatedParams: Parameters = {a: Number(formValues.a), m: Number(formValues.m), c: Number(formValues.c), x0: Number(formValues.x0), addNoise: false};
      onChange({...updatedParams, addNoise: addNoise});
    }
    return isValid;
  };

  const handleInputChange = (key: string, value: string) => {
    setFormValues({ ...formValues, [key]: value });
  };

  return (
    <div className="parameters-form">
      <label htmlFor="a">a:</label>
      <input
        type="text"
        id="a"
        value={formValues.a}
        onChange={(e) => handleInputChange('a', e.target.value)}
        readOnly={!isEditable}
        className={errors.a ? 'input-error' : ''}
      />
      {errors.a && <span className="error-message">{errors.a}</span>}

      <label htmlFor="m">m:</label>
      <input
        type="text"
        id="m"
        value={formValues.m}
        onChange={(e) => handleInputChange('m', e.target.value)}
        readOnly={!isEditable}
        className={errors.m ? 'input-error' : ''}
      />
      {errors.m && <span className="error-message">{errors.m}</span>}

      <label htmlFor="c">c:</label>
      <input
        type="text"
        id="c"
        value={formValues.c}
        onChange={(e) => handleInputChange('c', e.target.value)}
        readOnly={!isEditable}
        className={errors.c ? 'input-error' : ''}
      />
      {errors.c && <span className="error-message">{errors.c}</span>}

      <label htmlFor="x0">x₀:</label>
      <input
        type="text"
        id="x0"
        value={formValues.x0}
        onChange={(e) => handleInputChange('x0', e.target.value)}
        readOnly={!isEditable}
        className={errors.x0 ? 'input-error' : ''}
      />
      {errors.x0 && <span className="error-message">{errors.x0}</span>}

      <label htmlFor="noise">Add noise?</label>
      <input
        type="checkbox"
        id="noise"
        checked={addNoise}
        onChange={(e) => setNoise(e.target.checked)}
        disabled={!isEditable}
        className={errors.x0 ? 'input-error' : ''}
      />

      <button className="edit-button" onClick={handleEditClick}>
        {isEditable ? 'Save' : 'Edit'}
      </button>
    </div>
  );
};

export default ParametersForm;
