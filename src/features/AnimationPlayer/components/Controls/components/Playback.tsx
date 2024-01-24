import "../../../style.css";
import arrowLeftIcon from "../../../../../assets/images/icons/arrow-left.png";
import arrowRightIcon from "../../../../../assets/images/icons/arrow-right.png";
import arrowLeftLeftIcon from "../../../../../assets/images/icons/arrow-left-left.png";
import arrowRightRightIcon from "../../../../../assets/images/icons/arrow-right-right.png";
import playIcon from "../../../../../assets/images/icons/play.png";
import stopIcon from "../../../../../assets/images/icons/stop.png";
import repeatIcon from "../../../../../assets/images/icons/repeat.png";
import { PlaybackProps } from "../../../type";
/**
 * The playback controls of the animation player.
 * @returns {JSX.Element} - The rendered Playback component.
 */
const Playback: React.FC<PlaybackProps> = ({ hook }) => {
    return (
        <div className="Playback">
            <div className="Playback__buttons AnimationPlayerButtons ">
                <button title="repeat" onClick={() => hook.repeat()} style={{ backgroundColor: `${hook.LOOP.value ? "var(--accent-color)" : "transparent"}`}}>
                    <img alt="animation repeat" src={repeatIcon}/>
                </button>
                <button title="play backward" onClick={() => hook.playBackward()}>
                    <img alt="animation play backward" src={arrowLeftIcon}/>
                </button>
                <button title="play previous frame" onClick={() => hook.playFastBackward()}>
                    <img alt="animation play previous frame" src={arrowLeftLeftIcon}/>
                </button>
                <button title={hook.PLAYING.value ? "stop" : "play"} onClick={() => hook.PLAYING.value ? hook.stop() : hook.play()}>
                    <img alt={`animation ${hook.PLAYING.value ? "stop" : "play"}`} src={hook.PLAYING.value ? stopIcon : playIcon}/>
                </button>
                <button title="play next frame" onClick={() => hook.playFastForward()}>
                    <img alt="animation play next frame"  src={arrowRightRightIcon}/>
                </button>
                <button title="play forward" onClick={() => hook.playForward()}>
                    <img alt="animation play forward" src={arrowRightIcon}/>
                </button>
            </div>
        </div>
    )
}
export default Playback