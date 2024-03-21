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
    const playing = useSignal<Boolean | null>(null);
    const loop = useSignal(false);
    const changeSliderDisplay = (value: string) => {
        const maxTime = timeline.width.value / timeline.scale.value;
        const minTime = 0;
        const validateInput = /^\d*\.?\d{0,3}$/;
        if(validateInput.test(value) && Number(value) <= maxTime && Number(value) >= minTime) {
            timeline.display.value = value;
            const position = Number(timeline.display.value) * timeline.scale.value;
            const slider = document.getElementById(ANIMATION_PLAYER.TIMELINE_SLIDER)!;
            setPosition(slider, position);
            timeline.slider.value = position
        }
        else if (value === "") {
            timeline.display.value = "";
        }
    }
    const changeFPS = (direction: "up" | "down") => {
        const maxFPS = 120;
        const minFPS = 1;
        const increment = (direction === "up") ? 1 : -1;
        const value = Number(timeline.fps.value) + increment;
        if (value <= maxFPS && value >= minFPS) {
            timeline.fps.value = value.toString();
        }
    }
    const play = async () => {
        playing.value = true;
        // Reset timeline to beginning if at end
        timeline.reset();
        while (timeline.slider.value < timeline.width.value) {
            timeline.slider.value += timeline.scale.value / Number(timeline.fps.value);
            const stillPlaying = await new Promise<boolean>((resolve) => {
                if (playing.value) {
                    const timeout = 1000 / Number(timeline.fps.value);
                    setTimeout(() => {
                        timeline.moveSlider(timeline.slider.value);
                        timeline.moveFrame(1);
                        resolve(true);
                    }, timeout)
                } else {
                  resolve(false);
                }
            });
            if (!stillPlaying) {
                break;
            } else if (loop.value) {
                timeline.reset();
            }
        };
        playing.value = false;
    }
    const stop = () => {
        playing.value = false;
    }
    const playBackward = () => {
        const decrement = ((timeline.scale.value / Number(timeline.fps.value)) / 2);
        if (timeline.slider.value >= decrement) {
            timeline.moveSlider(timeline.slider.value - decrement);
        }
    }
    const playForward = () => {
        const increment = ((timeline.scale.value / Number(timeline.fps.value)) / 2);
        if (timeline.slider.value < timeline.width.value - increment) {
            timeline.moveSlider(timeline.slider.value + increment);
        }
    }
    const playFastBackward = () => {
        timeline.moveFrame(-1);
    }
    const playFastForward = () => {
        timeline.moveFrame(1);
    }
    const repeat = () => {
        loop.value = !loop.value
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
        playing,
        loop
    }
}
export default useControls