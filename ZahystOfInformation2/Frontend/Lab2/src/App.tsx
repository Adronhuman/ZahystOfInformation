import React from 'react'
import './App.css'
import { defaultState, MD5Context } from './context';
import { MD5State } from './context/types';
import MD5 from './components/MD5';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';


const App: React.FC = () => {
  const [state, setState] = React.useState<MD5State>(defaultState);
  state.changeState = setState;

  console.log("state", state);

  // const [inputValue, setInputValue] = React.useState<string>('');

  // const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLInputElement>) => {
  //   setInputValue(event.target.value);
  // };

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.files && event.target.files.length > 0) {
  //     const file = event.target.files[0];
  //     setInputValue(file.name); // You can handle file content here if needed
  //   }
  // };

  return (
    <MD5Context.Provider value={state}>
    <div className="App">
      <MD5/>
      <ToastContainer/>
      </div>
  </MD5Context.Provider>
  );
};

export default App
