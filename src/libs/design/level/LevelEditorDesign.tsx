import { MESSAGE, log } from '../../logging';
import { Brush } from '.';
import { TextureRenderer } from '../../rendering';
import { Signal, signal } from '@preact/signals-react';

class LevelEditorDesign {
    private __editable: Signal<boolean> = signal(true);
    private __clipping: Signal<boolean> = signal(false);
    private __trash: Signal<boolean> = signal(false);
    private __drag: Signal<boolean> = signal(false);
    private __safety: Signal<boolean> = signal(true); // prevent serious actions by accident
    private __textureType: string = "tiles";
    private __renderer: TextureRenderer;
    static brush: Brush;
 
    constructor(ctx: CanvasRenderingContext2D) {
        this.__renderer = new TextureRenderer(ctx);
    }

    async initEditor() {
        await this.__renderer.initRenderer();
    }

    /**
     * Render object at the specified coordinates.
     *
     * @param {number} x - The x-coordinate of the source.
     * @param {number} y - The y-coordinate of the source.
     * @returns {number[]} - Returns location if the object was rendered, empty array otherwise.
     */
    add(x: number, y: number): number[] {
        if (this.__editable.value && LevelEditorDesign.brush) {
            const res = this.__renderer.addTexture(this.__clipping.value, this.__textureType, LevelEditorDesign.brush.group, LevelEditorDesign.brush.id, x, y);
            this.__renderer.render();
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
     */
    static setBrush(brushId: string, group: string, name: string) {
        this.brush = {
            id: brushId,
            group: group,
            name: name
        }
        log(MESSAGE.BRUSH_SELECTED, name);
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