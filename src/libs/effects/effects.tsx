import '../../assets/styles.css'
import { SceneEditor } from '..'

/**
 * Applies an effect to the different modes for the editor. This will be used when UI or keyboard interactions are triggered.
 */
class SceneEditorEffects {
    static onColor = 'green'
    
    static brushId = 'Canvas-brush'

    static trashStatusId = 'toggle-trash-status'
    static trashButtonId = 'toggle-trash-button'
    static trashIconId = 'toggle-trash-icon'

    static clippingStatusId = 'toggle-clipping-status'
    static clippingButtonId = 'toggle-clipping-button'
    static clippingIconId = 'toggle-clipping-icon'

    static dragStatusId = 'toggle-drag-status'
    static dragButtonId = 'toggle-drag-button'
    static dragIconId = 'toggle-drag-icon'

    static editingStatusId = 'toggle-editing-status'
    static editingButtonId = 'toggle-editing-button'
    static editingIconId = 'toggle-editing-icon'
    
    static createBrush(event: MouseEvent) {
        const brush = document.getElementById(this.brushId)!;
        const { w, h } = SceneEditor.brush.object;
        brush.style.display = 'flex';
        brush.style.left = `${event.clientX}px`;
        brush.style.top = `${event.clientY}px`;
        brush.style.width = `${w}px`;
        brush.style.height = `${h}px`;
    }
    
    static applyTrashEffect() {
        document.getElementById(this.trashIconId)!.style.animationName = 'shake';
        document.getElementById(this.trashStatusId)!.style.backgroundColor = this.onColor;
        document.getElementById(this.trashButtonId)!.ariaLabel = 'trash on';
    }
    static removeTrashEffect() {
        document.getElementById(this.trashIconId)!.style.animationName = '';
        document.getElementById(this.trashStatusId)!.style.backgroundColor = '';
        document.getElementById(this.trashButtonId)!.ariaLabel = 'trash off';
    }

    static applyDragEffect = () => {
        document.getElementById(this.dragStatusId)!.style.backgroundColor = this.onColor;
        document.getElementById(this.dragButtonId)!.ariaLabel = 'drag on';
    }
    static removeDragEffect = () => {
        document.getElementById(this.dragStatusId)!.style.backgroundColor = '';
        document.getElementById(this.dragButtonId)!.ariaLabel = 'drag off';
    }
    
    static applyEditingEffect = () => {
        document.getElementById(this.editingStatusId)!.style.backgroundColor = this.onColor;
        document.getElementById(this.editingButtonId)!.ariaLabel = 'editing on';
    }
    static removeEditingEffect = () => {
        document.getElementById(this.editingStatusId)!.style.backgroundColor = '';
        document.getElementById(this.editingButtonId)!.ariaLabel = 'editing off';
    }

    static applyClippingEffect = () => {
        document.getElementById(this.clippingStatusId)!.style.backgroundColor = this.onColor;
        document.getElementById(this.clippingButtonId)!.ariaLabel = 'clipping on';
    }
    static removeClippingEffect = () => {
        document.getElementById(this.clippingStatusId)!.style.backgroundColor = '';
        document.getElementById(this.clippingButtonId)!.ariaLabel = 'clipping off';
    }

}

export {
    SceneEditorEffects
}