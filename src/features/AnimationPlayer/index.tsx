import "./styles/AnimationPlayer.css";
import arrowUp from "../../assets/images/icons/arrow-up.svg";
import arrowDown from "../../assets/images/icons/arrow-down.svg";
import { useSignal } from "@preact/signals-react";

const AnimationPlayer = () => {

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
        <div className="AnimationPlayer">
            <div className="AnimationPlayer__speed">
                Speed:{speed.value}x
                <div className="AnimationPlayer__speed__buttons">
                    <button className="AnimationPlayer__speed__buttons__button" onClick={() => changeSpeed("up")}>
                        <img alt="animation speed up" className="AnimationPlayer__speed__buttons__button__img" src={arrowUp}/>
                    </button>
                    <button className="AnimationPlayer__speed__buttons__button" onClick={() => changeSpeed("down")}>
                        <img alt="animation speed down" className="AnimationPlayer__speed__buttons__button__img" src={arrowDown}/>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AnimationPlayer