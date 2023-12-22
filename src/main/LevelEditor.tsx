import { KMMapping, LevelEditorInput } from "../libs/input";

class LevelEditor {
    private __input: LevelEditorInput;
    
    constructor(ctx: CanvasRenderingContext2D, mapping: KMMapping, id?: string) {
        this.__input = new LevelEditorInput(ctx, mapping, id);
    }

    async init() {
        await this.__input.initInput();
    }

    get input() {
        return this.__input;
    }
}

export {
    LevelEditor
}