import '../../assets/styles/Animation.css'
import { LevelEditorDesign } from '../design/level'

/**
 * Applies an effect to the different modes for the editor. This will be used when UI or keyboard interactions are triggered.
 */
class LevelEditorEffects {
    static onColor = 'green'
    
    static brushId = 'Canvas-brush'
    static trashId = 'toggle-trash'
    static trashIconId = 'toggle-trash-icon'
    static clippingId = 'toggle-clipping'
    static dragId = 'toggle-drag'
    static editingId = 'toggle-editing'
    
    static createBrush(event: MouseEvent) {
        const brush = document.getElementById(this.brushId)!;
        const { w, h } = LevelEditorDesign.brush.object;
        brush.style.display = 'flex';
        brush.style.left = `${event.clientX}px`;
        brush.style.top = `${event.clientY}px`;
        brush.style.width = `${w}px`;
        brush.style.height = `${h}px`;
    }
    
    static applyTrashEffect() {
        document.getElementById(this.trashIconId)!.style.animationName = 'shake';
        document.getElementById(this.trashId)!.style.backgroundColor = this.onColor;
        document.getElementById(this.trashId)!.ariaLabel = 'Trash mode is on'
    }
    static removeTrashEffect() {
        document.getElementById(this.trashIconId)!.style.animationName = '';
        document.getElementById(this.trashId)!.style.backgroundColor = '';
        document.getElementById(this.trashId)!.ariaLabel = 'Trash mode is off'
    }

    static applyDragEffect = () => {
        document.getElementById(this.dragId)!.style.backgroundColor = this.onColor;
        document.getElementById(this.dragId)!.ariaLabel = 'Drag mode is on'
    }
    static removeDragEffect = () => {
        document.getElementById(this.dragId)!.style.backgroundColor = '';
        document.getElementById(this.dragId)!.ariaLabel = 'Drag mode is off'
    }

    static applyEditingEffect = () => {
        document.getElementById(this.editingId)!.style.backgroundColor = this.onColor;
        document.getElementById(this.editingId)!.ariaLabel = 'Edit mode is on'
    }
    static removeEditingEffect = () => {
        document.getElementById(this.editingId)!.style.backgroundColor = '';
        document.getElementById(this.editingId)!.ariaLabel = 'Edit mode is off'
    }

    static applyClippingEffect = () => {
        document.getElementById(this.clippingId)!.style.backgroundColor = this.onColor;
        document.getElementById(this.clippingId)!.ariaLabel = 'Clipping mode is on'
    }
    static removeClippingEffect = () => {
        document.getElementById(this.clippingId)!.style.backgroundColor = '';
        document.getElementById(this.clippingId)!.ariaLabel = 'Clipping mode is off'
    }


}

export {
    LevelEditorEffects
}