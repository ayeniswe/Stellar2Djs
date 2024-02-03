import "../../style.css";
import ProgressBars from "./components/ProgressBars";
import { useEffect } from "react";
import FrameCollection from "./components/FrameCollection";
import { useAppContext } from "../../../../context/appContext";
import { ANIMATION_PLAYER } from "../..";
/**
 * Displays the timeline for the length of the animation.
 * @returns {JSX.Element} - The rendered Timeline component.
 */
const Timeline = () => {
    const { timeline, timelineControls } = useAppContext();
    useEffect(() => timeline.initialize(), [timeline]);
    return (
        <div id={ANIMATION_PLAYER.TIMELINE}>
            <FrameCollection/>
            <input className="display" onChange={(e) => timelineControls.changeSliderDisplay(e.target.value)} value={timeline.DISPLAY.value}/>
            <div id={ANIMATION_PLAYER.TIMELINE_SLIDER}>
                <div id={ANIMATION_PLAYER.TIMELINE_SLIDER_THUMB}/>
            </div>
            <ProgressBars
                scaling={timeline.SCALE.value}
                step={2}
                width={timeline.WIDTH.value}
            />
        </div>
    )
}
export default Timeline