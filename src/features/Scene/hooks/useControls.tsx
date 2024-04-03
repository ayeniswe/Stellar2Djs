import { useAppContext } from '../../../context/appContext';
import { iconEffects } from '../../../libs/effects';
const useControls = () => {
    const { scene } = useAppContext();
    const {
        applyTrashEffect,
        applyDragEffect,
        applyEditingEffect,
        applyClippingEffect
    } = iconEffects();
    const showDeleteConfirmation = (): void => {
        scene!.attrs.input.safety = false;
        setTimeout(() => {
            scene.attrs.input.safety = true;
        }, 3000);
    }
    const clearCanvas = (): void => {
        scene.clear();
        scene.attrs.input.safety = true;
    }
    const toggleTrashMode = (button: HTMLButtonElement) => {
        if (!scene.attrs.input.trash) {
            scene.attrs.input.trash = true
            applyTrashEffect(button);
        } else {
            scene.attrs.input.trash = false
            applyTrashEffect(button, false);
        }
    }
    const toggleEditingMode = (button: HTMLButtonElement) => {
        if (!scene.attrs.input.editable) {
            scene.attrs.input.editable = true
            applyEditingEffect(button);
        } else {
            scene.attrs.input.editable = false
            applyEditingEffect(button, false);
        }
    }
    const toggleClippingMode = (button: HTMLButtonElement) => {
        if (!scene.attrs.input.clip) {
            scene.attrs.input.clip = true;
            applyClippingEffect(button);
        } else {
            scene.attrs.input.clip = false
            applyClippingEffect(button, false);
        }
    }
    const toggleDragMode = (button: HTMLButtonElement) => {
        if (!scene.attrs.input.drag) {
            scene.attrs.input.drag = true
            applyDragEffect(button);
        } else {
            scene.attrs.input.drag = false
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
    }
}
export {
    useControls
}