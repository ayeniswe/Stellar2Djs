import "../../../style.css";
import arrowUpIcon from "../../../../../assets/images/icons/arrow-up.png";
import arrowDownIcon from "../../../../../assets/images/icons/arrow-down.png";
import { useAppContext } from "../../../../../context/appContext";
const FPS = () => {
    const { timeline, timelineControls } = useAppContext();
    return (
        <div className="FPS">
            FPS:<input className="AnimationPlayerDisplay AnimationPlayerDisplay--margined" disabled value={timeline.FPS.value}/>
            <div className="FPS__buttons AnimationPlayerButtons">
                <button title="FPS up" onClick={() => timelineControls.changeFPS("up")}><img alt="animation FPS up" src={arrowUpIcon}/></button>
                <button title="FPS down" onClick={() => timelineControls.changeFPS("down")}><img alt="animation FPS down" src={arrowDownIcon}/></button>
            </div>
        </div>
    )
}
export default FPS