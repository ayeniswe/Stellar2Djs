import "../../style.css";
import Playback from "./components/Playback";
import FPS from "./components/FPS";
/**
 * The controls of the animation player.
 * @returns {JSX.Element} - The rendered Controls component.
 */
const Controls= () => {
    return (
        <div className="AnimationPlayerControls grouping">
            <FPS/>
            <Playback/>
        </div>
    )
}
export default Controls