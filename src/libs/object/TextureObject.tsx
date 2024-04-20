import { clearArc } from '../rendering/canvas';
import { Signal } from '@preact/signals-react';

/**
 * A base class for all game objects.
 */
abstract class TextureObject {
    protected abstract frame: HTMLImageElement;
    protected abstract texture: CanvasRenderingContext2D;
    abstract scene: CanvasRenderingContext2D;
    abstract name: string;
    protected abstract _posX: Signal<number>;
    protected abstract _posY: Signal<number>;
    protected abstract _width: Signal<number>;
    protected abstract _height: Signal<number>;
    protected abstract _angle: Signal<number>;
    protected abstract _layer: Signal<number>;
    protected abstract _flipX : Signal<boolean>;
    protected abstract _flipY : Signal<boolean>;

    get src() {
      return this.texture.canvas.toDataURL();
    }

    get layer() {
      return this._layer.value;
    }
    set layer(val) {
      this._layer.value = val;
    }

    get flipX() {
      return this._flipX.value;
    }
    set flipX(val) {
      this._flipX.value = val;
    }

    get flipY() {
      return this._flipY.value;
    }
    set flipY(val) {
      this._flipY.value = val;
    }

    get posX() {
      return this._posX.value;
    }
    set posX(val) {
      this._posX.value = val;
    }

    get posY() {
      return this._posY.value;
    }
    set posY(val) {
      this._posY.value = val;
    }

    get width() {
      return this._width.value;
    }
    set width(val) {
      this._width.value = val;
    }

    get height() {
      return this._height.value;
    }
    set height(val) {
      this._height.value = val;
    }

    get angle() {
      return this._angle.value;
    }
    set angle(val) {
      this._angle.value = val;
    }

    protected abstract save: () => void;
    abstract render: () => void;

    protected rotate = () => {
      clearArc(this.scene, this);
      this.scene.save();
      this.scene.translate(this.posX + this.width / 2, this.posY + this.height / 2);
      this.scene.rotate(this.angle * (Math.PI / 180));
    };

    scaleX = (factor: number, inverse: boolean = false) => {
      this.scene.clearRect(this.posX, this.posY, this.width, this.height);
      this.posX = inverse
        ? this.posX + this.width - factor
        : this.posX;
      this.width = factor;
    };

    scaleY = (factor: number, inverse: boolean = false) => {
      this.scene.clearRect(this.posX, this.posY, this.width, this.height);
      this.posY = inverse
        ? this.posY + this.height - factor
        : this.posY;
      this.height = factor;
    };

    flip = (x: boolean, y: boolean) => {
      switch (true) {
      case x:
        this.texture.translate(this.texture.canvas.width, 0);
        this.texture.scale(-1, 1);
        this.flipX = !this.flipX;
        break;
      case y:
        this.texture.translate(0, this.texture.canvas.height);
        this.texture.scale(1, -1);
        this.flipY = !this.flipY;
        break;
      default:
        break;
      }
      this.save();
    };
}

export { TextureObject };
