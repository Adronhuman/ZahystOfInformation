import React from "react";
import { GeneratorState, Parameters } from "./types";


function getMyVariantParameters(): Parameters {
  return { m: Math.pow(2, 24) - 1, a: Math.pow(11, 3), c: 610, x0: 9, addNoise: false };
}

export const getDefaultValue = (): GeneratorState => {
  return {
    parameters: getMyVariantParameters(), 
    n: '',
    updateContext: (_) => {}
  };
}

export const GeneratorContext = React.createContext<GeneratorState>(getDefaultValue());