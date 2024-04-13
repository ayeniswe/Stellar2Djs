import { selection } from '../Scene';

const usePanel = () => {
  function getObject() {
    if (selection.value) {
      const { dx, dy, w, h, l, name, image, flipXY } = selection.value;
      return {
        name,
        src: image,
        width: w,
        height: h,
        xPos: dx,
        yPos: dy,
        layer: l,
        flipX: flipXY[0],
        flipY: flipXY[1],
      };
    }
    return {
      name: '',
      src: '',
      width: 0,
      height: 0,
      xPos: 0,
      yPos: 0,
      layer: 0,
      flipX: false,
      flipY: false
    };
  }

  return { getObject };
};

export { usePanel };
