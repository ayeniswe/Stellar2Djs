import "../style.css";
import { AnimationDisplayProps, TimelineHook } from "../type";

const AnimationDisplay: React.FC<AnimationDisplayProps> = ({ timeline }) => {
    return (
        timeline.FRAME.value ? (
            <img id="AnimationDisplay" className="AnimationPlayerDisplay AnimationPlayerDisplay--noinset" src={ timeline.FRAME.value.src }/>
        ) : (
            <div className="AnimationDisplay--empty">No Animation Frames Loaded</div>
        )
    )
}
export default AnimationDisplay