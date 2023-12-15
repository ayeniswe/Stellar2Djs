import { KMMapping, Bindings } from ".";
import { applyTrashEffect, removeTrashEffect } from "../../features/LevelEditor/effects";
import { LevelEditorDesign } from "../design/level";
import { MESSAGE, log, warn } from "../logging";

/**
 * Handles all events related to the level editor.
 * Sets up the initial bindings for the keyboard/mouse events.
 */
class LevelEditorInput extends LevelEditorDesign {
    private __b: Bindings;

    constructor(ctx: CanvasRenderingContext2D, mapping: KMMapping, id?: string) {
        super(ctx)
        this.__b = new Bindings(mapping, id);
    }

    async initInput() {
        await this.initEditor();
        this.__b.addBinding(this.handleDragDrawing.bind(this), [], "mousemove", false, "Canvas");
        this.__b.addBinding(this.handleDrawing.bind(this), ['LeftButton'], "mousedown", false, "Canvas");
        this.__b.addBinding(this.handleClippingMode.bind(this), ['c'], "keydown", true);
        this.__b.addBinding(this.handleDragDrawingMode.bind(this), ['d'], "keydown", true);
        this.__b.addBinding(this.handleEditingMode.bind(this), ['e'], "keydown", true);
        this.__b.addBinding(this.handleTrashMode.bind(this), ['Delete'], "keydown", true);
        this.__b.addBinding(this.handleClearAll.bind(this), ['Control', 'a'], "keydown", true);
    }

    private handleDragDrawing(event: MouseEvent) {
        if (this.drag) this.handleDrawing(event);
    }

    private handleDrawing(event: MouseEvent) {
        if (this.trash) {
            const res = this.remove(event.offsetX, event.offsetY);
            if (res.length != 0) log(MESSAGE.REMOVE_POSITION, `X: ${res[0]}, Y: ${res[1]}`);
        } else {
            const res = this.add(event.offsetX, event.offsetY);
            const isEmpty = res.length === 0;
            if (isEmpty && this.editable) warn(MESSAGE.BRUSH_NOT_SET);
            else if (isEmpty && !this.editable) warn(MESSAGE.EDITING, 'off');
            else if (!isEmpty) log(MESSAGE.RENDER_POSITION, `X: ${res[0]}, Y: ${res[1]}`);
        }
    }

    private handleTrashMode() {
        if (this.trash) {
            this.trash = false;
            removeTrashEffect();
        } else {
            this.trash = true;
            applyTrashEffect();
        }
        warn(MESSAGE.TRASH, this.trash ? "on" : "off");
    }

    private handleEditingMode() {
        if (this.editable) {
            this.editable = false;
        } else {
            this.editable = true;
        }
        warn(MESSAGE.EDITING, this.editable ? "on" : "off");
    }

    private handleClippingMode() {
        if (this.clipping) {
            this.clipping = false;
        } else {
            this.clipping = true;
        }
        warn(MESSAGE.CLIPPING, this.clipping ? "on" : "off");
    }

    private handleDragDrawingMode() {
        if (this.drag) {
            this.drag = false;
        } else {
            this.drag = true;
        }
        warn(MESSAGE.DRAG, this.drag ? "on" : "off");
    }

    // PROTECTED METHODS
    // ==================
    // These methods are guarded by a safety check.

    private handleClearAll() {
        if (!this.safety) {
            this.removeAll();
            this.safety = true;
        }
        warn(MESSAGE.SERIOUS_ACTION);
    }

}

export {
    LevelEditorInput
}