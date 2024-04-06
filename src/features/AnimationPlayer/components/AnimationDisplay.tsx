import '../style.css';
import { ANIMATION_PLAYER } from '../constants';
import React from 'react';
import { useAppContext } from '../../../context/appContext';

const AnimationDisplay = () => {
  const { timeline, spriteAnimation } = useAppContext();
  return (
    <div id={ANIMATION_PLAYER.DISPLAY} className="AnimationDisplay">
      {timeline.frame.value ?
        <img data-cy="animation-display" src={timeline.frame.value.src}
          onDragStart={(e) => spriteAnimation.handleSpriteDragDrop(e)}/>
        :
        <div className="empty">No Animation Frames Found</div>
      }
    </div>
  );
};
export default AnimationDisplay;
