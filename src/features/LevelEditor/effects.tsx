/**
 * Applies an effect to the trash mode for the editor. This will be used for user interactions.
 * Rather UI or keyboard interactions should be used.
 */
const trash = 'trashcan-editor'
const trashTitle = 'trashcan-editor-title'
const applyTrashEffect = () => {
    document.getElementById(trash)!.style.animationName = 'shake';
    document.getElementById(trashTitle)!.style.backgroundColor = 'red';
    document.getElementById(trash)!.ariaLabel = 'Trash mode is on'
}

const removeTrashEffect = () => {
    document.getElementById(trash)!.style.animationName = '';
    document.getElementById(trashTitle)!.style.backgroundColor = '';
    document.getElementById(trash)!.ariaLabel = 'Trash mode is off'
}

export {
    applyTrashEffect,
    removeTrashEffect
}