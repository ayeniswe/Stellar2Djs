import { KMMapping, Bindings } from ".";
import { SceneEditor } from "../../main";
import { MESSAGE, log, warn } from "../logging";
import { SceneEditorEffects } from "../effects/effects";
import { signal } from "@preact/signals-react";
import { TextureRenderer, TextureSources } from "../rendering";

/**
 * The `SceneEditorInput` class is responsible for managing 
 * the level editor's user interaction and keybindings and 
 * provides a way to set and interact with the selected brush.
 * 
 * NOTE: The `SceneEditorInput` class is not meant to be instantiated directly. Instead, it should be created using the `SceneEditor` class.
 * @class
 */
class SceneEditorInput {
    private __editable = signal(false);
    private __clipping = signal(false);
    private __trash = signal(false);
    private __drag = signal(false);
    private __safety = signal(true); // NOTE: safety pin to prevent disastrous actions
    private __ready = signal(false);
    private __textureSources: TextureSources = {};
    private __renderer: TextureRenderer;
    private __b: Bindings;

    constructor( ctx: CanvasRenderingContext2D, mapping: KMMapping, id?: string) {
        this.__renderer = new TextureRenderer(ctx);
        this.__b = new Bindings(mapping, id);
    }

    /**
     * Initializes the input bindings and texture sources for the level editor.
     * This method sets up various input bindings that allow the user to interact with the level editor and perform editing actions.
     * Each binding is associated with a specific key or mouse event and triggers a corresponding method when the event occurs.
     * All texture sources are preloaded aswell.
     * @returns {Promise<void>} A promise that resolves once the input bindings are initialized.
     */
    async init(): Promise<void> {
        await this.__renderer.init();
        this.__textureSources = this.__renderer.textureSources;
 
        this.__b.addBinding(this.handleBrush.bind(this), [], ["mousemove"], false, "Canvas");
        this.__b.addBinding(this.handleDrawing.bind(this), ['LeftButton'], ["mousedown", "mousemove"], false, "Canvas");
        this.__b.addBinding(this.handleClippingMode.bind(this), ['c'], "keydown", true);
        this.__b.addBinding(this.handleDragDrawingMode.bind(this), ['d'], "keydown", true);
        this.__b.addBinding(this.handleEditingMode.bind(this), ['e'], "keydown", true);
        this.__b.addBinding(this.handleTrashMode.bind(this), ['Delete'], "keydown", true);
        this.__b.addBinding(this.handleClearCanvas.bind(this), ['Control','a'], "keydown", true);
        this.__b.addBinding(this.handleUndo.bind(this), ['Control', 'z'], "keydown", false);
    }

    removeAll() {
        this.__renderer.removeAllTexture();
    }

    /**
     * Undo the previous action in the editor.
     * This method calls the `undoRevision` method of the renderer, which attempts to revert the editor state to the previous revision.
     * If the `undoRevision` method returns true, indicating a successful undo, the method calls the `render` method of the renderer to update the editor display.
     * If the `undoRevision` method returns false, indicating no revision to undo, the method returns false to indicate that no undo operation was performed.
     * @returns {boolean} True if an undo operation was performed successfully, otherwise false.
     */
    private undo(): boolean {
        if (this.__renderer.undoRevision()) {
            this.__renderer.render();
            return true;
        }
        return false;
    }

    /**
     * Adds a texture to the editor at the specified coordinates.
     * This method adds a texture to the editor if the editor is in an editable state and a brush is selected.
     * The texture is added based on the current state of the `brush`.
     * After adding the texture, the method renders the editor display and returns an array containing the result of the addition.
     * If the addition is successful and results in changes to the editor, the method returns an array with the added texture information.
     * If the addition is not possible or no changes are made, the method returns an empty array.
     * @param {number} x - The x-coordinate of the texture.
     * @param {number} y - The y-coordinate of the texture.
     * @returns {number[]} An array containing the result of the addition, or an empty array if no changes were made.
     * 
     * NOTE: the default texture type is always `tilesets`. Since this is a level editor, that will only be responsible for the tilesets.
     */
    private add(x: number, y: number): number[] {
        if (this.__editable.value && SceneEditor.brush) {
            const res = this.__renderer.addTexture(this.__clipping.value, "tilesets", SceneEditor.brush.group, SceneEditor.brush.id, x, y);
            if (res.length > 0) {
                this.__renderer.render();
            }
            return res;
        }
        return [];
    }

    /**
     * Removes a texture from the editor at the specified coordinates.
     *
     * This method is a simliar to the `add` method.
     * @param {number} x - The x-coordinate of the texture to remove.
     * @param {number} y - The y-coordinate of the texture to remove.
     * @returns {number[]} An array containing the result of the removal, or an empty array if no changes were made.
     *
     * NOTE: the default texture type is always `tilesets`. Since this is a level editor, that will only be responsible for the tilesets.
     */
    private remove(x: number, y: number): number[] {
        if (SceneEditor.brush) {
            const res = this.__renderer.removeTexture(this.__clipping.value, "tilesets", SceneEditor.brush.group, SceneEditor.brush.id, x, y);
            if (res.length > 0) {
                this.__renderer.render();
            }
            return res;
        }
        return [];
    }

    /**
     * Handles the ability to undo actions, such as adding a tile onto the level editor. 
     *
     * NOTE: This method is only available if the editor is ready.
     * 
     * NOTE: The method does not allow redo, such as undoing a previous undo action.
     */
    private handleUndo(): void {
        if (!this.ready) return;
        if (this.undo()) log(MESSAGE.UNDO);
    }

    /**
     * Handles the constant creation of a div to
     * create a shadow brush effect.
     *
     * NOTE: This method is only available if the editor is ready and a brush is selected
     */
    private handleBrush(event: MouseEvent): void {
        if (!this.ready || !SceneEditor.brush) return;
        SceneEditorEffects.createBrush(event);
    }
    
    /**
     * Handles the drawing action in the level editor based on mouse events.
     * If the editor is in trash mode, it removes an element at the specified position.
     * If not in trash mode, it adds an element at the specified position and logs appropriate messages.
     * @param {MouseEvent} event - The mouse event object.
     * 
     * NOTE: This method is only available if the editor is ready.
     */
    private handleDrawing(event: MouseEvent): void {
        if (!this.ready) return;
        if (this.trash) {
            const res = this.remove(event.offsetX, event.offsetY);
            if (res.length !== 0) log(MESSAGE.REMOVE_POSITION, `X: ${res[0]}, Y: ${res[1]}`);
        } else {
            if (event.type === "mousemove" && !this.drag) return;
            let res;
            if (event.offsetX && event.offsetY){
                res = this.add(event.offsetX, event.offsetY);
            } else {
                res = this.add(event.clientX, event.clientY);
            }
            const isEmpty = res.length === 0;
            if (isEmpty && this.editable) warn(MESSAGE.BRUSH_NOT_SET);
            else if (isEmpty && !this.editable) warn(MESSAGE.EDITING, 'off');
            else if (!isEmpty) log(MESSAGE.RENDER_POSITION, `X: ${res[0]}, Y: ${res[1]}`);
        }
    }

    // *****************************************
    //        TOGGLE HANDLERS SECTION
    // *****************************************
    // The handlers below are used
    // to toggle the state of the editor
    // modes and apply/remove effects respectively
    //
    // NOTE: These methods are only available if
    // the editor is ready
    // *****************************************

    private handleTrashMode() {
        if (!this.ready) return;
        if (this.trash) {
            this.trash = false;
            SceneEditorEffects.removeTrashEffect();
        } else {
            this.trash = true;
            SceneEditorEffects.applyTrashEffect();
        }
        warn(MESSAGE.TRASH, this.trash ? "on" : "off");
    }

    private handleEditingMode() {
        if (!this.ready) return;
        if (this.editable) {
            this.editable = false;
            SceneEditorEffects.removeEditingEffect();
        } else {
            this.editable = true;
            SceneEditorEffects.applyEditingEffect();
        }
        warn(MESSAGE.EDITING, this.editable ? "on" : "off");
    }

    private handleClippingMode() {
        if (!this.ready) return;
        if (this.clipping) {
            this.clipping = false;
            SceneEditorEffects.removeClippingEffect();
        } else {
            this.clipping = true;
            SceneEditorEffects.applyClippingEffect();
        }
        warn(MESSAGE.CLIPPING, this.clipping ? "on" : "off");
    }

    private handleDragDrawingMode() {
        if (!this.ready) return;
        if (this.drag) {
            this.drag = false;
            SceneEditorEffects.removeDragEffect();
        } else {
            this.drag = true;
            SceneEditorEffects.applyDragEffect();
        }
        warn(MESSAGE.DRAG, this.drag ? "on" : "off");
    }

    /**
     * Handles the clearing of the entire canvas in the level editor.
     * The safety pin is turned off for 3 seconds.
     * After 3 seconds, the safety pin is turned back on to prevent serious actions.
     *
     * NOTE: This method is only available if the editor is ready.
     */
    private handleClearCanvas() {
        if (!this.ready) return;
        this.handleTrashMode();
        this.safety = false;
        setTimeout(() => {
            this.handleTrashMode();
            this.safety = true;
        }, 3000);
    }
   
    // *****************************************
    //        GETTERS AND SETTERS SECTION
    // *****************************************
    // The getters and setters below are used
    // to control the state and the different
    // modes in the level editor.
    // NOTE: the safety property is used
    // to block serious actions in the editor.
    // NOTE: the ready property is used
    // to determine if level editor is in ready
    // state for processing actions.
    // *****************************************

    get textureSources() {
        return this.__textureSources;
    }

    get ready() {
        return this.__ready.value;
    }

    get safety() {
        return this.__safety.value;
    }

    get drag() {
        return this.__drag.value;
    }

    get trash() {
        return this.__trash.value;
    }

    get editable() {
        return this.__editable.value;
    }
    
    get clipping() {
        return this.__clipping.value;
    }

    set ready(val: boolean) {
       this.__ready.value = val
    }

    set safety(val: boolean) {
       this.__safety.value = val
    }

    set drag(val: boolean) {
       this.__drag.value= val
    }

    set trash(val: boolean) {
       this.__trash.value = val
    }

    set editable(val: boolean) {
       this.__editable.value = val
    }

    set clipping(val: boolean) {
       this.__clipping.value = val
    }

}

export {
    SceneEditorInput
}