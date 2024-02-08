import { TextureObject } from "./TextureObject";
class Sprite extends TextureObject {
    readonly name: string;
    readonly ctx: CanvasRenderingContext2D;
    readonly texture: CanvasRenderingContext2D;
    readonly #frame: HTMLImageElement;
    _scale: [boolean, boolean] = [false, false];
    dx: number;
    dy: number;
    w: number;
    h: number;
    constructor(ctx: CanvasRenderingContext2D, src: string, name: string, dx: number, dy: number, w: number, h: number) {
        super();
        this.ctx = ctx;
        this.name = name;
        this.dx = dx;
        this.dy = dy;
        this.w = w;
        this.h = h;
        // Create sprite texture
        this.#frame = new Image();
        this.#frame.src = src;
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        this.texture = canvas.getContext("2d")!;
        this.save();
    }    
    protected save = () => {
        this.texture.drawImage(this.#frame, 0, 0);
    }
    render = () => {
        this.ctx.drawImage(
            this.texture.canvas,
            this.dx,
            this.dy
        );
    };
} 
export {
    Sprite
}