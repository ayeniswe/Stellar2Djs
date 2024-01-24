import "../../style.css";
import { ControlsProps } from "../../type";
import Playback from "./components/Playback";
import FPS from "./components/FPS";
/**
 * The controls of the animation player.
 * @returns {JSX.Element} - The rendered Controls component.
 */
const Controls: React.FC<ControlsProps> = ({ hook, timeline }) => {
    return (
        <div className="Controls AnimationPlayerGroup">
            <FPS hook={hook} timeline={timeline}/>
            <Playback hook={hook}/>
        </div>
    )
}
export default Controls