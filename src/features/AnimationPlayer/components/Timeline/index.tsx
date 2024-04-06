import '../../style.css';
import React, { useEffect } from 'react';
import { ANIMATION_PLAYER } from '../..';
import FrameCollection from './components/FrameCollection';
import ProgressBars from './components/ProgressBars';
import { useAppContext } from '../../../../context/appContext';

/**
 * Displays the timeline for the length of the animation.
 * @returns {JSX.Element} - The rendered Timeline component.
 */
const Timeline = () => {
  const { timeline, timelineControls } = useAppContext();

  useEffect(() => timeline.initialize(), [timeline]);

  return (
    <div data-cy="timeline" id={ANIMATION_PLAYER.TIMELINE}>
      <FrameCollection/>
      <input data-cy="animation-timeline-display" className="display"
        onChange={(e) => timelineControls.changeSliderDisplay(e.target.value)} value={timeline.display.value}/>
      <div data-cy="animation-timeline-slider" id={ANIMATION_PLAYER.TIMELINE_SLIDER}>
        <div data-cy="animation-timeline-slider-thumb" id={ANIMATION_PLAYER.TIMELINE_SLIDER_THUMB}/>
      </div>
      <ProgressBars
        scaling={timeline.scale.value}
        step={2}
        width={timeline.width.value}
      />
    </div>
  );
};

export default Timeline;
