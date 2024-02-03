import { ANIMATION_PLAYER } from "../../..";
import { useAppContext } from "../../../../../context/appContext";
import "../../../style.css";
import { memo, useEffect } from "react";
/**
 * A collection of frames to be displayed in the timeline.
 * @returns {JSX.Element} - The `memomized` rendered FrameCollection component.
 */
const FrameCollection = memo(() => {
    const { timeline, spriteAnimation } = useAppContext();
    useEffect(() => {},[spriteAnimation.FRAMES.value, spriteAnimation.CREATING.value, spriteAnimation.SPRITE.value, timeline.FRAMES.value])
    return (
        <>
            <div className="TimelineFrameCollection"/> {/* 1st layer of frame collection to make it transparent*/}
            <div id={ANIMATION_PLAYER.TIMELINE_FRAME_COLLECTION} className="TimelineFrameCollection transparent">
                {timeline.showFrames()}
            </div>
        </>
    )
})
export default FrameCollection