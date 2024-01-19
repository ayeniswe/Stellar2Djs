import { useSignal } from "@preact/signals-react";
import { Timeline } from "../type";
/**
 * This hook provides functionality for updating the timeline slider and displaying the current time in the timeline.
 */
const useTimeline = () => {
    const SCALE = useSignal(20);
    const WIDTH = useSignal(0);
    const DISPLAY = useSignal("0.0");
    const TIMELINE = useSignal<Timeline | null>(null);
    /**
     * Initializes the timeline functionality
     * 
     * @description
     * This function finds the necessary DOM elements for the timeline slider (slider, sliderThumb, and timeline)
     * and assigns them to the `TIMELINE` object. It also sets up an event listener for the window's `resize` event
     * to update the width of the timeline and slider. Additionally, it sets up an event listener for the `mousedown`
     * event on the sliderThumb element to enable dragging the slider within the timeline dimensions. Finally, it
     * sets up an event listener for the `mouseup` event on the document to stop dragging when the mouse button is released.
     * 
     * @returns {void} This function does not return a value.
     */
    const initialize = () => {
        const slider = document.getElementById("Timeline__slider");
        const sliderThumb = document.getElementById("Timeline__slider__thumb");
        const timeline = document.getElementById("Timeline");
        if (slider && sliderThumb && timeline) {
          TIMELINE.value = { slider, sliderThumb, timeline };
        }
        // Allow timeline and slider to resize with the window 
        window.addEventListener("resize", () => {
            WIDTH.value = Number(window.getComputedStyle(TIMELINE.value!.timeline).getPropertyValue("width").replace("px",""));
            const maxWidth = WIDTH.value
            const sliderPosition = Number(DISPLAY.value.replace("px","")) * SCALE.value
            if(maxWidth <= sliderPosition){
                TIMELINE.value!.slider.style.left = `${maxWidth}px`;
                DISPLAY.value = `${(maxWidth / SCALE.value).toFixed(1)}`;
            }
        })
        // Allow the slider to be able to drag back n forth within the timeline dimensions
        WIDTH.value = Number(window.getComputedStyle(TIMELINE.value!.timeline).getPropertyValue("width").replace("px",""));
        TIMELINE.value!.sliderThumb!.onmousedown = (e) => {
            const slider = document.getElementById("Timeline__slider")!;
            const startX = e.clientX;
            const sliderPosition = Number(window.getComputedStyle(TIMELINE.value!.slider).getPropertyValue("left").replace("px",""));
            document.onmousemove = (e) => {
                const newSliderPosition = sliderPosition - (startX - e.clientX);
                if (newSliderPosition >= 0 && newSliderPosition <= WIDTH.value) {
                    slider.style.left = `${newSliderPosition}px`;
                    DISPLAY.value = `${(newSliderPosition / SCALE.value).toFixed(1)}`;
                }
            }
        }
        document.onmouseup = (e) => {
            document.onmousemove = null
        }
    }
    /**
     * Updates the slider with the given value.
     *
     * @description
     * This function takes a value as input and updates the slider based on the value.
     * It first calculates the maximum time based on the width and scale values.
     * Then it validates the input value using a regular expression pattern.
     * If the value passes the validation and falls within the range of the minimum and maximum time,
     * it updates the display value and adjusts the position of the slider accordingly.
     * If the value is an empty string, it clears the display value.
     *
     * @param {string} value - The value to update the slider with.
     */
    const updateSlider = (value: string) => {
        const maxTime = WIDTH.value / SCALE.value;
        const minTime = 0;
        const validateInput = /^\d*\.?\d{0,2}$/;
        if(validateInput.test(value) && Number(value) <= maxTime && Number(value) >= minTime) {
            DISPLAY.value = value;
            TIMELINE.value!.slider.style.left = `${Number(DISPLAY.value) * SCALE.value}px`;
        }
        else if (value === "") {
            DISPLAY.value = "";
        }
    }

    return {
        updateSlider,
        initialize,
        DISPLAY,
        WIDTH,
        SCALE
    }
}

export {
    useTimeline
}