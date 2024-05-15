const inBoundsY = (canvasHeight: number, height: number, yCoordinate: number) => (yCoordinate >= canvasHeight - height
  ? canvasHeight - height
  : yCoordinate < 0
    ? 0
    : yCoordinate
);

const inBoundsX = (canvasWidth: number, width: number, xCoordinate: number) => (xCoordinate >= canvasWidth - width
  ? canvasWidth - width
  : xCoordinate < 0
    ? 0
    : xCoordinate
);

const closestUnit = (value: number, scale: number) => Math.min(Math.abs(scale - value), value);

const clipX = (width: number, xCoordinate: number) => {
  if (width !== 0) {
    return (xCoordinate - closestUnit(xCoordinate % width, width)) % width === 0
      ? xCoordinate - closestUnit(xCoordinate % width, width)
      : closestUnit(xCoordinate % width, width) + xCoordinate;
  }
  return xCoordinate;
};

const clipY = (height: number, yCoordinate: number) => {
  if (height !== 0) {
    return (yCoordinate - closestUnit(yCoordinate % height, height)) % height === 0
      ? yCoordinate - closestUnit(yCoordinate % height, height)
      : closestUnit(yCoordinate % height, height) + yCoordinate;
  }
  return yCoordinate;
};

export {
  clipX,
  clipY,
  inBoundsX,
  inBoundsY
};
