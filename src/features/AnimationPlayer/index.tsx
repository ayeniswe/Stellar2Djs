import "./style.css";
import Timeline from "./components/Timeline";
import Controls from "./components/Controls";
import AnimationDisplay from "./components/AnimationDisplay";
import SpriteAnimation from "./components/SpriteAnimation";
import add from "../../assets/images/icons/add.png";
import cancel from "../../assets/images/icons/delete.png";
import { useAppContext } from "../../context/appContext";
import Button from "../../components/Button";
import { ANIMATION_PLAYER } from "./constants";
/**
 * Plays one animation and displays a preview of the current frame.
 * @returns {JSX.Element} - The rendered AnimationPlayer component.
 */
const AnimationPlayer = () => {
    const { timeline, spriteAnimation } = useAppContext();
    return (
        <div className="AnimationPlayer">
            <div className="AnimationPlayerGroup AnimationPlayerGroup--col AnimationPlayerGroup--margined">
                <Controls/>
                <SpriteAnimation/>
            </div>
            <Timeline/>
            <div className="AnimationPlayerGroup AnimationPlayerGroup--margined AnimationPlayerGroup--col">
                <div className="AnimationPlayerGroup">
                    <Button 
                        action={spriteAnimation.loadFrame}
                        imgSrc={add}
                        label="Add Frame"
                        type="file"
                        title="Add a new frame"
                    />
                   <Button
                        action={timeline.removeFrame}
                        imgSrc={cancel}
                        label="Delete Frame"
                        title="Delete the current frame"
                    />
                </div>
                <AnimationDisplay/>
            </div>
        </div>
    )
}
export default AnimationPlayer
export {
    ANIMATION_PLAYER
}