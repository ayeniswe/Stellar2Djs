import '../../assets/styles.css'
/**
 * Applies an effects to the UI.
 */
const UIEffects = () => {
    const onColor = 'green'
    const applyTrashEffect = (on: boolean = true) => {
        if (on) {
            document.getElementById('toggle-trash-icon')!.style.animationName = 'shake';
            document.getElementById('toggle-trash-status')!.style.backgroundColor = onColor;
            document.getElementById('toggle-trash-button')!.ariaLabel = 'trash on';
        } else {
            document.getElementById('toggle-trash-icon')!.style.animationName = 'none';
            document.getElementById('toggle-trash-status')!.style.backgroundColor = '';
            document.getElementById('toggle-trash-button')!.ariaLabel = 'trash off';
        }
    }
    const applyDragEffect = (on: boolean = true) => {
        if (on) {
            document.getElementById('toggle-drag-status')!.style.backgroundColor = onColor;
            document.getElementById('toggle-drag-button')!.ariaLabel = 'drag on';
        } else {
            document.getElementById('toggle-drag-status')!.style.backgroundColor = '';
            document.getElementById('toggle-drag-button')!.ariaLabel = 'drag off';
        }
    }
    const applyEditingEffect = (on: boolean = true) => {
        if (on) {
            document.getElementById('toggle-editing-status')!.style.backgroundColor = onColor;
            document.getElementById('toggle-editing-button')!.ariaLabel = 'editing on';
        } else {
            document.getElementById('toggle-editing-status')!.style.backgroundColor = '';
            document.getElementById('toggle-editing-button')!.ariaLabel = 'editing off';
        }
    }
    const applyClippingEffect = (on: boolean = true) => {
        if (on) {
            document.getElementById('toggle-clipping-status')!.style.backgroundColor = onColor;
            document.getElementById('toggle-clipping-button')!.ariaLabel = 'clipping on';
        } else {
            document.getElementById('toggle-clipping-status')!.style.backgroundColor = '';
            document.getElementById('toggle-clipping-button')!.ariaLabel = 'clipping off';
        }
    }
    return {
        applyTrashEffect,
        applyDragEffect,
        applyEditingEffect,
        applyClippingEffect,
    }
}
export {
    UIEffects
}