import { KMMapping, Bindings } from ".";
import { LevelEditorDesign } from "../design/level";
import { MESSAGE, log, warn } from "../logging";
import { LevelEditorEffects } from "../effects/effects";

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
        this.__b.addBinding(this.handleBrush.bind(this), [], ["mousemove"], false, "Canvas");
        this.__b.addBinding(this.handleDrawing.bind(this), ['LeftButton'], ["mousedown", "mousemove"], false, "Canvas");
        this.__b.addBinding(this.handleClippingMode.bind(this), ['c'], "keydown", true);
        this.__b.addBinding(this.handleDragDrawingMode.bind(this), ['d'], "keydown", true);
        this.__b.addBinding(this.handleEditingMode.bind(this), ['e'], "keydown", true);
        this.__b.addBinding(this.handleTrashMode.bind(this), ['Delete'], "keydown", true);
        this.__b.addBinding(this.handleClearCanvas.bind(this), ['Control', 'a'], "keydown", true);
        this.__b.addBinding(this.handleUndo.bind(this), ['Control', 'z'], "keydown", false);
    }

    private handleUndo() {
        if (!this.ready) return;
        if (this.undo()) log(MESSAGE.UNDO);
    }

    private handleBrush(event: MouseEvent) {
        if (!this.ready || !LevelEditorDesign.brush) return;
        LevelEditorEffects.createBrush(event);
    }

    private handleDrawing(event: MouseEvent) {
        if (!this.ready) return;
        if (this.trash) {
            const res = this.remove(event.offsetX, event.offsetY);
            if (res.length != 0) log(MESSAGE.REMOVE_POSITION, `X: ${res[0]}, Y: ${res[1]}`);
        } else {
            if (event.type === "mousemove" && !this.drag) return;
            const res = this.add(event.offsetX, event.offsetY);
            const isEmpty = res.length === 0;
            if (isEmpty && this.editable) warn(MESSAGE.BRUSH_NOT_SET);
            else if (isEmpty && !this.editable) warn(MESSAGE.EDITING, 'off');
            else if (!isEmpty) log(MESSAGE.RENDER_POSITION, `X: ${res[0]}, Y: ${res[1]}`);
        }
    }

    private handleTrashMode() {
        if (!this.ready) return;
        if (this.trash) {
            this.trash = false;
            LevelEditorEffects.removeTrashEffect();
        } else {
            this.trash = true;
            LevelEditorEffects.applyTrashEffect();
        }
        warn(MESSAGE.TRASH, this.trash ? "on" : "off");
    }

    private handleEditingMode() {
        if (!this.ready) return;
        if (this.editable) {
            this.editable = false;
            LevelEditorEffects.removeEditingEffect();
        } else {
            this.editable = true;
            LevelEditorEffects.applyEditingEffect();
        }
        warn(MESSAGE.EDITING, this.editable ? "on" : "off");
    }

    private handleClippingMode() {
        if (!this.ready) return;
        if (this.clipping) {
            this.clipping = false;
            LevelEditorEffects.removeClippingEffect();
        } else {
            this.clipping = true;
            LevelEditorEffects.applyClippingEffect();
        }
        warn(MESSAGE.CLIPPING, this.clipping ? "on" : "off");
    }

    private handleDragDrawingMode() {
        if (!this.ready) return;
        if (this.drag) {
            this.drag = false;
            LevelEditorEffects.removeDragEffect();
        } else {
            this.drag = true;
            LevelEditorEffects.applyDragEffect();
        }
        warn(MESSAGE.DRAG, this.drag ? "on" : "off");
    }

    // private handleBrushIcon() {
    //     document.getElementById
    // }

    // PROTECTED ACTIONS
    // ==================
    // These actions are guarded by a safety check.

    private handleClearCanvas() {
        if (!this.ready) return;
        this.handleTrashMode();
        this.safety = false;
        setTimeout(() => {
            this.handleTrashMode();
            this.safety = true;
        }, 3000);
    }

}

export {
    LevelEditorInput
}