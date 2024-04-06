import { iconEffects } from '../../../libs/effects';
import { useAppContext } from '../../../context/appContext';

const useControls = () => {
  const { scene } = useAppContext();
  const {
    applyTrashEffect,
    applyDragEffect,
    applyEditingEffect,
    applyClippingEffect
  } = iconEffects();

  function showDeleteConfirmation(): void {
        scene!.attrs.input.safety = false;
        setTimeout(() => {
          scene.attrs.input.safety = true;
        }, 3000);
  }

  function clearCanvas(): void {
    scene.clear();
    scene.attrs.input.safety = true;
  }

  function toggleTrashMode(button: HTMLButtonElement) {
    if (!scene.attrs.input.trash) {
      scene.attrs.input.trash = true;
      applyTrashEffect(button);
    }
    else {
      scene.attrs.input.trash = false;
      applyTrashEffect(button, false);
    }
  }

  function toggleEditingMode(button: HTMLButtonElement) {
    if (!scene.attrs.input.editable) {
      scene.attrs.input.editable = true;
      applyEditingEffect(button);
    }
    else {
      scene.attrs.input.editable = false;
      applyEditingEffect(button, false);
    }
  }

  function toggleClippingMode(button: HTMLButtonElement) {
    if (!scene.attrs.input.clip) {
      scene.attrs.input.clip = true;
      applyClippingEffect(button);
    }
    else {
      scene.attrs.input.clip = false;
      applyClippingEffect(button, false);
    }
  }

  function toggleDragMode(button: HTMLButtonElement) {
    if (!scene.attrs.input.drag) {
      scene.attrs.input.drag = true;
      applyDragEffect(button);
    }
    else {
      scene.attrs.input.drag = false;
      applyDragEffect(button, false);
    }
  }

  return {
    toggleTrashMode,
    toggleEditingMode,
    toggleClippingMode,
    toggleDragMode,
    showDeleteConfirmation,
    clearCanvas,
  };
};

export { useControls };
