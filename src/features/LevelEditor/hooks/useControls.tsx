import { LevelEditor } from '../../../main/LevelEditor';
import { LevelEditorEffects } from '../../../libs/effects/effects';
import { useSignal } from '@preact/signals-react';

/**
 * A hook that applies the necessary effects to each control functions for the LevelEditor.
 */
const useControls = (editor: LevelEditor) => {
    const DELETE_CONFIRMATION = useSignal(false);
    
    /**
     * Show delete confirmation for 5 seconds.
     */
    const showDeleteConfirmation = () => {
        DELETE_CONFIRMATION.value = true;
        setTimeout(() => {
            DELETE_CONFIRMATION.value = false;
        }, 3000);
    }
    
    /**
     * Clears the entire canvas
     */
    const deleteAll = () => {
        editor.input.safety = false;
        editor.input.removeAll();
        DELETE_CONFIRMATION.value = false;
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
        deleteAll,
        DELETE_CONFIRMATION
    }
}

export {
    useControls
}