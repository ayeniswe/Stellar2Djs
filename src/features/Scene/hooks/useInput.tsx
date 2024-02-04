import { Bindings } from "../../../libs/input";
import { MESSAGE, log, warn } from "../../../libs/logging";
import { Signal, useSignal } from "@preact/signals-react";
import { TextureRenderer } from "../../../libs/rendering/types";
import { Brush } from "./type";
import { iconEffects } from "../../../libs/effects";
import { SCENE } from "..";
/**
 * The hook is responsible for managing 
 * the scene user interaction and keybindings and 
 * provides a way to set and interact with the selected brush.
 * 
 * @param renderer - The texture renderer
 * @param brush - The selected brush
 * 
 */
const useInput = (renderer: TextureRenderer, brush: Signal<Brush | null>) => {
    const __editable = useSignal(false);
    const __drag = useSignal(false);
    const __safety = useSignal(true);
    const __trash = useSignal(false);
    const __clip = useSignal(false);
    const __ready = useSignal(false);
    const { applyDragEffect, applyTrashEffect, applyClippingEffect, applyEditingEffect } = iconEffects();
    const input = {
        get editable() {
            return __editable.value
        },
        set editable(value: boolean) {
            __editable.value = value
        },
        get clip() {
            return __clip.value
        },
        set clip(value: boolean) {
            __clip.value = value
        },
        get trash() {
            return __trash.value
        },
        set trash(value: boolean) {
            __trash.value = value
        },
        get ready() {
            return __ready.value
        },
        set ready(value: boolean) {
            __ready.value = value
        },
        get safety() {
            return __safety.value
        },
        set safety(value: boolean) {
            __safety.value = value
        },
        get drag() {
            return __drag.value
        },
        set drag(value: boolean) {
            __drag.value = value
        },
    }
    const initialize = (): void => {
        const bindings = Bindings.getInstance();
        bindings.addBinding(handleBrush.bind(this), [], ["mousemove"], false, "Canvas");
        bindings.addBinding(handleDrawing.bind(this), ['LeftButton'], ["mousedown", "mousemove"], false, "Canvas");
        bindings.addBinding(toggleClipMode.bind(this), ['c'], "keydown", true);
        bindings.addBinding(toggleDragMode.bind(this), ['d'], "keydown", true);
        bindings.addBinding(toggleEditMode.bind(this), ['e'], "keydown", true);
        bindings.addBinding(toggleTrashMode.bind(this), ['Delete'], "keydown", true);
        bindings.addBinding(clearCanvas.bind(this), ['Control','a'], "keydown", true);
        bindings.addBinding(handleUndo.bind(this), ['Control', 'z'], "keydown", false);
    }
    const removeAll = () => {
        renderer.removeAllTexture();
    }
    /**
     * Undo the previous action in the scene.
     * This method calls the `undoRevision` method of the renderer, which attempts to revert the scene state to the previous revision.
     * If the `undoRevision` method returns true, indicating a successful undo, the method calls the `render` method of the renderer to update the sc display.
     * If the `undoRevision` method returns false, indicating no revision to undo, the method returns false to indicate that no undo operation was performed.
     * @returns {boolean} True if an undo operation was performed successfully, otherwise false.
     */
    const undo = (): boolean => {
        if (renderer.undoRevision()) {
            renderer.render();
            return true;
        }
        return false;
    }
    /**
     * Adds a texture to the scene at the specified coordinates.
     * This method adds a texture to the scene if the scene is in an editable state and a brush is selected.
     * The texture is added based on the current state of the `brush`.
     * After adding the texture, the method renders the scene display and returns an array containing the result of the addition.
     * If the addition is successful and results in changes to the scene, the method returns an array with the added texture information.
     * If the addition is not possible or no changes are made, the method returns an empty array.
     * @param {number} x - The x-coordinate of the texture.
     * @param {number} y - The y-coordinate of the texture.
     * @returns {number[]} An array containing the result of the addition, or an empty array if no changes were made.
     * 
     * NOTE: the default texture type is always `tilesets`. Since this is a scene, that will only be responsible for the tilesets.
     */
    const add = (x: number, y: number): number[] => {
        if (__editable.value && brush.value) {
            const res = renderer.addTexture(__clip.value, "tilesets", brush.value.group, brush.value.id, x, y);
            if (res.length > 0) {
                renderer.render();
            }
            return res;
        }
        return [];
    }
    /**
     * Removes a texture from the scene at the specified coordinates.
     *
     * This method is a simliar to the `add` method.
     * @param {number} x - The x-coordinate of the texture to remove.
     * @param {number} y - The y-coordinate of the texture to remove.
     * @returns {number[]} An array containing the result of the removal, or an empty array if no changes were made.
     *
     * NOTE: the default texture type is always `tilesets`. Since this is a scene, that will only be responsible for the tilesets.
     */
    const remove = (x: number, y: number): number[] => {
        if (brush.value) {
            const res = renderer.removeTexture(__clip.value, "tilesets", brush.value.group, brush.value.id, x, y);
            if (res.length > 0) {
                renderer.render();
            }
            return res;
        }
        return [];
    }
    /**
     * Handles the ability to undo actions, such as adding a tile onto the scene.
     *
     * NOTE: This method is only available if the scene is ready.
     * 
     * NOTE: The method does not allow redo, such as undoing a previous undo action.
     */
    const handleUndo = (): void => {
        if (!__ready.value) return;
        if (undo()) {
            log(MESSAGE.UNDO);
        }
    }
    /**
     * Handles the constant creation of a div to
     * create a shadow brush effect.
     *
     * NOTE: This method is only available if the scene is ready and a brush is selected
     */
    const handleBrush = (event: MouseEvent): void => {
        if (!__ready.value || !brush.value) return;
        const brushElement = document.getElementById(SCENE.BRUSH)!;
        const { w, h } = brush.value!.object;
        brushElement.style.display = 'flex';
        brushElement.style.left = `${event.clientX}px`;
        brushElement.style.top = `${event.clientY}px`;
        brushElement.style.width = `${w}px`;
        brushElement.style.height = `${h}px`;
    }
    /**
     * Handles the drawing action in the level scene based on mouse events.
     * If the scene is in trash mode, it removes an element at the specified position.
     * If not in trash mode, it adds an element at the specified position and logs appropriate messages.
     * @param {MouseEvent} event - The mouse event object.
     * 
     * NOTE: This method is only available if the scene is ready.
     */
    const handleDrawing = (event: MouseEvent): void => {
        if (!__ready.value) return;
        if (__trash.value) {
            const res = remove(event.offsetX, event.offsetY);
            if (res.length !== 0) {
                log(MESSAGE.REMOVE_POSITION, `X: ${res[0]}, Y: ${res[1]}`);
            } 
        } else {
            if (event.type === "mousemove" && !__drag.value) return;
            let res;
            if (event.offsetX && event.offsetY){
                res = add(event.offsetX, event.offsetY);
            } else {
                res = add(event.clientX, event.clientY);
            }
            const isEmpty = res.length === 0;
            if (isEmpty && __editable.value) {
                warn(MESSAGE.BRUSH_NOT_SET);
            } else if (isEmpty && !__editable.value) {
                warn(MESSAGE.EDITING, 'off');
            } else if (!isEmpty) {
                log(MESSAGE.RENDER_POSITION, `X: ${res[0]}, Y: ${res[1]}`);
            }
        }
    }
    // *****************************************
    //        TOGGLE HANDLERS SECTION
    // *****************************************
    // The handlers below are used
    // to toggle the state of the scene
    // modes and apply/remove effects respectively
    //
    // NOTE: These methods are only available if
    // the scene is ready
    // *****************************************
    const toggleTrashMode = () => {
        const button = document.getElementById(SCENE.TRASH);
        if (!__ready.value || !button) return;
        if (__trash.value) {
            __trash.value = false;
            applyTrashEffect(button, false);
        } else {
            __trash.value = true;
            applyTrashEffect(button);
        }
        warn(MESSAGE.TRASH, __trash.value ? "on" : "off");
    }
    const toggleEditMode = () => {
        const button = document.getElementById(SCENE.EDIT);
        if (!__ready.value || !button) return;
        if (__editable.value) {
            __editable.value = false;
            applyEditingEffect(button, false);
        } else {
            __editable.value = true;
            applyEditingEffect(button);
        }
        warn(MESSAGE.EDITING, __editable.value ? "on" : "off");
    }
    const toggleClipMode = () => {
        const button = document.getElementById(SCENE.CLIP);
        if (!__ready.value || !button) return;
        if (__clip.value) {
            __clip.value = false;
            applyClippingEffect(button, false);
        } else {
            __clip.value = true;
            applyClippingEffect(button);
        }
        warn(MESSAGE.CLIPPING, __clip.value ? "on" : "off");
    }
    const toggleDragMode = () => {
        console.log(__drag.value)
        const button = document.getElementById(SCENE.DRAG);
        if (!__ready.value || !button) return;
        if (__drag.value) {
            __drag.value = false;
            applyDragEffect(button, false);
        } else {
            __drag.value = true;
            applyDragEffect(button);
        }
        warn(MESSAGE.DRAG, __drag.value ? "on" : "off");
    }
    /**
     * Handles the clearing of the entire canvas in the scene.
     * The safety pin is turned off for 3 seconds.
     * After 3 seconds, the safety pin is turned back on to prevent serious actions.
     *
     * NOTE: This method is only available if the editor is ready.
     */
    const clearCanvas = () => {
        if (!__ready.value) return;
        toggleTrashMode();
        __safety.value = false;
        setTimeout(() => {
            toggleTrashMode();
            __safety.value = true;
        }, 3000);
    }
    return {
        input,
        removeAll,
        initialize
    }
}
export {
    useInput
}