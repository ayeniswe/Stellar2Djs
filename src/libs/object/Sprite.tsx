import { Signal, signal } from '@preact/signals-react';
import { TextureObject } from './TextureObject';

class Sprite extends TextureObject {
  readonly name: string;
  readonly scene: CanvasRenderingContext2D;
  readonly texture: CanvasRenderingContext2D;
  readonly frame: HTMLImageElement;
  _flipX : Signal<boolean>;
  _flipY : Signal<boolean>;
  _layer: Signal<number>;
  _posX: Signal<number>;
  _posY: Signal<number>;
  _width: Signal<number>;
  _height: Signal<number>;

  constructor(ctx: CanvasRenderingContext2D, src: string, name: string,
    x: number, y: number, w: number, h: number, l: number) {
    super();
    this._flipX = signal(false);
    this._flipY = signal(false);
    this._posX = signal(x);
    this._posY = signal(y);
    this._width = signal(w);
    this._height = signal(h);
    this._layer = signal(l);
    this.scene = ctx;
    this.name = name;
    this.frame = new Image();
    this.frame.src = src;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    this.texture = canvas.getContext('2d')!;
    this.save();
  }

  protected save = () => {
    this.texture.drawImage(this.frame, 0, 0);
  };

  render = () => {
    this.scene.drawImage(this.texture.canvas, 0, 0,
      this.texture.canvas.width, this.texture.canvas.height, this.posX, this.posY,
      this.width, this.height);
  };
}
export { Sprite };
