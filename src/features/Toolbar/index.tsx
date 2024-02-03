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
        <div id={TOOLBAR.$}>
            <div id={TOOLBAR.HANDLE}/>
            <div className="header">
                <button id={TOOLBAR.ANIMATION_PLAYER} onClick={(e) => toolbar.openTab(e.currentTarget, <AnimationPlayer/>)}>
                    Animation Player
                </button>
                <button id={TOOLBAR.TILEMAP_EDITOR} onClick={(e) => toolbar.openTab(e.currentTarget, <Tilemap/>)}>
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