import { TextureObject } from '../object/TextureObject';

/**
 * Clears the arc formed by an object rotation
 *
 * @param {CanvasRenderingContext2D} ctx - The context to render on
 * @param {TextureObject} object - The object to erase
 */
function clearArc(ctx: CanvasRenderingContext2D, object: TextureObject) {
  ctx.save();
  ctx.arc(object.posX + object.width / 2, object.posY + object.height / 2,
    Math.sqrt(object.width * object.height / Math.PI) * 1.3, 0, 2 * Math.PI);
  ctx.clip();
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.restore();
}

export { clearArc };
