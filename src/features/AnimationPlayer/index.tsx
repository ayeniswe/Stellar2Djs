import "./styles/AnimationPlayer.css";
import Timeline from "./components/Timeline";
import Controls from "./components/Controls";

const AnimationPlayer = () => {
    return (
        <div className="AnimationPlayer">
            <Controls/>
            <Timeline/>
        </div>
    )
}

export default AnimationPlayer