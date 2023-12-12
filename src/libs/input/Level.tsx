import { Input } from ".";
import { Level } from "../design/level";

/**
 * Handles all the event associated with Level design.
 */
class LevelInput {
    private lvl: Level;

    constructor(ctx: CanvasRenderingContext2D) {
        this.lvl = new Level(ctx);
        Input.click(this.handleDrawing.bind(this), "Canvas");
        Input.delete(this.handleTrashMode.bind(this));
    }

    async init() {
        await this.lvl.init();
        this.lvl.turnOnEditing();
    }

    /**
     * Handles the drawing event to the canvas.
     *
     * @param {any} event - The event object.
     */
    private handleDrawing(event: any) {
        if (this.lvl.trashMode()) {
            this.lvl.remove(event.offsetX, event.offsetY);
        } else {
            this.lvl.add(event.offsetX, event.offsetY);
        }
    }

    /**
     * Handles the trash mode.
     */
    private handleTrashMode() {
        if (this.lvl.trashMode()) {
            this.lvl.turnOffTrash();
        } else {
            this.lvl.turnOnTrash();
        }
    }

}

export {
    LevelInput
}