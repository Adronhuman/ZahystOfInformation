import React, { ReactNode } from 'react';
import './LehmerGenerator.css';
import ParametersForm from './parametersForm';
import NumbersDisplay from './sequence';
import { generateLehmerSequence, requestCesaroTest } from '../api';
import { GeneratorContext } from '../context';

const LehmerGenerator: React.FC = () => {
  const state = React.useContext(GeneratorContext);
  const {parameters, n, generatedSequence} = state;

  const setN = (N: number | string) => state.updateContext({...state, n: N});
  const setSequence = (arr: number[]) => state.updateContext({...state, generatedSequence: arr});

  const [display, setDisplay] = React.useState<React.ReactNode>(null);

  React.useEffect(() => {
    const something: ReactNode = generatedSequence && <NumbersDisplay numbers={generatedSequence} />;
    setDisplay(something);
  }, [generatedSequence]);

  return (
    <div className="lehmer-container">
      <h1>Lehmer Random Number Generator</h1>

      <ParametersForm/>

      <div className="input-group">
        <label htmlFor="n">N:</label>
        <input
          type="number"
          id="n"
          value={n}
          onChange={(e) => setN(e.target.valueAsNumber || '')}
        />
        <button className="edit-button" onClick={async () => {
          const sequence = await generateLehmerSequence(parameters, Number(n));
          setSequence(sequence);
        }}>Generate</button>
        <br />

        <button className="edit-button" onClick={async () => {
          if (!generatedSequence) {
            alert("Can't do shit without sequence!");
            return;
          }
          const estimatedPi = await requestCesaroTest(generatedSequence);
          const forDisplay = <>
            Estimated π: {estimatedPi}
            Real π: {Math.PI}
          </>
          setDisplay(forDisplay);
        }}>CesaroTest</button>
        <br />
        {display}
      </div>
    </div>
  );
};

export default LehmerGenerator;
