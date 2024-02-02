import { ANIMATION_PLAYER } from "..";
import { useAppContext } from "../../../context/appContext";
import "../style.css";
const AnimationDisplay = () => {
    const { timeline } = useAppContext();
    return (
        <div className="AnimationDisplay">
            {timeline.FRAME.value ?
            <img id={ANIMATION_PLAYER.DISPLAY} className="AnimationPlayerDisplay AnimationPlayerDisplay--noinset" src={ timeline.FRAME.value.src }/>
            : 
            <div className="AnimationDisplay--empty">No Animation Frames Found</div>
            }
        </div>
    )
}
export default AnimationDisplay