import { Signal, signal } from '@preact/signals-react';
import { TextureObject } from './TextureObject';

class Tile extends TextureObject {
  readonly name: string;
  readonly scene: CanvasRenderingContext2D;
  readonly texture: CanvasRenderingContext2D;
  readonly frame: HTMLImageElement;
  readonly #sx: number;
  readonly #sy: number;
  readonly #originalW: number;
  readonly #originalH: number;
  _angle: Signal<number>;
  _flipX : Signal<boolean>;
  _flipY : Signal<boolean>;
  _layer: Signal<number>;
  _posX: Signal<number>;
  _posY: Signal<number>;
  _width: Signal<number>;
  _height: Signal<number>;

  constructor(ctx: CanvasRenderingContext2D, frame: HTMLImageElement,
    name: string, x: number, y: number, w: number, h: number, sx: number, sy: number, l: number) {
    super();
    this._flipX = signal(false);
    this._flipY = signal(false);
    this._posX = signal(x);
    this._posY = signal(y);
    this._width = signal(w);
    this._height = signal(h);
    this._layer = signal(l);
    this._angle = signal(0);
    this.scene = ctx;
    this.name = name;
    this.#sx = sx;
    this.#sy = sy;
    this.#originalW = w;
    this.#originalH = h;
    this.frame = frame;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    this.texture = canvas.getContext('2d')!;
    this.texture.drawImage(
      this.frame,
      this.#sx,
      this.#sy,
      this.#originalW,
      this.#originalH,
      0,
      0,
      this.#originalW,
      this.#originalH
    );
  }

  render = () => {
    this.scene.save();
    if (this.angle !== 0) {
      this.scene.translate(this.posX + this.width / 2, this.posY + this.height / 2);
      this.scene.rotate(this.angle * (Math.PI / 180));
      this.scene.scale(this.flipX
        ? -1
        : 1, this.flipY
        ? -1
        : 1);
      this.scene.drawImage(this.texture.canvas, 0, 0, this.texture.canvas.width,
        this.texture.canvas.height, -this.width / 2, -this.height / 2, this.width, this.height);
    }
    else {
      const { flipX, flipY } = this;
      if (flipX || flipY) {
        this.scene.translate(this.posX, this.posY);
        this.scene.scale(flipX
          ? -1
          : 1, flipY
          ? -1
          : 1);
        this.scene.drawImage(this.texture.canvas, 0, 0,
          this.texture.canvas.width, this.texture.canvas.height, flipX
            ? -this.width
            : 0, flipY
            ? -this.height
            : 0, this.width, this.height);
      }
      this.scene.drawImage(this.texture.canvas, 0, 0,
        this.texture.canvas.width, this.texture.canvas.height, this.posX, this.posY, this.width, this.height);
    }
    this.scene.restore();
  };
}

export { Tile };
