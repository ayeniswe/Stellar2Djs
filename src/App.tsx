import InspectorPanel from './features/InspectorPanel';
import React from 'react';
import Scene from './features/Scene';
import SceneControls from './features/Scene/components/Controls';
import Toolbar from './features/Toolbar';

const App = () => (
  <div id="App" className="App">
    <div className='scene-panel-controls'>
      <InspectorPanel/>
      <Scene/>
      <SceneControls/>
    </div>
    <Toolbar/>
  </div>
);

export default App;
