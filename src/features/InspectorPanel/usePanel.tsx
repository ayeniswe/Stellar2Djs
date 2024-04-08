import { selection } from '../Scene';

const usePanel = () => {
  function getObject() {
    return {
      name: selection.value
        ? selection.value.name
        : '',
      src: selection.value
        ? selection.value.image
        : ''
    };
  }

  return { getObject };
};

export { usePanel };
