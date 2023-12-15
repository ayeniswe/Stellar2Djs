import ReactDOM from 'react-dom/client';
import './assets/styles/Game.css';
import Game from './Game';

document.addEventListener('DOMContentLoaded', () => {
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );
  root.render( <Game/> );
});