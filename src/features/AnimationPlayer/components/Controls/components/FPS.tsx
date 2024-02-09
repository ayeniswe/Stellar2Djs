import "../../../style.css";
import arrowUpIcon from "../../../../../assets/images/icons/arrow-up.png";
import arrowDownIcon from "../../../../../assets/images/icons/arrow-down.png";
import { useAppContext } from "../../../../../context/appContext";
const FPS = () => {
    const { timeline, timelineControls } = useAppContext();
    return (
        <div className="FPS">
            FPS:<input data-cy="animation-fps" className="display" disabled value={timeline.fps.value}/>
            <div className="buttons">
                <button data-cy="animation-fps-up" title="frames per second up" onClick={() => timelineControls.changeFPS("up")}><img alt="animation FPS up" src={arrowUpIcon}/></button>
                <button data-cy="animation-fps-down" title="frames per second down" onClick={() => timelineControls.changeFPS("down")}><img alt="animation FPS down" src={arrowDownIcon}/></button>
            </div>
        </div>
    )
}
export default FPS