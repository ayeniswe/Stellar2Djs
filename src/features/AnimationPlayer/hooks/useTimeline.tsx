import { useComputed, useSignal } from "@preact/signals-react";
import { getWidth } from "../../../utils/styleProps";
import { setPosition, calculateDisplay } from "./utils/timeline";
import { TimelineElements } from "../components/Timeline/type";
import { SpriteAnimation } from "./type";
import { ANIMATION_PLAYER } from "../constants";
/**
 * Timeline attributes and some inside controls
 * @description
 * Must call the `initialize` before using the hook
 */
const useTimeline = (spriteAnimation: SpriteAnimation) => {
    const SCALE = useSignal(20);
    const WIDTH = useSignal(0);
    const DISPLAY = useSignal("0.00");
    const ELEMENTS = useSignal<TimelineElements | null>(null);
    const SLIDER = useSignal(0);
    const FPS = useSignal("30");
    const CURRENT_FRAME = useSignal(0);
    const FRAMES = useComputed(() => { return spriteAnimation.FRAMES.value });
    const FRAME = useComputed(() => { return FRAMES.value?.[CURRENT_FRAME.value] });
    const moveSlider = (value: number) => {
        const slider = document.getElementById(ANIMATION_PLAYER.TIMELINE_SLIDER)!;
        setPosition(slider, value);
        SLIDER.value = value;
        DISPLAY.value = calculateDisplay(value, SCALE.value);
    }
    const removeFrame = () => {
        spriteAnimation.removeFrame(CURRENT_FRAME.value);
        // Prevent out of bounds
        if (CURRENT_FRAME.value >= FRAMES.value?.length && FRAMES.value.length > 0) {
            CURRENT_FRAME.value = FRAMES.value?.length - 1;
        }
    }
    const moveFrame = (amount: number) => {
        if (FRAMES.value) {
            const newAmount = CURRENT_FRAME.value + amount;
            const frame = newAmount >= 0 ? newAmount : FRAMES.value.length - 1;
            CURRENT_FRAME.value = frame % FRAMES.value.length;
        }
    }
    const showFrames = () => {
        return FRAMES.value?.map((frame, index) => (
            <img
                key={index}
                src={frame.src}
                style={{
                    width: `${SCALE.value / Number(FPS.value)}px`,
                }}
            />
        ))
    }
    const initialize = () => {
        // Get all elements the timeline utilizes
        const slider = document.getElementById(ANIMATION_PLAYER.TIMELINE_SLIDER);
        const sliderThumb = document.getElementById(ANIMATION_PLAYER.TIMELINE_SLIDER_THUMB);
        const timeline = document.getElementById(ANIMATION_PLAYER.TIMELINE);
        const frameCollection = document.getElementById(ANIMATION_PLAYER.TIMELINE_FRAME_COLLECTION);
        // Check all elements do exists before storing them
        if (slider && sliderThumb && timeline && frameCollection) {
            // Allow timeline and slider to resize with the window
            window.addEventListener("resize", () => {
                WIDTH.value = getWidth(timeline).toNumber();
                if(WIDTH.value <= SLIDER.value){
                    moveSlider(WIDTH.value);
                }
            })
            // Allow the slider to be able to drag back n forth within the timeline dimensions
            WIDTH.value = getWidth(timeline).toNumber();
            sliderThumb.onmousedown = (e) => {
            const startX = e.clientX;
            const sliderPosition = SLIDER.value;
            document.onmousemove = (e) => {
                const newSliderPosition = sliderPosition - (startX - e.clientX);
                if (newSliderPosition >= 0 && newSliderPosition <= WIDTH.value) {
                    moveSlider(newSliderPosition);
                }
            }
            document.onmouseup = (e) => {
                document.onmousemove = null
            }
        }
        } else {
            throw new Error("Missing timeline element or id was changed")
        }
    }
    const reset = () => {
        if (SLIDER.value >= WIDTH.value) {
            moveSlider(0);
        };
    }
    return {
        removeFrame,
        showFrames,
        moveFrame,
        moveSlider,
        initialize,
        reset,
        DISPLAY,
        WIDTH,
        SCALE,
        SLIDER,
        FRAMES,
        FRAME,
        FPS,
        ELEMENTS
    }
}
export default useTimeline