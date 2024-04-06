import '../../../style.css';
import React, { memo, useEffect } from 'react';
import { ANIMATION_PLAYER } from '../../..';
import { useAppContext } from '../../../../../context/appContext';

/**
 * A collection of frames to be displayed in the timeline.
 * @returns {JSX.Element} - The `memoized` rendered FrameCollection component.
 */
const FrameCollection = memo(() => {
  const { timeline, spriteAnimation } = useAppContext();

  useEffect(() => {}, [
    spriteAnimation.frames.value,
    spriteAnimation.creating.value,
    spriteAnimation.sprite.value,
    timeline.frames
      .value
  ]);

  return (
    <>
      <div className="TimelineFrameCollection" /> {/* 1st layer of frame collection to make it transparent*/}
      <div data-cy="animation-timeline-frame-collection" id={ANIMATION_PLAYER.TIMELINE_FRAME_COLLECTION}
        className="TimelineFrameCollection transparent">
        {timeline.showFrames()}
      </div>
    </>
  );
});

FrameCollection.displayName = 'FrameCollection';

export default FrameCollection;
