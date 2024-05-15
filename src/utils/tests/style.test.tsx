import { getHeight, getLeft, getWidth, setLeft, setOpacity } from '../styleProps';

// Mock HTMLElement
const mockElement = document.createElement('div');

describe('getLeft', () => {
  test('returns the left value of an element (computed)', () => {
    mockElement.style.left = '10px';
    expect(getLeft(mockElement).toNumber()).toBe(10);
  });
  test('returns the left value of an element', () => {
    mockElement.style.left = '20px';
    expect(getLeft(mockElement, true).toNumber()).toBe(20);
  });
});

describe('getHeight', () => {
  test('returns the height of an element (computed)', () => {
    mockElement.style.height = '20px';
    expect(getHeight(mockElement).toNumber()).toBe(20);
  });
  test('returns the height of an element', () => {
    mockElement.style.height = '30px';
    expect(getHeight(mockElement, true).toNumber()).toBe(30);
  });
});

describe('getWidth', () => {
  test('returns the width of an element (computed)', () => {
    mockElement.style.width = '30px';
    expect(getWidth(mockElement).toNumber()).toBe(30);
  });
  test('returns the width of an element', () => {
    mockElement.style.width = '40px';
    expect(getWidth(mockElement, true).toNumber()).toBe(40);
  });
});

describe('setLeft', () => {
  test('sets the left value of an element', () => {
    setLeft(mockElement, 40);
    expect(mockElement.style.left).toBe('40px');
  });
});

describe('setOpacity', () => {
  test('sets the opacity value of an element', () => {
    setOpacity(mockElement, 0.5);
    expect(mockElement.style.opacity).toBe('0.5');
  });
});
