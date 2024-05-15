import { clipX, clipY, inBoundsX, inBoundsY } from '../placement';

describe('clipping x-axis', () => {
  test('clipping the x-axis should move to the nearest multiple', () => {
    expect(clipX(32, 609)).toBe(608);
    expect(clipX(32, 613)).toBe(608);
    expect(clipX(32, 633)).toBe(640);
    expect(clipX(32, 639)).toBe(640);
  });
  test('clipping the x-axis with a zero-width should return the x-coordinate given', () => {
    expect(clipX(0, 1223)).toBe(1223);
  });
  test('clipping the x-axis with negative should produce same result as postive', () => {
    expect(clipY(-11, 183)).toBe(176);
  });
});

describe('clipping y-axis', () => {
  test('clipping the y-axis should move to the nearest multiple', () => {
    expect(clipY(17, 222)).toBe(221);
    expect(clipY(17, 228)).toBe(221);
    expect(clipY(17, 235)).toBe(238);
    expect(clipY(17, 237)).toBe(238);
  });
  test('clipping the y-axis with a zero-width should return the y-coordinate given', () => {
    expect(clipY(0, 189)).toBe(189);
  });
  test('clipping the y-axis with negative should produce same result as postive', () => {
    expect(clipY(-18, 189)).toBe(180);
  });
});

describe('boundary checks x-axis', () => {
  test('returns xCoordinate if within bounds', () => {
    const result = inBoundsX(100, 20, 30);
    expect(result).toBe(30);
  });

  test('returns 0 if xCoordinate is less than 0', () => {
    const result = inBoundsX(100, 20, -5);
    expect(result).toBe(0);
  });

  test('returns canvasWidth - width if xCoordinate is greater than canvasWidth - width', () => {
    const result = inBoundsX(100, 20, 90);
    expect(result).toBe(80);
  });
});

describe('boundary checks y-axis', () => {
  test('returns yCoordinate if within bounds', () => {
    const result = inBoundsY(100, 20, 30);
    expect(result).toBe(30);
  });

  test('returns 0 if yCoordinate is less than 0', () => {
    const result = inBoundsY(100, 20, -5);
    expect(result).toBe(0);
  });

  test('returns canvasHeight - height if yCoordinate is greater than canvasHeight - height', () => {
    const result = inBoundsY(100, 20, 90);
    expect(result).toBe(80);
  });
});
