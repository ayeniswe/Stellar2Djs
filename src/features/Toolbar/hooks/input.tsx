import { ToolbarAttrs } from ".";
import { TOOLBAR } from "..";
import { Bindings } from "../../../libs/input";
import { getHeight } from "../../../utils/styleProps";
import AnimationPlayer from "../../AnimationPlayer";
import Tilemap from "../../Tilemap";
const input = (attrs: ToolbarAttrs) => {
    const __bindings = Bindings.getInstance();
    const initialize = () => {
        __bindings.addBinding(resizeToolbar, ["LeftButton"], ["mousedown"], false, "Toolbar__handle");
        __bindings.addBinding(openAnimationPlayerTab, ["a"], "keydown", false);
        __bindings.addBinding(closeToolbar, ["t"], "keydown", false);
        __bindings.addBinding(openTilemapEditorTab, ["m"], "keydown", false);
    }
    const resizeToolbar = (e: MouseEvent) => {
        const toolbar = document.getElementById("Toolbar")!;
        const currentY = e.clientY;
        const currentHeight = getHeight(toolbar).toNumber();
        document.onmousemove = (e) => {
            toolbar.style.height = `${currentHeight + -(e.clientY - currentY)}px`;
        }
    }
    const openAnimationPlayerTab = () => {
        if (attrs.tab) {
            attrs.tab.style.backgroundColor = "";
        }
        const tab = document.getElementById(TOOLBAR.ANIMATION_PLAYER);
        tab!.style.backgroundColor = "var(--hover-color)";
        attrs.tabContent = <AnimationPlayer/>;
        attrs.tab = tab
    }
    const openTilemapEditorTab = () => {
        if (attrs.tab) {
            attrs.tab.style.backgroundColor = "";
        }
        const tab = document.getElementById(TOOLBAR.TILEMAP_EDITOR);
        tab!.style.backgroundColor = "var(--hover-color)";
        attrs.tabContent = <Tilemap/>;
        attrs.tab = tab
    }
    const closeToolbar = () => {
        if (attrs.tab) {
            attrs.tab.style.backgroundColor = "";
        }
        attrs.tabContent = <div/>;
        attrs.tab = null
    }
    return {
        initialize
    }
}
export {
    input
}