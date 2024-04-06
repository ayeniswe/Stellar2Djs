const getLeft = (element: HTMLElement, isComputed = true) => {
  let value: string;
  if (isComputed) {
    value = window.getComputedStyle(element).getPropertyValue('left');
  }
  else {
    value = element.style.left;
  }
  const toNumber = () => Number(value.replace('px', ''));
  return {
    value,
    toNumber
  };
};
const getHeight = (element: HTMLElement, isComputed = true) => {
  let height: string;
  if (isComputed) {
    height = window.getComputedStyle(element).getPropertyValue('height');
  }
  else {
    height = element.style.width;
  }
  const toNumber = () => Number(height.replace('px', ''));
  return {
    height,
    toNumber
  };
};
const getWidth = (element: HTMLElement, isComputed = true) => {
  let currentWidth: string;
  if (isComputed) {
    currentWidth = window.getComputedStyle(element).getPropertyValue('width');
  }
  else {
    const { width } = element.style;
    currentWidth = width;
  }
  const toNumber = () => Number(currentWidth.replace('px', ''));
  return {
    currentWidth,
    toNumber
  };
};
const setLeft = (element: HTMLElement, value: any) => {
  element.style.left = `${value}px`;
};
const setOpacity = (element: HTMLElement, value: number) => {
  element.style.opacity = `${value}`;
};
export {
  getWidth,
  getHeight,
  getLeft,
  setLeft,
  setOpacity
};
