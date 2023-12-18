import '../../assets/styles/Animation.css'
import { LevelEditorDesign } from '../design/level'

/**
 * Applies an effect to the different modes for the editor. This will be used when UI or keyboard interactions are triggered.
 */
class LevelEditorEffects {
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
        const { w, h } = LevelEditorDesign.brush.object;
        brush.style.display = 'flex';
        brush.style.left = `${event.clientX}px`;
        brush.style.top = `${event.clientY}px`;
        brush.style.width = `${w}px`;
        brush.style.height = `${h}px`;
    }
    
    static applyTrashEffect() {
        document.getElementById(this.trashIconId)!.style.animationName = 'shake';
        document.getElementById(this.trashButtonId)!.title = 'Turn trash mode off'
        document.getElementById(this.trashStatusId)!.style.backgroundColor = this.onColor;
        document.getElementById(this.trashStatusId)!.ariaChecked = 'true';
    }
    static removeTrashEffect() {
        document.getElementById(this.trashIconId)!.style.animationName = '';
        document.getElementById(this.trashButtonId)!.title = 'Turn trash mode on'
        document.getElementById(this.trashStatusId)!.style.backgroundColor = '';
        document.getElementById(this.trashStatusId)!.ariaChecked = 'false';
    }

    static applyDragEffect = () => {
        document.getElementById(this.dragButtonId)!.title = 'Turn drag mode off'
        document.getElementById(this.dragStatusId)!.style.backgroundColor = this.onColor;
        document.getElementById(this.dragStatusId)!.ariaChecked = 'true';
    }
    static removeDragEffect = () => {
        document.getElementById(this.dragButtonId)!.title = 'Turn drag mode on'
        document.getElementById(this.dragStatusId)!.style.backgroundColor = '';
        document.getElementById(this.dragStatusId)!.ariaChecked = 'false';
    }
    
    static applyEditingEffect = () => {
        document.getElementById(this.editingButtonId)!.title = 'Turn edit mode off'
        document.getElementById(this.editingStatusId)!.style.backgroundColor = this.onColor;
        document.getElementById(this.editingStatusId)!.ariaChecked = 'true';
    }
    static removeEditingEffect = () => {
        document.getElementById(this.editingButtonId)!.title = 'Turn edit mode on'
        document.getElementById(this.editingStatusId)!.style.backgroundColor = '';
        document.getElementById(this.editingStatusId)!.ariaChecked = 'false';
    }

    static applyClippingEffect = () => {
        document.getElementById(this.clippingButtonId)!.title = 'Turn clipping mode off'
        document.getElementById(this.clippingStatusId)!.style.backgroundColor = this.onColor;
        document.getElementById(this.clippingStatusId)!.ariaChecked = 'true';
    }
    static removeClippingEffect = () => {
        document.getElementById(this.clippingButtonId)!.title = 'Turn clipping mode on'
        document.getElementById(this.clippingStatusId)!.style.backgroundColor = '';
        document.getElementById(this.clippingStatusId)!.ariaChecked = 'false';
    }


}

export {
    LevelEditorEffects
}