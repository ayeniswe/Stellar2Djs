import "./style.css";
import AnimationPlayer from "../AnimationPlayer";
import Tilemap from "../Tilemap";
import { useAppContext } from "../../context/appContext";
import { TOOLBAR } from "./constants";
const Toolbar = () => {
    const { toolbar } = useAppContext();
    return (
        <div id={TOOLBAR.$}>
            <div id={TOOLBAR.HANDLE}/>
            <div className="Toolbar__header">
                <div id={TOOLBAR.ANIMATION_PLAYER} className="Toolbar__header__button" onClick={(e) => toolbar.openTab(e.currentTarget, <AnimationPlayer/>)}>
                    <span className="Toolbar__header__button__title">Animation Player</span>
                </div>
                <div id={TOOLBAR.TILEMAP_EDITOR} className="Toolbar__header__button" onClick={(e) => toolbar.openTab(e.currentTarget, <Tilemap/>)}>
                    <span className="Toolbar__header__button__title">TilemapEditor</span>
                </div>
            </div>
            <div className="Toolbar__content">
                {toolbar.attrs.tabContent}
            </div>
        </div>
    )
}
export default Toolbar
export {
    TOOLBAR
}