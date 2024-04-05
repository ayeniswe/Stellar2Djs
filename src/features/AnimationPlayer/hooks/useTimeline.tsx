import { calculateDisplay, setPosition } from './utils/timeline';
import { useComputed, useSignal } from '@preact/signals-react';
import { ANIMATION_PLAYER } from '../constants';
import { getWidth } from '../../../utils/styleProps';
import React from 'react';
import { SpriteAnimation } from './type';
import { TimelineElements } from '../components/Timeline/type';

/**
 * Timeline attributes and some inside controls
 * @description
 * Must call the `initialize` before using the hook
 */
const useTimeline = (spriteAnimation: SpriteAnimation) => {
  const scale = useSignal(20);
  const width = useSignal(0);
  const display = useSignal('0.00');
  const ELEMENTS = useSignal<TimelineElements | null>(null);
  const slider = useSignal(0);
  const fps = useSignal('30');
  const current_frame = useSignal(0);
  const frames = useComputed(() => spriteAnimation.frames.value);
  const frame = useComputed(() => frames.value[current_frame.value]);

  const moveSlider = (value: number) => {
    const sliderElement = document.getElementById(ANIMATION_PLAYER.TIMELINE_SLIDER)!;
    setPosition(sliderElement, value);
    slider.value = value;
    display.value = calculateDisplay(value, scale.value);
  };

  function removeFrame() {
    spriteAnimation.removeFrame(current_frame.value);
    // Prevent out of bounds
    if (current_frame.value >= frames.value?.length && frames.value.length > 0) {
      current_frame.value = frames.value?.length - 1;
    }
  }

  function moveFrame(amount: number) {
    if (frames.value) {
      const newAmount = current_frame.value + amount;
      const newFrame = newAmount >= 0
        ? newAmount
        : frames.value.length - 1;
      current_frame.value = newFrame % frames.value.length;
    }
  }

  function showFrames() {
    return frames.value?.map((theFrame, index) => (
      <img
        key={index}
        data-cy='animation-timeline-frame'
        src={theFrame.src}
        style={{ width: `${scale.value / Number(fps.value)}px`, }} />
    ));
  }

  function initialize() {
    // Get all elements the timeline utilizes
    const sliderElement = document.getElementById(ANIMATION_PLAYER.TIMELINE_SLIDER);
    const sliderThumb = document.getElementById(ANIMATION_PLAYER.TIMELINE_SLIDER_THUMB);
    const timeline = document.getElementById(ANIMATION_PLAYER.TIMELINE);
    const frameCollection = document.getElementById(ANIMATION_PLAYER.TIMELINE_FRAME_COLLECTION);
    // Check all elements do exists before storing them
    if (sliderElement && sliderThumb && timeline && frameCollection) {
      // Allow timeline and slider to resize with the window
      window.addEventListener('resize', () => {
        width.value = getWidth(timeline).toNumber();
        if (width.value <= slider.value) {
          moveSlider(width.value);
        }
      });
      /*
       * Allow the slider to be able to drag back n
       * forth within the timeline dimensions
       */
      width.value = getWidth(timeline).toNumber();
      sliderThumb.onmousedown = (e) => {
        const startX = e.clientX;
        const sliderPosition = slider.value;
        document.onmousemove = () => {
          const newSliderPosition = sliderPosition - (startX - e.clientX);
          if (newSliderPosition >= 0 && newSliderPosition <= width.value) {
            moveSlider(newSliderPosition);
          }
        };
        document.onmouseup = () => {
          document.onmousemove = null;
        };
      };
    }
  }

  function reset() {
    if (slider.value >= width.value) {
      moveSlider(0);
    }
  }

  return {
    removeFrame,
    showFrames,
    moveFrame,
    moveSlider,
    initialize,
    reset,
    display,
    width,
    scale,
    slider,
    frames,
    frame,
    fps,
    ELEMENTS
  };
};

export default useTimeline;
