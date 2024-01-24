import "../../../style.css";
import { FC, memo } from "react";
import { FrameCollectionProps } from "../../../type";
/**
 * A collection of frames to be displayed in the timeline.
 * @returns {JSX.Element} - The `memomized` rendered FrameCollection component.
 */
const FrameCollection: FC<FrameCollectionProps> = memo(({ hook }) => {
    return (
        <>
            <div className="TimelineFrameCollection"/> {/* 1st layer of frame collection to make it transparent*/}
            <div id="TimelineFrameCollection" className="TimelineFrameCollection TimelineFrameCollection--transparent">
                {hook.showFrames()}
            </div>
        </>
    )
})
export default FrameCollection