import { MESSAGE, log } from '../../logging';
import { Brush } from '.';
import { TextureObject, TextureRenderer } from '../../rendering';
import { signal } from '@preact/signals-react';

class LevelEditorDesign {
    private __editable = signal(true);
    private __clipping = signal(false);
    private __trash = signal(false);
    private __drag = signal(false);
    private __safety = signal(true); // prevent serious actions by accident
    private __ready = signal(false); // prevent input from being called before initilization
    private __textureType = "tiles";
    private __renderer: TextureRenderer;
    static brush: Brush;
 
    constructor(ctx: CanvasRenderingContext2D) {
        this.__renderer = new TextureRenderer(ctx);
    }

    async initEditor() {
        await this.__renderer.initRenderer();
    }

    /**
     * Undo the actions of the renderer.
     * @returns {boolean} - Returns false if there are no actions. Returns true otherwise.
     */
    undo(): boolean {
        if (this.__renderer.undoRevision()) {
            this.__renderer.render();
            return true;
        }
        return false;
    }

    /**
     * Render object at the specified coordinates and adds action to revision record.
     *
     * @param {number} x - The x-coordinate of the source.
     * @param {number} y - The y-coordinate of the source.
     * @returns {number[]} - Returns location if the object was rendered, empty array otherwise.
     */
    add(x: number, y: number): number[] {
        if (this.__editable.value && LevelEditorDesign.brush) {
            const res = this.__renderer.addTexture(this.__clipping.value, this.__textureType, LevelEditorDesign.brush.group, LevelEditorDesign.brush.id, x, y);
            // Record the action for revision
            if (res.length > 0) {
                this.__renderer.render();
            }
            return res;
        }
        return [];
    }

    /**
     * Remove a texture from the renderer.
     * @param {number} x - The x-coordinate of the texture.
     * @param {number} y - The y-coordinate of the texture.
     * @returns {number[]} - Returns location of the object where it was removed, empty array otherwise.
     */
    remove(x: number, y: number): number[] {
        if (LevelEditorDesign.brush) {
            const res = this.__renderer.removeTexture(this.__clipping.value, this.__textureType, LevelEditorDesign.brush.group, LevelEditorDesign.brush.id, x, y);
            if (res.length > 0) {
                this.__renderer.render();
            }
            return res;
        }
        return [];
    }

    /**
     * Remove all textures from the renderer and clear the canvas.
     */
    removeAll() {
        this.__renderer.removeAllTexture();
    }
 
    /**
     * Sets the brush for the object to place.
     *
     * @param {string} brushId - The brush id to set.
     * @param {string} group - The brush group.
     * @param {TextureObject} group - The brush metadata.
     */
    static setBrush(brushId: string, group: string, object: TextureObject) {
        this.brush = {
            id: brushId,
            group: group,
            object: object
        }
        log(MESSAGE.BRUSH_SELECTED, object.name);
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
    LevelEditorDesign
}