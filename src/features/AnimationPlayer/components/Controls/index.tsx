import '../../style.css';
import FPS from './components/FPS';
import Playback from './components/Playback';
import React from 'react';

/**
 * The controls of the animation player.
 * @returns {JSX.Element} - The rendered Controls component.
 */
const Controls = () => (
  <div className="AnimationPlayerControls grouping">
    <FPS/>
    <Playback/>
  </div>
);

export default Controls;
