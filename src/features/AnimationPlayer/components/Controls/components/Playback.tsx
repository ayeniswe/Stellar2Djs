import "../../../style.css";
import arrowLeftIcon from "../../../../../assets/images/icons/arrow-left.png";
import arrowRightIcon from "../../../../../assets/images/icons/arrow-right.png";
import arrowLeftLeftIcon from "../../../../../assets/images/icons/arrow-left-left.png";
import arrowRightRightIcon from "../../../../../assets/images/icons/arrow-right-right.png";
import playIcon from "../../../../../assets/images/icons/play.png";
import stopIcon from "../../../../../assets/images/icons/stop.png";
import repeatIcon from "../../../../../assets/images/icons/repeat.png";
import { useAppContext } from "../../../../../context/appContext";
/**
 * The playback controls of the animation player.
 * @returns {JSX.Element} - The rendered Playback component.
 */
const Playback = () => {
    const { timelineControls } = useAppContext();
    return (
        <div className="Playback">
            <div className="buttons">
                <button data-cy="animation-repeat" title="repeat" onClick={() => timelineControls.repeat()} style={{ backgroundColor: `${timelineControls.LOOP.value ? "var(--accent-color)" : "transparent"}`}}>
                    <img alt="animation repeat" src={repeatIcon}/>
                </button>
                <button data-cy="animation-play-backward" title="play backward" onClick={() => timelineControls.playBackward()}>
                    <img alt="animation play backward" src={arrowLeftIcon}/>
                </button>
                <button data-cy="animation-play-previous-frame" title="play previous frame" onClick={() => timelineControls.playFastBackward()}>
                    <img alt="animation play previous frame" src={arrowLeftLeftIcon}/>
                </button>
                <button data-cy={`animation-${timelineControls.PLAYING.value ? "stop" : "play"}`} title={timelineControls.PLAYING.value ? "stop" : "play"} onClick={() => timelineControls.PLAYING.value ? timelineControls.stop() : timelineControls.play()}>
                    <img alt={`animation ${timelineControls.PLAYING.value ? "stop" : "play"}`} src={timelineControls.PLAYING.value ? stopIcon : playIcon}/>
                </button>
                <button data-cy="animation-play-next-frame" title="play next frame" onClick={() => timelineControls.playFastForward()}>
                    <img alt="animation play next frame" src={arrowRightRightIcon}/>
                </button>
                <button data-cy="animation-play-forward" title="play forward" onClick={() => timelineControls.playForward()}>
                    <img alt="animation play forward" src={arrowRightIcon}/>
                </button>
            </div>
        </div>
    )
}
export default Playback