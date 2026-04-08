<<<<<<< HEAD
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

console.log('main.jsx loaded');

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
=======
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
>>>>>>> 7b833e9 (hotfix/ui)
