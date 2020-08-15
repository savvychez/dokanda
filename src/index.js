import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios'
import App from './App';
require('dotenv').config()


axios.defaults.baseURL = process.env.HOST || 'http://localhost:5000'; //TODO switch to URL from config.js or from dotenv

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
