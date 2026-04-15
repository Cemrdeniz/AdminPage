// src/main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client'; // Bu satır eksik olduğu için hata alıyorsun
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);