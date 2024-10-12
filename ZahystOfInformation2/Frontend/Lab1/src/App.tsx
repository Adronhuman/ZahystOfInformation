import React from "react";
import variantImg from './assets/variant.png'
import LehmerGenerator from './lehmerGenerator';
import { GeneratorState } from "./context/types";
import { getDefaultValue, GeneratorContext } from "./context";

import './App.css';

function App() {
  const [state, setState] = React.useState<GeneratorState>(getDefaultValue());
  state.updateContext = setState;

  return (
    <GeneratorContext.Provider value={state}>
      <img src={variantImg} alt="My variant parameters screen" />
      <LehmerGenerator/>
    </GeneratorContext.Provider>
  )
}

export default App;
