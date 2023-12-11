import { TextureAtlas, TextureRenderer } from '../../rendering';

class Level extends TextureRenderer {
    private editable: boolean = false;
    private brush: string = TextureAtlas.PLAIN_WALL;
    private renderer: TextureRenderer;
 
    constructor(ctx: CanvasRenderingContext2D) {
        super(ctx);
        this.renderer = new TextureRenderer(ctx);
    }

    async init() {
        await this.renderer.init();
    }
    
    /**
     * Turns on the editing mode. Disables editing mode by default.
     *
     * @return {void}
     */
    turnOnEditing(): void {
        this.editable = true
    }

    turnOffEditing(): void {
        this.editable = false
    }

    /**
     * Render object at the specified coordinates.
     * If editable mode is off, it logs a warning message.
     *
     * @param {number} x - The x-coordinate of the source.
     * @param {number} y - The y-coordinate of the source.
     */
    add(x: number, y: number) {
        if (this.editable) {
            this.renderer.addTexture("tiles", "wall", this.brush, x, y);
            this.renderer.render(this.ctx);
        } else {
            console.warn('Editing mode is off.');
        }
    }

    /**
     * Sets the brush for the object.
     *
     * @param {string} brush - The brush to set.
     */
    setBrush(brush: string) {
        this.brush = brush
    }
}

export {
    Level
}