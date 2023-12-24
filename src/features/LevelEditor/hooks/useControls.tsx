import { LevelEditor } from '../../../main/LevelEditor';
import { LevelEditorEffects } from '../../../libs/effects/effects';

/**
 * A hook that applies the necessary effects to each control functions for the LevelEditor.
 */
const useControls = (editor: LevelEditor) => {
    /**
     * Shows a delete confirmation in the editor.
     * This function temporarily disables the safety flag, indicating that it is safe to perform a delete operation.
     * After a 3-second delay, the safety flag is reset to true, indicating that it is safe to proceed with other actions.
     * This confirmation mechanism is typically used to prompt the user for confirmation before deleting an element.
     * Note: The safety flag is used to prevent accidental or unintended deletions.
     * @returns {void}
     */
    const showDeleteConfirmation = (): void => {
        editor.input.safety = false;
        setTimeout(() => {
            editor.input.safety = true;
        }, 3000);
    }

    /**
     * Clears the canvas in the editor.
     * This function removes all drawn elements from the canvas and sets the safety flag to true.
     * Removing the input elements effectively clears the canvas of any existing content.
     * The safety flag being set to true indicates that it is safe to proceed with other actions.
     * Note: The safety flag is used to prevent accidental or unintended actions.
     * @returns {void}
     */
    const clearCanvas = (): void => {
        editor.input.removeAll();
        editor.input.safety = true;
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
        if (!editor.input.trash) {
            editor.input.trash = true
            LevelEditorEffects.applyTrashEffect();
        } else {
            editor.input.trash = false
            LevelEditorEffects.removeTrashEffect();
        }
    }

    const toggleEditingMode = () => {
        if (editor.input.editable) {
            editor.input.editable = false
            LevelEditorEffects.removeEditingEffect();
        } else {
            editor.input.editable = true
            LevelEditorEffects.applyEditingEffect();
        }
    }

    const toggleClippingMode = () => {
        if (!editor.input.clipping) {
            editor.input.clipping = true
            LevelEditorEffects.applyClippingEffect();
        } else {
            editor.input.clipping = false
            LevelEditorEffects.removeClippingEffect();
        }
    }

    const toggleDragMode = () => {
        if (!editor.input.drag) {
            editor.input.drag = true
            LevelEditorEffects.applyDragEffect();
        } else {
            editor.input.drag = false
            LevelEditorEffects.removeDragEffect();
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