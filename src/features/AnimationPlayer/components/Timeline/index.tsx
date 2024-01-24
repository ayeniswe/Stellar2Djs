import "../../style.css";
import ProgressBars from "./components/ProgressBars";
import { useEffect } from "react";
import { TimelineProps } from "../../type";
import FrameCollection from "./components/FrameCollection";
/**
 * Displays the timeline for the length of the animation.
 * @returns {JSX.Element} - The rendered Timeline component.
 */
const Timeline: React.FC<TimelineProps> = ({ hook }) => {
    useEffect(() => hook.initialize(), [hook]);
    return (
        <div id="Timeline">
            <FrameCollection hook={hook} />
            <input className="AnimationPlayerDisplay AnimationPlayerDisplay--margined" onChange={(e) => hook.changeSliderDisplay(e.target.value)} value={hook.DISPLAY.value}/>
            <div id="TimelineSlider">
                <div id="TimelineSliderThumb"/>
            </div>
            <ProgressBars
                scaling={hook.SCALE.value}
                step={2}
                width={hook.WIDTH.value}
            />
        </div>
    )
}
export default Timeline