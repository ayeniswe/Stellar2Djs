import './style.css';
import add from '../../assets/images/icons/add.png';
import { ANIMATION_PLAYER } from './constants';
import AnimationDisplay from './components/AnimationDisplay';
import Button from '../../components/Button';
import cancel from '../../assets/images/icons/delete.png';
import Controls from './components/Controls';
import React from 'react';
import SpriteAnimation from './components/SpriteAnimation';
import Timeline from './components/Timeline';
import { useAppContext } from '../../context/appContext';

/**
 * Plays one animation and displays a preview of the current frame.
 * @returns {JSX.Element} - The rendered AnimationPlayer component.
 */
const AnimationPlayer = () => {
  const { timeline, spriteAnimation } = useAppContext();

  return (
    <div data-cy="animation-player" className="AnimationPlayer">
      <div className="AnimationPlayerGroup AnimationPlayerGroup--col AnimationPlayerGroup--margined">
        <Controls/>
        <SpriteAnimation/>
      </div>
      <Timeline/>
      <div className="AnimationPlayerGroup AnimationPlayerGroup--margined AnimationPlayerGroup--col">
        <div className="AnimationPlayerGroup">
          <Button
            action={spriteAnimation.loadFrame}
            imgSrc={add}
            label="Add Frame"
            type="file"
            title="Add a new frame"
            cy="add-animation-frame"
          />
          <Button
            action={timeline.removeFrame}
            imgSrc={cancel}
            label="Delete Frame"
            title="Delete the current frame"
            cy="delete-animation-frame"
          />
        </div>
        <AnimationDisplay/>
      </div>
    </div>
  );
};

export default AnimationPlayer;
export { ANIMATION_PLAYER };
