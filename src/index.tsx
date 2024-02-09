import ReactDOM from 'react-dom/client';
import './App.css';
import App from './App';
import { AppContextProvider } from './context/appContext';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <AppContextProvider>
    <App/>
  </AppContextProvider>
);