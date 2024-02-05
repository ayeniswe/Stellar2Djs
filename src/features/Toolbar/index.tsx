import "./style.css";
import AnimationPlayer from "../AnimationPlayer";
import Tilemap from "../Tilemap";
import { useAppContext } from "../../context/appContext";
import { TOOLBAR } from "./constants";
import { useEffect } from "react";
const Toolbar = () => {
    const { toolbar } = useAppContext();
    useEffect(() => toolbar.initialize(),[]);
    return (
        <div id={TOOLBAR.$} aria-keyshortcuts="t">
            <div id={TOOLBAR.HANDLE}/>
            <div className="header">
                <button data-cy="animation" id={TOOLBAR.ANIMATION_PLAYER} aria-keyshortcuts="a" onClick={(e) => toolbar.openTab(e.currentTarget, <AnimationPlayer/>)}>
                    Animation Player
                </button>
                <button data-cy="tilemap" id={TOOLBAR.TILEMAP_EDITOR} aria-keyshortcuts="m" onClick={(e) => toolbar.openTab(e.currentTarget, <Tilemap/>)}>
                    Tilemap Editor
                </button>
            </div>
            <div className="content">
                {toolbar.attrs.tabContent}
            </div>
        </div>
    )
}
export default Toolbar
export {
    TOOLBAR
}