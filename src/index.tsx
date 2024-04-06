import './App.css';
import App from './App';
import { AppContextProvider } from './context/appContext';
import React from 'react';
import ReactDOM from 'react-dom/client';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <AppContextProvider>
    <App/>
  </AppContextProvider>
);
