import "../../style.css";
import ProgressBars from "./ProgressBars";
import { useEffect } from "react";
import { useTimeline } from "../../hooks/useTimeline";

const Timeline = () => {
    const { 
        updateSlider,
        initialize,
        DISPLAY,
        SCALE,
        WIDTH,
    } = useTimeline();
    
    useEffect(() => initialize());

    return (
        <div id="Timeline" className="Timeline">
            <input className="AnimationPlayer__display" onChange={(e) => updateSlider(e.target.value)} value={DISPLAY.value}/>
            <div id="Timeline__slider" className="Timeline__slider" role='slider'>
                <div id="Timeline__slider__thumb" className="Timeline__slider__thumb"/>
            </div>
            <div className="Timeline__progress">
                <ProgressBars
                    scaling={SCALE.value}
                    step={2}
                    width={WIDTH.value}
                />
            </div>
        </div>
    )
}

export default Timeline