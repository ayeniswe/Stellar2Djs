/**
 * A base class for all game objects.
 */
abstract class TextureObject {
    abstract readonly ctx: CanvasRenderingContext2D;
    abstract readonly texture: CanvasRenderingContext2D;
    abstract readonly name: string;
    abstract dx: number;
    abstract dy: number;
    abstract w: number;
    abstract h: number;
    abstract l: number;
    abstract _scale: [boolean, boolean];
    protected abstract save: () => void;
    abstract render: () => void;
    flip = (horizontal: boolean, vertical: boolean) => {
        switch (true) {
            case horizontal && vertical:
                this.texture.translate(this.w, this.h);
                this.texture.scale(-1, -1);
                this._scale = [true, true];
                break;
            case !horizontal && !vertical:
                this.texture.translate(0, 0);
                this.texture.scale(1, 1);
                this._scale = [false, false];
                break;
            case horizontal:
                this.texture.translate(this.w, 0);
                this.texture.scale(-1, 1);
                this._scale = [true, false];
                break;
            case vertical:
                this.texture.translate(0, this.h);
                this.texture.scale(1, -1);
                this._scale = [false, true];
                break;
            default:
                break;
        }
        this.save();
    };
}
export {
    TextureObject
}