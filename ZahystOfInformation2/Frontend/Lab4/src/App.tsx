// import { useState } from 'react'
import {Link} from 'react-router-dom';


import './App.css'

function App() {

  return (
    <>
      <Link to="generate-keys">KeyGen</Link>
      <Link to ="/rsa">RSA</Link>
    </>
  )
}

export default App
