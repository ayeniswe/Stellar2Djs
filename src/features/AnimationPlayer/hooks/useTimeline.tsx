import { useComputed, useSignal } from "@preact/signals-react";
import { TimelineElements } from "../type";
import { getWidth } from "../../../utils/styleProps";
import { setPosition, calculateDisplay } from "./utils/timeline";
/**
 * Timeline attributes and some inside controls
 * @description
 * Must call the `initialize` before using the hook
 */
const useTimeline = () => {
    const SCALE = useSignal(20);
    const WIDTH = useSignal(0);
    const DISPLAY = useSignal("0.00");
    const ELEMENTS = useSignal<TimelineElements | null>(null);
    const SLIDER = useSignal(0);
    const FPS = useSignal("30");
    const FRAMES = useSignal<HTMLImageElement[]>([]);
    const CURRENT_FRAME = useSignal(0);
    const FRAME = useComputed(() => { return FRAMES.value[CURRENT_FRAME.value] });
    const moveSlider = (value: number) => {
        setPosition(ELEMENTS.value!.slider, value);
        SLIDER.value = value;
        DISPLAY.value = calculateDisplay(value, SCALE.value);
    }
    const moveFrame = () => {
        if (FRAMES.value.length !== 0) {
            CURRENT_FRAME.value = (CURRENT_FRAME.value + 1) % FRAMES.value.length;
        }
    }
    const loadFrame = (files: FileList) => {
        for (let index = 0; index < files.length; index++) {
            const reader = new FileReader;
            const file = files[index];
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target!.result as string;
                // TODO: better performance w/ linked list
                FRAMES.value = [...FRAMES.value, img];
            }
        }
    }
    const showFrames = () => {
        return FRAMES.value?.map((frame, index) => (
            <img
                key={index}
                className="TimelineFrame"
                src={frame.src}
                style={{
                    width: `${SCALE.value / Number(FPS.value)}px`,
                }}
            />
        ))
    }
    const initialize = () => {
        // Get all elements the timeline utilizes
        const slider = document.getElementById("TimelineSlider")
        const sliderThumb = document.getElementById("TimelineSliderThumb");
        const timeline = document.getElementById("Timeline");
        const frameCollection = document.getElementById("TimelineFrameCollection");
        // Check all elements do exists before storing them
        if (slider && sliderThumb && timeline && frameCollection) {
            ELEMENTS.value = { 
                slider,
                sliderThumb,
                timeline,
                frameCollection
            };
            // Allow timeline and slider to resize with the window 
            window.addEventListener("resize", () => {
                WIDTH.value = getWidth(ELEMENTS.value!.timeline).toNumber(); 
                if(WIDTH.value <= SLIDER.value){
                    moveSlider(WIDTH.value);
                }
            })
            // Allow the slider to be able to drag back n forth within the timeline dimensions
            WIDTH.value = getWidth(ELEMENTS.value!.timeline).toNumber(); 
            ELEMENTS.value.sliderThumb.onmousedown = (e) => {
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
    const changeSliderDisplay = (value: string) => {
        const maxTime = WIDTH.value / SCALE.value;
        const minTime = 0;
        const validateInput = /^\d*\.?\d{0,2}$/;
        if(validateInput.test(value) && Number(value) <= maxTime && Number(value) >= minTime) {
            DISPLAY.value = value;
            const position = Number(DISPLAY.value) * SCALE.value;
            setPosition(ELEMENTS.value!.slider, position);
            SLIDER.value = position
        }
        else if (value === "") {
            DISPLAY.value = "";
        }
    }
    const reset = () => {
        if (SLIDER.value >= WIDTH.value) {
            moveSlider(0);
        };
    }
    return {
        loadFrame,
        showFrames,
        moveFrame,
        moveSlider,
        changeSliderDisplay,
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