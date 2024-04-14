import { selection } from '../Scene';

const usePanel = () => {
  function getObject() {
    if (selection.value) {
      const { posX, posY, width, height, layer, name, src, flipY, flipX } = selection.value;
      return {
        name,
        src,
        posX,
        posY,
        width,
        height,
        layer,
        flipX,
        flipY
      };
    }
    return {
      name: '',
      src: '',
      width: 0,
      height: 0,
      posX: 0,
      posY: 0,
      layer: 0,
      flipX: false,
      flipY: false
    };
  }

  function flipObject(x: boolean, y: boolean) {
    if (selection.value) {
      selection.value.flip(x, y);
      selection.value.render();
    }
  }
  return {
    getObject,
    flipObject
  };
};

export { usePanel };
