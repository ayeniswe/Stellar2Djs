import { KMMapping, LevelEditorInput } from "../libs/input";

class LevelEditor {
    private __i: LevelEditorInput;

    constructor(ctx: CanvasRenderingContext2D, mapping: KMMapping, id?: string) {
        this.__i = new LevelEditorInput(ctx, mapping, id);
    }

    async init() {
        await this.__i.initInput();
    }

}

export {
    LevelEditor
}