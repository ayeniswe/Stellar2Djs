import "../styles/AnimationPlayer.css";
import { useSignal } from "@preact/signals-react";
import ProgressBars from "./ProgressBars";
import { useEffect } from "react";

interface Timeline {
    slider: HTMLElement,
    sliderThumb: HTMLElement,
    timeline: HTMLElement,
};

const Timeline = () => {
    useEffect(() => {
        const slider = document.getElementById("Timeline__slider");
        const sliderThumb = document.getElementById("Timeline__slider__thumb");
        const timeline = document.getElementById("Timeline");
        if (slider && sliderThumb && timeline) {
          Timeline.value = { slider, sliderThumb, timeline };
        }
    }, []);

    useEffect(() => {
        timelineWidth.value = Number(window.getComputedStyle(Timeline.value!.timeline).getPropertyValue("width").replace("px",""));
        Timeline.value!.sliderThumb!.onmousedown = (e) => {
            const slider = document.getElementById("Timeline__slider")!;
            const startX = e.clientX;
            const sliderPosition = Number(window.getComputedStyle(Timeline.value!.slider).getPropertyValue("left").replace("px",""));
            document.onmousemove = (e) => {
                const newSliderPosition = sliderPosition - (startX - e.clientX);
                if (newSliderPosition >= 0 && newSliderPosition <= timelineWidth.value) {
                    slider.style.left = `${newSliderPosition}px`;
                    timeDisplay.value = `${(newSliderPosition / scaling.value).toFixed(1)}`;
                }
            }
        }
        document.onmouseup = (e) => {
            document.onmousemove = null
        }
    },[]);

    window.addEventListener("resize", () => {
        timelineWidth.value = Number(window.getComputedStyle(Timeline.value!.timeline).getPropertyValue("width").replace("px",""));
        Timeline.value!.slider.style.left = "0px";
        timeDisplay.value = "0.0";
    })

    const scaling = useSignal(20);
    const timelineWidth = useSignal(0);
    const timeDisplay = useSignal("0.0");
    const Timeline = useSignal<Timeline | null>(null);
    const changeTimeSlider = (value: string) => {
        const maxTime = timelineWidth.value / scaling.value;
        const minTime = 0;
        const validateInput = /^\d*\.?\d{0,2}$/;
        if(validateInput.test(value) && Number(value) <= maxTime && Number(value) >= minTime) {
            timeDisplay.value = value;
            Timeline.value!.slider.style.left = `${Number(timeDisplay.value) * scaling.value}px`;
        }
        else if (value === "") {
            timeDisplay.value = "";
        }
    }
    return (
        <div id="Timeline" className="Timeline">
            <input className="AnimationPlayer__display" onChange={(e) => changeTimeSlider(e.target.value)} value={timeDisplay.value}/>
            <div id="Timeline__slider" className="Timeline__slider" role='slider'>
                <div id="Timeline__slider__thumb" className="Timeline__slider__thumb"/>
            </div>
            <div className="Timeline__progress">
                <ProgressBars
                    scaling={scaling.value}
                    step={2}
                    width={timelineWidth.value}
                />
            </div>
        </div>
    )
}

export default Timeline