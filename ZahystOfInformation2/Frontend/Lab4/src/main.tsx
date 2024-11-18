import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createHashRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";


import GenerateKeys from "./pages/GenerateKeys.tsx";
import CipherPage from './pages/CipherPage.tsx';
import Layout from './layout/Layout.tsx';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/ReactToastify.css';
import './index.css';

const router = createHashRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout/>}>
      <Route index element={<Navigate to="/rsa" />} />
      <Route index path="/generate-keys" element={<GenerateKeys/>} />
      <Route path="/rsa" element={<CipherPage/>} />
    </Route>
  ),
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastContainer/>
    <RouterProvider router={router} />
    </StrictMode>,
)
