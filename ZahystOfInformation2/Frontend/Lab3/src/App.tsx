import React from 'react'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { State } from './context/types';
import { defaultState, StateContext } from './context';
import CipherUI from './components/CipherUI';

import './App.css';

function App() {
  const [state, setState] = React.useState<State>(defaultState);
  defaultState.changeState = setState;

  return <StateContext.Provider value={state}>
    <CipherUI/>
    <ToastContainer/>
  </StateContext.Provider>
}

export default App
