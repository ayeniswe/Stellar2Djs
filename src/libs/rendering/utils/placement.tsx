function inBoundsY(windowHeight: number, height: number, yCoordinate: number) {
  return (yCoordinate >= windowHeight - height
    ? windowHeight - height
    : yCoordinate < 0
      ? 0
      : yCoordinate
  );
}

function inBoundsX(windowWidth: number, width: number, xCoordinate: number) {
  return (xCoordinate >= windowWidth - width
    ? windowWidth - width
    : xCoordinate < 0
      ? 0
      : xCoordinate
  );
}

function closestUnit(value: number, scale: number) {
  return Math.min(Math.abs(scale - value), value);
}

function clipX(width: number, xCoordinate: number) {
  if (width !== 0) {
    return (xCoordinate - closestUnit(xCoordinate % width, width)) % width === 0
      ? xCoordinate - closestUnit(xCoordinate % width, width)
      : closestUnit(xCoordinate % width, width) + xCoordinate;
  }
  return xCoordinate;
}

function clipY(height: number, yCoordinate: number) {
  if (height !== 0) {
    return (yCoordinate - closestUnit(yCoordinate % height, height)) % height === 0
      ? yCoordinate - closestUnit(yCoordinate % height, height)
      : closestUnit(yCoordinate % height, height) + yCoordinate;
  }
  return yCoordinate;
}

function inBounds(windowHeight:number, windowWidth: number, x: number, y: number, w: number, h: number) {
  return [inBoundsX(windowWidth, w, x), inBoundsY(windowHeight, h, y)];
}

function clip(windowHeight:number, windowWidth: number, x: number, y: number,
  w: number, h: number): number[] {
  return [clipX(w, inBoundsX(windowWidth, w, x)), clipY(h, inBoundsY(windowHeight, h, y))];
}

export {
  clipX,
  clipY,
  clip,
  inBoundsX,
  inBoundsY,
  inBounds
};
