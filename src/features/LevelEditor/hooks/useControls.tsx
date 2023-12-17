import { LevelEditor } from '../../../main/LevelEditor';
import { LevelEditorEffects } from '../../../libs/effects/effects';

/**
 * A hook that applies the necessary effects to each control functions for the LevelEditor.
 */
const useControls = (editor: LevelEditor) => {

    /**
     * Show delete confirmation for 3 seconds.
     */
    const showDeleteConfirmation = () => {
        editor.input.safety = false;
        setTimeout(() => {
            editor.input.safety = true;
        }, 3000);
    }
    
    const clearCanvas = () => {
        editor.input.removeAll();
        editor.input.safety = true;
    }

    /**
     * Intializes default (if any) state of the edit mode
     */
    const setEditMode = () => {
        if (editor.input.editable) {
            LevelEditorEffects.applyEditingEffect();
        }
    }

    const toggleTrashmode = () => {
        if (!editor.input.trash) {
            editor.input.trash = true
            LevelEditorEffects.applyTrashEffect();
        } else {
            editor.input.trash = false
            LevelEditorEffects.removeTrashEffect();
        }
    }

    const toggleEditMode = () => {
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
        toggleTrashmode,
        toggleEditMode,
        toggleClippingMode,
        toggleDragMode,
        setEditMode,
        showDeleteConfirmation,
        clearCanvas,
    }
}

export {
    useControls
}