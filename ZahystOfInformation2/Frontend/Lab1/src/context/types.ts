export interface Parameters {
    a: number;
    m: number;
    c: number;
    x0: number;
    addNoise: boolean;
  }
  

export type UpdateContext = (newState: GeneratorState) => void;
export interface GeneratorState {
    parameters: Parameters;
    n: number | string;
    generatedSequence?: number[];
    updateContext: UpdateContext;
}
