import "../../../style.css";
import arrowUpIcon from "../../../../../assets/images/icons/arrow-up.png";
import arrowDownIcon from "../../../../../assets/images/icons/arrow-down.png";
import { FPSProps } from "../../../type";
/**
 * The FPS display and FPS controls of the animation player.
 * @returns {JSX.Element} - The rendered FPS component.
 */
const FPS: React.FC<FPSProps> = ({ hook, timeline }) => {
    return (
        <div className="FPS">
            FPS:<input className="AnimationPlayerDisplay AnimationPlayerDisplay--margined" disabled value={timeline.FPS.value}/>
            <div className="FPS__buttons AnimationPlayerButtons">
                <button title="FPS up" onClick={() => hook.changeFPS("up")}><img alt="animation FPS up" src={arrowUpIcon}/></button>
                <button title="FPS down" onClick={() => hook.changeFPS("down")}><img alt="animation FPS down" src={arrowDownIcon}/></button>
            </div>
        </div>
    )
}
export default FPS