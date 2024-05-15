import { TextureObject } from '../../object/TextureObject';

/**
 * Clears the arc formed by an object rotation
 *
 * @param {CanvasRenderingContext2D} ctx - The context to render on
 * @param {TextureObject} object - The object to erase
 */
function clearArc(ctx: CanvasRenderingContext2D, object: TextureObject) {
  const centerX = object.posX + object.width / 2;
  const centerY = object.posY + object.height / 2;
  const radius = Math.sqrt(object.width * object.height / Math.PI) * 1.3;
  ctx.clearRect(centerX - radius - 1, centerY - radius - 1, radius * 2 + 2, radius * 2 + 2);
}

export { clearArc };
