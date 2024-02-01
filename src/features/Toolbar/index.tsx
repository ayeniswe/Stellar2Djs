import "./style.css";
import { useEffect } from "react";
import AnimationPlayer from "../AnimationPlayer";
import { useSignal } from "@preact/signals-react";
import Tilemap from "../Tilemap";
const Toolbar = () => {
    useEffect(() => {
        document.getElementById("Toolbar__handle")!.onmousedown = (e) => {
            const toolbar = document.getElementById("Toolbar")!;
            const currentY = e.clientY;
            const currentHeight = Number(window.getComputedStyle(toolbar).getPropertyValue("height").replace("px",""));
            document.onmousemove = (e) => {
                toolbar.style.height = `${currentHeight + -(e.clientY - currentY)}px`;
            }
        }
        document.onmouseup = (e) => {
            document.onmousemove = null
        }
    },[])
    const tabContent = useSignal<JSX.Element>(<div/>);
    const tab = useSignal<HTMLDivElement>(document.createElement('div'));
    const openTab = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, content: JSX.Element) => {
        tab.value.style.backgroundColor = "";
        tab.value = e.currentTarget
        tab.value.style.backgroundColor = "var(--hover-color)";
        tabContent.value = content
    }
    return (
        <div id="Toolbar">
            <div id="Toolbar__handle"/>
            <div className="Toolbar__header">
                <div className="Toolbar__header__button" onClick={(e) => openTab(e, <AnimationPlayer/>)}>
                    <span className="Toolbar__header__button__title">Animation Player</span>
                </div>
                <div className="Toolbar__header__button" onClick={(e) => openTab(e, <Tilemap/>)}>
                    <span className="Toolbar__header__button__title">Tilemap Editor</span>
                </div>
            </div>
            <div className="Toolbar__content">
                {tabContent}
            </div>
        </div>
    )
}
export default Toolbar