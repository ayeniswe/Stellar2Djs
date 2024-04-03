import { TextureObject } from "./TextureObject";
class Tile extends TextureObject {
    readonly name: string;
    readonly ctx: CanvasRenderingContext2D;
    readonly texture: CanvasRenderingContext2D;
    readonly #frame: HTMLImageElement | HTMLCanvasElement;
    readonly #sx: number;
    readonly #sy: number;
    _scale: [boolean, boolean] = [false, false];
    l: number = 1;
    dx: number;
    dy: number;
    w: number;
    h: number;
    constructor(ctx: CanvasRenderingContext2D, frame: HTMLImageElement | HTMLCanvasElement, name: string, dx: number, dy: number, w: number, h: number, sx: number, sy: number, l: number) {
        super();
        this.ctx = ctx;
        this.name = name;
        this.#sx = sx;
        this.#sy = sy;
        this.dx = dx;
        this.dy = dy;
        this.w = w;
        this.h = h;
        this.l = l;
        // Create tile texture
        this.#frame = frame;
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        this.texture = canvas.getContext("2d")!;
        this.save();
    }
    protected save = () => {
        this.texture.drawImage(
            this.#frame,
            this.#sx,
            this.#sy,
            this.w,
            this.h,
            0,
            0,
            this.w,
            this.h
        );
    }
    render = () => {
        this.ctx.drawImage(
            this.texture.canvas,
            this.dx,
            this.dy,
        );
    };
} 
export {
    Tile
}