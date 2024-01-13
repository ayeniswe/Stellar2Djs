import ReactDOM from 'react-dom/client';
import './App.css';
import App from './App';

document.addEventListener('DOMContentLoaded', () => {
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );
  root.render( <App/> );
});