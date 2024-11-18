import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createHashRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";

import { ToastContainer } from 'react-toastify';
import Layout from './layout/Layout'
import GenerateKeys from "./components/KeyPair"
import DSSApp from './components/DSSApp'
import { RsaKeysForm } from "./components/RsaKeysForm";
import { RsaConfigDefault, RsaToolContext } from "./state";

import 'react-toastify/ReactToastify.css';
import './index.css'

function DSAPage() {
  const [state, setState] = React.useState(RsaConfigDefault);
  state.setKeyPair = (v) => setState(state_ => ({...state_, keyPair: v}));

  return <RsaToolContext.Provider value={state}>
    <RsaKeysForm/>
    <DSSApp/>
  </RsaToolContext.Provider>
}

const router = createHashRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout/>}>
      <Route index element={<Navigate to="/dsa" />} />
      <Route path="/generate-keys" element={<GenerateKeys/>} />
      <Route path="/dsa" element={<DSAPage/>}/>
      {/* <Route path="/rsa" element={<CipherPage/>} /> */}
    </Route>
  ),
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastContainer/>
    <RouterProvider router={router} />
  </StrictMode>,
)
