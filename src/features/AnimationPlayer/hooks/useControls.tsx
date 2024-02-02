import { useSignal } from "@preact/signals-react";
import { setPosition } from "./utils/timeline";
import { Timeline } from "./type";
import { ANIMATION_PLAYER } from "..";
/**
 * Controls the features of the timeline
 * @description
 * This hook need to be used in conjunction with an initialized Timeline hook to control the Timeline
 */
const useControls = (timeline: Timeline) => {
    const PLAYING = useSignal<Boolean | null>(null);
    const LOOP = useSignal(false);
    const changeSliderDisplay = (value: string) => {
        const maxTime = timeline.WIDTH.value / timeline.SCALE.value;
        const minTime = 0;
        const validateInput = /^\d*\.?\d{0,3}$/;
        if(validateInput.test(value) && Number(value) <= maxTime && Number(value) >= minTime) {
            timeline.DISPLAY.value = value;
            const position = Number(timeline.DISPLAY.value) * timeline.SCALE.value;
            const slider = document.getElementById(ANIMATION_PLAYER.TIMELINE_SLIDER)!;
            setPosition(slider, position);
            timeline.SLIDER.value = position
        }
        else if (value === "") {
            timeline.DISPLAY.value = "";
        }
    }
    const changeFPS = (direction: "up" | "down") => {
        const maxFPS = 120;
        const minFPS = 1;
        const increment = (direction === "up") ? 1 : -1;
        const value = Number(timeline.FPS.value) + increment;
        if (value <= maxFPS && value >= minFPS) {
            timeline.FPS.value = value.toString();
        }
    }
    const play = async () => {
        PLAYING.value = true;
        // Reset timeline to beginning if at end
        timeline.reset();
        while (timeline.SLIDER.value < timeline.WIDTH.value) {
            timeline.SLIDER.value += timeline.SCALE.value / Number(timeline.FPS.value);
            const stillPlaying = await new Promise<boolean>((resolve) => {
                if (PLAYING.value) {
                    const timeout = 1000 / Number(timeline.FPS.value);
                    setTimeout(() => {
                        timeline.moveSlider(timeline.SLIDER.value);
                        timeline.moveFrame(1);
                        resolve(true);
                    }, timeout)
                } else {
                  resolve(false);
                }
            });
            if (!stillPlaying) {
                break;
            } else if (LOOP.value) {
                timeline.reset();
            }
        };
        PLAYING.value = false;
    }
    const stop = () => {
        PLAYING.value = false;
    }
    const playBackward = () => {
        const decrement = ((timeline.SCALE.value / Number(timeline.FPS.value)) / 2);
        if (timeline.SLIDER.value >= decrement) {
            timeline.moveSlider(timeline.SLIDER.value - decrement);
        }
    }
    const playForward = () => {
        const increment = ((timeline.SCALE.value / Number(timeline.FPS.value)) / 2);
        if (timeline.SLIDER.value < timeline.WIDTH.value - increment) {
            timeline.moveSlider(timeline.SLIDER.value + increment);
        }
    }
    const playFastBackward = () => {
        timeline.moveFrame(-1);
    }
    const playFastForward = () => {
        timeline.moveFrame(1);
    }
    const repeat = () => {
        LOOP.value = !LOOP.value
    }
    return {
        changeSliderDisplay,
        changeFPS,
        play,
        stop,
        playBackward,
        playForward,
        playFastBackward,
        playFastForward,
        repeat,
        PLAYING,
        LOOP
    }
}
export default useControls