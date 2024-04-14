import { Config, RevisionRecord, TextureObjectBounds, TextureSources } from './types';
import { getHeight, getWidth } from '../../utils/styleProps';
import { Signal, useSignal } from '@preact/signals-react';
import { Sprite, Tile } from '../object';
import RBush from 'rbush';
import { SCENE } from '../../features/Scene';
import { TextureObject } from '../object/TextureObject';

const useTexture = (ctx: CanvasRenderingContext2D) => {
  const tree = new RBush<TextureObjectBounds>();
  const revisions = useSignal<RevisionRecord[]>([]);
  const sources = useSignal<TextureSources>({});
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
   * @param {number} w The width.
   * @param {number} h The height.
   * @param {boolean} clipping - Whether clipping is enabled or not.
   * @return {number[]} The scaled coordinates.
   */
  function scaling(x: number, y: number, w: number, h: number, clipping: boolean): number[] {
    const inBoundsY = (height: number, yCoordinate: number) => (yCoordinate >= ctx.canvas.height - height
      ? ctx.canvas.height - height
      : yCoordinate < 0
        ? 0
        : yCoordinate
    );
    const inBoundsX = (width: number, xCoordinate: number) => (xCoordinate >= ctx.canvas.width - width
      ? ctx.canvas.width - width
      : xCoordinate < 0
        ? 0
        : xCoordinate
    );
    const closestUnit = (value: number, scale: number) => Math.min(Math.abs(scale - value), value);
    const clipX = (width: number, xCoordinate: number) => ((xCoordinate - closestUnit(xCoordinate % width, width))
      % width === 0
      ? xCoordinate - closestUnit(xCoordinate % width, width)
      : closestUnit(xCoordinate % width, width) + xCoordinate
    );
    const clipY = (height: number, yCoordinate: number) => ((yCoordinate - closestUnit(yCoordinate % height, height))
      % height === 0
      ? yCoordinate - closestUnit(yCoordinate % height, height)
      : closestUnit(yCoordinate % height, height) + yCoordinate
    );
    let clippedX, clippedY;
    if (clipping) {
      clippedX = clipX(w, inBoundsX(w, x));
      clippedY = clipY(h, inBoundsY(h, y));
      const result = tree.search({
        minX: clippedX,
        minY: clippedY,
        maxX: clippedX,
        maxY: clippedY
      });
      if (result.length !== 0 && x < clippedX) clippedX = inBoundsX(w, clippedX - w);
      if (result.length !== 0 && y < clippedY) clippedY = inBoundsY(w, clippedY - h);
    }
    else {
      clippedX = inBoundsX(w, x);
      clippedY = inBoundsY(h, y);
    }
    return [clippedX, clippedY];
  }

  /**
   * Clears any part of the canvas.
   *
   * @param {number} x - The x-coordinate of the top-left corner of the area.
   * @param {number} y - The y-coordinate of the top-left corner of the area.
   * @param {number} w - The width of the area.
   * @param {number} h - The height of the area.
   */
  function clearCanvas(x: number, y: number, w: number, h: number) {
    ctx.clearRect(x, y, w, h);
  }

  function updateTexture(texture: TextureObject) {
    // Remove old texture bounding
    const { posX, posY, width, height } = texture;
    tree.remove({
      minX: posX,
      maxX: posX,
      minY: posY,
      maxY: posY,
      object: texture
    }, (a, b) => a.object===b.object);
    // Clear undo stack to keep a coupled order
    revisions.value = revisions.value.filter((obj) => obj.texture !== texture);
    clearCanvas(posX, posY, width, height);
    // Insert new bounding with changed object
    tree.insert({
      minX: posX,
      maxX: posX + width,
      minY: posY,
      maxY: posY + height,
      object: texture
    });
    // Store action in history
    revisions.value.push({
      texture,
      action: 'added'
    });
  }

  function addTexture(src: string, name: string, clipping: boolean,
    x: number, y: number, w: number, h: number, sx = 0, sy = 0, l = 1): number[] {
    const [scaledX, scaledY] = scaling(x, y, w, h, clipping);
    const result = tree.search({
      minX: x,
      minY: y,
      maxX: x,
      maxY: y
    });
    // Update layer when on top of an object
    for (const bound of result) {
      l = Math.max(l, bound.object.layer) + 1;
    }
    let texture;
    if (sx !== 0 || sy !== 0) {
      const preloadTexture = sources.value[src];
      texture = new Tile(ctx, preloadTexture, name, scaledX, scaledY, w, h, sx, sy, l);
    }
    else {
      texture = new Sprite(ctx, src, name, scaledX, scaledY, w, h, l);
    }
    tree.insert({
      minX: scaledX,
      maxX: scaledX + w,
      minY: scaledY,
      maxY: scaledY + h,
      object: texture
    });
    // Store action in history
    revisions.value.push({
      texture,
      action: 'added'
    });
    return [scaledX, scaledY];
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
      if (Math.max(texture.layer, bound.object.layer) === bound.object!.layer) texture = bound.object;
    }
    if (!texture) return [];
    const { posX, posY, width, height } = texture;
    tree.remove({
      minX: posX,
      maxX: posX,
      minY: posY,
      maxY: posY,
      object: texture
    }, (a, b) => a.object===b.object);
    // Clear undo stack to keep a coupled order
    revisions.value = revisions.value.filter((obj) => obj.texture !== texture);
    clearCanvas(posX, posY, width, height);
  }

  function undoRevision() {
    const action = revisions.value.pop();
    if (action) {
      const { posX, posY, width, height } = action.texture;
      switch (action.action) {
      case 'added':
        tree.remove({
          minX: posX,
          maxX: posX + width,
          minY: posY,
          maxY: posY + height,
          object: action.texture
        }, (a, b) => a.object===b.object);
        clearCanvas(posX, posY, width, height);
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

  function selectTexture(x: number, y: number, selector: Signal<TextureObject | undefined>) {
    // Check if texture exists in bounding
    const result = tree.search({
      minX: x,
      minY: y,
      maxX: x,
      maxY: y
    });
    if (result.length === 0) {
      selector.value = undefined;
    }
    else {
      selector.value = result[0].object;
      for (const bound of result) {
        if (Math.max(selector.value.layer, bound.object.layer) === bound.object!.layer) selector.value = bound.object;
      }
    }
  }

  function moveTexture(x: number, y: number, selector: Signal<TextureObject | undefined>) {
    const texture = selector.value;
    if (!texture) return;
    document.getElementById(SCENE.CANVAS)!.style.cursor = 'move';
    // Remove old bounding and position
    const { width, height, posX, posY } = selector.value!;
    tree.remove({
      minX: posX,
      maxX: posX + width,
      minY: posY,
      maxY: posY + height,
      object: texture
    }, (a, b) => a.object===b.object);
    clearCanvas(posX, posY, width, height);
    // Add new bounding and position
    texture.posX = x;
    texture.posY = y;
    texture.render();
    document.onmouseup = () => {
      // Reset canvas cursor
      document.onmouseup = null;
      document.getElementById(SCENE.CANVAS)!.style.cursor = 'pointer';
      tree.insert({
        minX: x,
        maxX: x + width,
        minY: y,
        maxY: y + height,
        object: texture
      });
      selector.value = undefined;
    };
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
    updateTexture,
    moveTexture,
    undoRevision,
    render,
    removeAllTexture,
    textureRenderer
  };
};

export { useTexture };
