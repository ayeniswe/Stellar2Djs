import "./style.css";
import Timeline from "./components/Timeline";
import Controls from "./components/Controls";
import SpriteManager from "./components/SpriteManager";
import useTimeline from "./hooks/useTimeline";
import useControls from "./hooks/useControls";
import AnimationDisplay from "./components/AnimationDisplay";
const AnimationPlayer = () => {
    const timeline = useTimeline();
    const controls = useControls(timeline);
    return (
        <div className="AnimationPlayer">
            <Controls hook={controls} timeline={timeline}/>
            <Timeline hook={timeline}/>
            <div className="AnimationPlayerGroup">
                <SpriteManager timeline={timeline}/>
                <AnimationDisplay timeline={timeline}/>
            </div>
        </div>
    )
}
export default AnimationPlayer