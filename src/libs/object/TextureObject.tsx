/**
 * A base class for all game objects.
 */
abstract class TextureObject {
    protected abstract frame: HTMLImageElement;
    protected abstract texture: CanvasRenderingContext2D;
    abstract ctx: CanvasRenderingContext2D;
    abstract name: string;
    abstract dx: number;
    abstract dy: number;
    abstract w: number;
    abstract h: number;
    abstract l: number;
    abstract flipXY : [boolean, boolean]; // [flipX, flipY]
    protected abstract save: () => void;
    abstract render: () => void;

    get image() {
      return this.texture.canvas.toDataURL();
    }

    get canvas() {
      return this.texture.canvas;
    }

    scale = (factor: number) => {
      this.ctx.imageSmoothingEnabled = false;
      this.ctx.drawImage(this.texture.canvas, 0, 0,
        this.texture.canvas.width, this.texture.canvas.height, this.dx, this.dy,
        this.texture.canvas.width * factor, this.texture.canvas.height * factor);
      this.ctx.imageSmoothingEnabled = true;
    };

    flip = (horizontal: boolean, vertical: boolean) => {
      switch (true) {
      case horizontal && vertical:
        this.texture.translate(this.w, this.h);
        this.texture.scale(-1, -1);
        this.flipXY = [true, true];
        break;
      case !horizontal && !vertical:
        this.texture.translate(0, 0);
        this.texture.scale(1, 1);
        this.flipXY = [false, false];
        break;
      case horizontal:
        this.texture.translate(this.w, 0);
        this.texture.scale(-1, 1);
        this.flipXY = [true, false];
        break;
      case vertical:
        this.texture.translate(0, this.h);
        this.texture.scale(1, -1);
        this.flipXY = [false, true];
        break;
      default:
        break;
      }
      this.save();
    };
}
export { TextureObject };
