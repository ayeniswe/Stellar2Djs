import "../styles/AnimationPlayer.css";
import arrowUp from "../../../assets/images/icons/arrow-up.svg";
import arrowDown from "../../../assets/images/icons/arrow-down.svg";
import arrowLeft from "../../../assets/images/icons/arrow-left.png";
import arrowRight from "../../../assets/images/icons/arrow-right.png";
import arrowLeftLeft from "../../../assets/images/icons/arrow-left-left.png";
import arrowRightRight from "../../../assets/images/icons/arrow-right-right.png";
import play from "../../../assets/images/icons/play.png";
import stop from "../../../assets/images/icons/stop.png";
import repeat from "../../../assets/images/icons/repeat.png";
import { useSignal } from "@preact/signals-react";

const Controls = () => {
    const speed = useSignal("1.0");
    const changeSpeed = (direction: "up" | "down") => {
        const maxSpeed = "2.0";
        const minSpeed = "1.0";
        const increment = (direction === "up") ? 0.1 : -0.1;
        const value = (Number(speed.value) + increment).toFixed(1);
        if (value <= maxSpeed && value >= minSpeed) {
            speed.value = value
        }
    }
    return (
        <div className="Controls">
            <div className="Controls__speed">
                Speed:<input className="AnimationPlayer__display" disabled value={speed.value}/>
                <div className="Controls__speed__buttons AnimationPlayer__buttons">
                    <button onClick={() => changeSpeed("up")}><img alt="animation speed up" src={arrowUp}/></button>
                    <button onClick={() => changeSpeed("down")}><img alt="animation speed down" src={arrowDown}/></button>
                </div>
            </div>
            <div className="Controls__playback">
                <div className="Controls__playback__buttons AnimationPlayer__buttons">
                    <button><img alt="animation play backward" src={arrowLeft}/></button>
                    <button><img alt="animation play forward" src={arrowLeftLeft}/></button>
                    <button><img alt="animation play" src={play}/></button>
                    <button><img alt="animation play forward" src={arrowRight}/></button>
                    <button><img alt="animation play forward" src={arrowRightRight}/></button>
                    <button><img alt="animation play forward" src={repeat}/></button>
                </div>
            </div>
        </div>
    )
}

export default Controls