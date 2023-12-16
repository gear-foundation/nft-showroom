import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App.tsx';
import '@gear-js/vara-ui/dist/style.css';
import './index.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
