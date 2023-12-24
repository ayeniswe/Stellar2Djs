import { MESSAGE, log } from '../libs/logging';
import { Brush } from '.';
import { TextureObject } from '../libs/rendering';
import { KMMapping, LevelEditorInput } from '../libs/input';

/**
 * The `LevelEditor` class is responsible for managing the `LevelEditorUI` behavior and provides a way to set and interact with the canvas brush.
 * 
 * @class
 */
class LevelEditor {
    private __input: LevelEditorInput;
    static brush: Brush;
 
    constructor(ctx: CanvasRenderingContext2D, mapping: KMMapping, id?: string) {
        this.__input = new LevelEditorInput(ctx, mapping, id);
    }

    /**
     * Initializes the level editor.
     * 
     * Note: This method should be called before any operations or interactions with the editor to ensure that it is properly initialized.
     * @returns {Promise<void>} A promise that resolves to void when the initialization process is complete.
     */
    async init(): Promise<void> {
        await this.__input.init();
    }

    /**
     * Sets the brush for the level editor.
     * This method sets the brush to be used in the level editor by assigning the provided brush ID, group, and object to the `brush` property of the class.
     * After setting the brush, the method logs a message indicating the selection of the brush, including the name of the selected object.
     * @param {string} brushId - The ID of the brush.
     * @param {string} group - The group of the brush.
     * @param {TextureObject} object - The texture object representing the brush.
     */
    static setBrush(brushId: string, group: string, object: TextureObject) {
        this.brush = {
            id: brushId,
            group: group,
            object: object
        }
        log(MESSAGE.BRUSH_SELECTED, object.name);
    }

    get input() {
        return this.__input;
    }
}

export {
    LevelEditor
}