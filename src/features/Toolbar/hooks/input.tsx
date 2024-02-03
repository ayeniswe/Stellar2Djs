import { ToolbarAttrs } from ".";
import { TOOLBAR } from "..";
import { Bindings } from "../../../libs/input";
import { getHeight } from "../../../utils/styleProps";
import AnimationPlayer from "../../AnimationPlayer";
import Tilemap from "../../Tilemap";
const input = (attrs: ToolbarAttrs) => {
    const __bindings = Bindings.getInstance();
    const initialize = () => {
        __bindings.addBinding(resizeToolbar, ["LeftButton"], ["mousedown"], false, TOOLBAR.HANDLE);
        __bindings.addBinding(openAnimationPlayerTab, ["a"], "keydown", false);
        __bindings.addBinding(closeToolbar, ["t"], "keydown", false);
        __bindings.addBinding(openTilemapEditorTab, ["m"], "keydown", false);
    }
    /**
     * Handles resizing the toolbar up and down
     */
    const resizeToolbar = (e: MouseEvent) => {
        const toolbar = document.getElementById(TOOLBAR.$)!;
        const currentY = e.clientY;
        const currentHeight = getHeight(toolbar).toNumber();
        document.onmousemove = (e) => {
            toolbar.style.height = `${currentHeight + -(e.clientY - currentY)}px`;
        }
    }
    /**
     * Handles opening the animation player tab
     *
     */
    const openAnimationPlayerTab = () => {
        if (attrs.tab) {
            attrs.tab.style.backgroundColor = "";
        }
        const tab = document.getElementById(TOOLBAR.ANIMATION_PLAYER);
        tab!.style.backgroundColor = "var(--hover-color)";
        attrs.tabContent = <AnimationPlayer/>;
        attrs.tab = tab
    }
    /**
     * Handles opening the tilemap editor tab
     *
     */
    const openTilemapEditorTab = () => {
        if (attrs.tab) {
            attrs.tab.style.backgroundColor = "";
        }
        const tab = document.getElementById(TOOLBAR.TILEMAP_EDITOR);
        tab!.style.backgroundColor = "var(--hover-color)";
        attrs.tabContent = <Tilemap/>;
        attrs.tab = tab
    }
    /**
     * Closes the toolbar
     *
     *  NOTE - height is reset to initial
     */
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