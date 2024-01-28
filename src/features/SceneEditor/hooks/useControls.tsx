import { UIEffects } from '../../../libs/effects';
import { Scene } from './type';
/**
 * A hook that applies the necessary effects to each control functions for the Scene.
 */
const useControls = (scene: Scene) => {
    const { 
        applyTrashEffect, 
        applyDragEffect, 
        applyEditingEffect, 
        applyClippingEffect 
    } = UIEffects();
    /**
     * Shows a delete confirmation in the scene.
     * This function temporarily disables the safety flag, indicating that it is safe to perform a delete operation.
     * After a 3-second delay, the safety flag is reset to true, indicating that it is safe to proceed with other actions.
     * This confirmation mechanism is typically used to prompt the user for confirmation before deleting an element.
     * Note: The safety flag is used to prevent accidental or unintended deletions.
     */
    const showDeleteConfirmation = (): void => {
        scene.attrs.input.safety = false;
        setTimeout(() => {
            scene.attrs.input.safety = true;
        }, 3000);
    }
    /**
     * Clears the canvas.
     * This function removes all drawn elements from the canvas and sets the safety flag to true.
     * Removing the input elements effectively clears the canvas of any existing content.
     * The safety flag being set to true indicates that it is safe to proceed with other actions.
     * Note: The safety flag is used to prevent accidental or unintended actions.
     */
    const clearCanvas = (): void => {
        scene.clear();
        scene.attrs.input.safety = true;
    }
    // *****************************************
    //             TOGGLE SECTION
    // *****************************************
    // Toggles the different modes in the editor.
    // If the mode is currently disabled, enables
    // it and applies the the css styling effect.
    // If the mode is currently enabled, disables
    // it and removes the the css styling effect.
    // *****************************************
    const toggleTrashMode = () => {
        if (!scene.attrs.input.trash) {
            scene.attrs.input.trash = true
            applyTrashEffect();
        } else {
            scene.attrs.input.trash = false
            applyTrashEffect(false);
        }
    }
    const toggleEditingMode = () => {
        if (scene.attrs.input.editable) {
            scene.attrs.input.editable = false
            applyEditingEffect();
        } else {
            scene.attrs.input.editable = true
            applyEditingEffect(false);
        }
    }
    const toggleClippingMode = () => {
        if (!scene.attrs.input.clip) {
            scene.attrs.input.clip = true;
            applyClippingEffect();
        } else {
            scene.attrs.input.clip = false
            applyClippingEffect(false);
        }
    }
    const toggleDragMode = () => {
        if (!scene.attrs.input.drag) {
            scene.attrs.input.drag = true
            applyDragEffect();
        } else {
            scene.attrs.input.drag = false
            applyDragEffect(false);
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