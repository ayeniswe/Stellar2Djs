import { selection } from '../Scene';

const usePanel = () => {
  function getObjectName() {
    if (selection.value?.name) {
      return selection.value.name;
    }
    return '';
  }

  return { getObjectName };
};

export { usePanel };
