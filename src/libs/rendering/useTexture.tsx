import { Config, RevisionRecord, TextureObjectBounds, TextureSources } from './types';
import { getHeight, getWidth } from '../../utils/styleProps';
import { Sprite, Tile } from '../object';
import RBush from 'rbush';
import { SCENE } from '../../features/Scene';
import { TextureObject } from '../object/TextureObject';
import { useSignal } from '@preact/signals-react';

const useTexture = (ctx: CanvasRenderingContext2D) => {
  const tree = new RBush<TextureObjectBounds>();
  const revisions = useSignal<RevisionRecord[]>([]);
  const sources = useSignal<TextureSources>({});
  const selector = useSignal<TextureObject | undefined>(undefined);
  const CONFIG: Config = process.env.NODE_ENV === 'production'
    ? require('../../data/config.json')
    : require('../../data/test-config.json');
  const textureRenderer = {
    get textureSources() {
      return sources.value;
    },
    get ctx() {
      return ctx;
    }
  };

  /**
   * Initializes the renderer.
   */
  async function initialize() {
    await addAllSources();
    startListeners();
  }

  /**
   * Adds all texture sources to the canvas.
   *
   * @description
   * This method iterates over each textures type and texture
   * within the textures type
   * For each texture, it retrieves the name and src
   * (where file is found relative to the path).
   * It adds an entry to the textures sources
   *
   * NOTE: All textures should be loaded before dealing with application
   *
   * @todo Allow application use while loading in background using web workers
   */
  async function addAllSources(): Promise<void> {
    for (const key in CONFIG.textures) {
      if (Object.hasOwn(CONFIG.textures, key)) {
        const total = Object.keys(CONFIG.textures[key]).length;
        for (let index = 1; index <= total; index++) {
          const texture = CONFIG.textures[key][index];
          const { name } = texture;
          const path = `assets/textures/${texture.src}`;
          sources.value = {
            ...sources.value,
            [name]: new Image(),
          };
          try {
            const url: string = (await import(`../../${path}`)).default;
            sources.value[name].src = url;
            sources.value[name].onload = () => {
              console.log(`Loaded "${name}" texture - ${index} of ${total}`);
            };
          }
          catch {
            console.error(`Failed to load "${name}" texture from ${path}`);
          }
        }
      }
    }
  }

  /**
   * Scales the coordinates based on the canvas size
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   * @param {number} width The width.
   * @param {number} height The height.
   * @param {boolean} clipping - Whether clipping is enabled or not.
   * @return {number[]} The scaled coordinates.
   */
  function scaling(x: number, y: number, width: number, height: number, clipping: boolean): number[] {
    const inBoundsY = (h: number, yc: number) => (yc >= ctx.canvas.height - h
      ? ctx.canvas.height - h
      : yc < 0
        ? 0
        : yc
    );
    const inBoundsX = (w: number, xc: number) => (xc >= ctx.canvas.width - w
      ? ctx.canvas.width - w
      : xc < 0
        ? 0
        : xc
    );
    const closestUnit = (val: number, scale: number) => Math.min(Math.abs(scale - val), val);
    const clipX = (w: number, xc: number) => ((xc - closestUnit(xc % w, w)) % w === 0
      ? xc - closestUnit(xc % w, w)
      : closestUnit(xc % w, w) + xc
    );
    const clipY = (h: number, yc: number) => ((yc - closestUnit(yc % h, h)) % h === 0
      ? yc - closestUnit(yc % h, h)
      : closestUnit(yc % h, h) + yc
    );
    let dx, dy;
    if (clipping) {
      dx = clipX(width, inBoundsX(width, x));
      dy = clipY(height, inBoundsY(height, y));
      const result = tree.search({
        minX: dx,
        minY: dy,
        maxX: dx,
        maxY: dy
      });
      if (result.length !== 0 && x < dx) dx = inBoundsX(width, dx - width);
      if (result.length !== 0 && y < dy) dy = inBoundsY(width, dy - height);
    }
    else {
      dx = inBoundsX(width, x);
      dy = inBoundsY(height, y);
    }
    return [dx, dy];
  }

  /**
   * Clears any part of the canvas.
   *
   * @param {number} dx - The x-coordinate of the top-left corner of the area.
   * @param {number} dy - The y-coordinate of the top-left corner of the area.
   * @param {number} w - The width of the area.
   * @param {number} h - The height of the area.
   */
  function clearCanvas(dx: number, dy: number, w: number, h: number) {
    ctx.clearRect(dx, dy, w, h);
  }

  function addTexture(src: string, name: string, clipping: boolean,
    x: number, y: number, w: number, h: number, sx = 0, sy = 0, l = 1): number[] {
    const [dx, dy] = scaling(x, y, w, h, clipping);
    const result = tree.search({
      minX: x,
      minY: y,
      maxX: x,
      maxY: y
    });
    // Update layer when on top of an object
    for (const bound of result) {
      l = Math.max(l, bound.object.l) + 1;
    }
    let texture;
    if (sx !== 0 || sy !== 0) {
      const preloadTexture = sources.value[src];
      texture = new Tile(ctx, preloadTexture, name, dx, dy, w, h, sx, sy, l);
    }
    else {
      texture = new Sprite(ctx, src, name, dx, dy, w, h, l);
    }
    tree.insert({
      minX: dx,
      maxX: dx+w,
      minY: dy,
      maxY: dy+h,
      object: texture
    });
    // Store action in history
    revisions.value.push({
      texture,
      action: 'added'
    });
    return [dx, dy];
  }

  function removeTexture(x: number, y: number) {
    const result = tree.search({
      minX: x,
      minY: y,
      maxX: x,
      maxY: y
    });
    if (result.length === 0) return [];
    // Find topmost layer
    let texture = result[0].object;
    for (const bound of result) {
      if (Math.max(texture.l, bound.object.l) === bound.object!.l) texture = bound.object;
    }
    if (!texture) return [];
    const { dx, dy, w, h } = texture;
    tree.remove({
      minX: dx,
      maxX: dx,
      minY: dy,
      maxY: dy,
      object: texture
    }, (a, b) => a.object===b.object);
    // Clear undo stack to keep a coupled order
    revisions.value = revisions.value.filter((obj) => obj.texture !== texture);
    clearCanvas(dx, dy, w, h);
  }

  function undoRevision() {
    const action = revisions.value.pop();
    if (action) {
      const { dx, dy, w, h } = action.texture;
      switch (action.action) {
      case 'added':
        tree.remove({
          minX: dx,
          maxX: dx+w,
          minY: dy,
          maxY: dy+h,
          object: action.texture
        }, (a, b) => a.object===b.object);
        clearCanvas(dx, dy, w, h);
        break;
      default:
        break;
      }
    }
  }

  function render() {
    for (const bound of tree.all()) {
      bound.object.render();
    }
  }

  function removeAllTexture() {
    tree.clear();
    clearCanvas(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  function selectTexture(x: number, y: number) {
    if (!selector.value) {
      // Check if texture exists in bounding
      const result = tree.search({
        minX: x,
        minY: y,
        maxX: x,
        maxY: y
      });
      if (result.length === 0) return;
      selector.value = result[0].object;
      document.getElementById(SCENE.CANVAS)!.style.cursor = 'move';
    }
    else {
      const texture = selector.value;
      if (!texture) return;
      // Remove old bounding and position
      const { w, h, dx, dy } = texture;
      tree.remove({
        minX: dx,
        maxX: dx+w,
        minY: dy,
        maxY: dy+h,
        object: texture
      }, (a, b) => a.object===b.object);
      clearCanvas(dx, dy, w, h);
      // Add new bounding and position
      texture.dx = x;
      texture.dy = y;
      ctx.drawImage(texture.texture.canvas, x, y);
      document.onmouseup = () => {
        // Reset canvas cursor
        document.onmouseup = null;
        document.getElementById(SCENE.CANVAS)!.style.cursor = 'pointer';
        tree.insert({
          minX: x,
          maxX: x+w,
          minY: y,
          maxY: y+h,
          object: texture
        });
        selector.value = undefined;
      };
    }
  }

  function startListeners() {
    // Resizing application window
    window.addEventListener('resize', () => {
      ctx.canvas.width = getWidth(ctx.canvas).toNumber();
      ctx.canvas.height = getHeight(ctx.canvas).toNumber();
      render();
    });
  }

  return {
    initialize,
    addTexture,
    selectTexture,
    removeTexture,
    undoRevision,
    render,
    removeAllTexture,
    textureRenderer,
  };
};

export { useTexture };
