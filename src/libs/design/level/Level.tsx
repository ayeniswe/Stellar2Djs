import { Brush } from '.';
import { TextureRenderer } from '../../rendering';

class Level extends TextureRenderer {
    private __editable: boolean = false;
    private __renderer: TextureRenderer;
    private __clipping: boolean = true;
    private __trash: boolean = false;
    static brush: Brush;
 
    constructor(ctx: CanvasRenderingContext2D) {
        super(ctx);
        this.__renderer = new TextureRenderer(ctx);
    }

    async init() {
        await this.__renderer.init();
    }

    /**
     * Render object at the specified coordinates.
     * If editable mode is off, it logs a warning message.
     *
     * @param {number} x - The x-coordinate of the source.
     * @param {number} y - The y-coordinate of the source.
     */
    add(x: number, y: number) {
        if (this.__editable) {
            try {
                this.__renderer.__addTexture(this.__clipping, "tiles", Level.brush.group, Level.brush.id, x, y);
                this.__renderer.__render();
            } catch (error) {
                console.warn('Brush not set. Please set a brush before adding an object.');
            }
        } else {
            console.warn('Editing mode is off.');
        }
    }

    /**
     * Remove a texture from the renderer.
     * @param {number} x - The x-coordinate of the texture.
     * @param {number} y - The y-coordinate of the texture.
     */
    remove(x: number, y: number) {
        this.__renderer.__removeTexture(this.__clipping, "tiles", Level.brush.group, Level.brush.id, x, y);
    }
 
    /**
     * Sets the brush for the object to place.
     *
     * @param {string} brushId - The brush id to set.
     */
    static setBrush(brushId: string, group: string) {
        this.brush = {
            id: brushId,
            group: group
        }
    }
    
    /**
     * Turns on the editing mode. Disables editing mode by default.
     *
     * @return {void}
     */
    turnOnEditing(): void {
        this.__editable = true
    }
    
    /**
    * Turns off clipping mode. Enables clipping by default.
    */
    turnOffClipping() {
        this.__clipping = false;
    }

    /**
     * Turns on the trashing mode. Disables trash feature by default.
     */
    turnOnTrash() {
        this.__trash = true;
        console.warn('Trash mode is on.');
    }

    turnOffTrash() {
        this.__trash = false;
        console.warn('Trash mode is off.');
    }

    /**
     * Retrieves the value of the trash mode.
     *
     */
    trashMode() {
       return this.__trash;
    }
    
    turnOffEditing(): void {
        this.__editable = false
    }

    turnOnClipping() {
        this.__clipping = true;
    }

}

export {
    Level
}