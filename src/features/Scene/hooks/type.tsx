import { Texture, TextureItem, TextureSources } from '../../../libs/rendering';
import React from 'react';

type Input = {
    /**
     * Removes all textures from the scene
     *
     * NOTE - wraps the `removeAll` method of the renderer
     */
    removeAll: () => void
    /**
     * Initializes the input bindings and texture sources for the level editor.
     * This method sets up various input bindings that
     * allow the user to interact
     * with the level editor and perform editing actions.
     * Each binding is associated with a specific key or
     * mouse event and triggers a
     * corresponding method when the event occurs.
     * All texture sources are preloaded as well.
     * @returns {Promise<void>} A promise that resolves once the input bindings
     * are initialized.
     */
    initialize: () => Promise<void>
    /**
     * All the `on/off` input attributes
     */
    input: Inputs
}

type Control = {
    /**
     * Toggles the trash modes in the scene.
     */
    toggleTrashMode: (button: HTMLButtonElement) => void
    /**
     * Toggles the drag mode in the scene.
     */
    toggleDragMode: (button: HTMLButtonElement) => void
    /**
     * Toggles the clipping mode in the scene.
     */
    toggleClippingMode: (button: HTMLButtonElement) => void
    /**
     * Toggles the editing mode in the scene.
     */
    toggleEditingMode: (button: HTMLButtonElement) => void
    /**
     * Shows a delete confirmation in the scene.
     * This function temporarily disables the safety flag, indicating that it
     * is safe to perform a delete operation.
     * After a 3-second delay, the safety flag is reset to true,
     * indicating that it
     * is safe to proceed with other actions.
     * This confirmation mechanism is typically used to prompt the
     * user for confirmation
     * before deleting an element.
     * Note: The safety flag is used to prevent accidental or
     * unintended deletions.
     */
    showDeleteConfirmation: () => void
    /**
     * Clears the canvas.
     * This function removes all drawn elements from the canvas and sets the
     * safety flag to true.
     * Removing the input elements effectively clears the
     * canvas of any existing content.
     * The safety flag being set to true indicates that it is
     * safe to proceed with other actions.
     * Note: The safety flag is used to prevent accidental or
     * unintended actions.
     */
    clearCanvas: () => void
}

type Inputs = {
    /**
     * The `ready` signal is emitted when the scene is ready to be used.
     */
    ready: boolean
    /**
     * The `safety` signal is a flag to control dangerous actions.
     */
    safety: boolean
    /**
     * The `drag` signal is a flag to control dragging.
     */
    drag: boolean
    /**
     * The `editable` signal is a flag to control editing.
     */
    editable: boolean
    /**
     * The `trash` signal is a flag to control trash mode.
     */
    trash: boolean
    /**
     * The `clip` signal is a flag to control clipping.
     */
    clip: boolean
    /**
     * The brush being used in the scene.
     */
    brush: Brush | null
}

type Brush = {
    id: string
    group?: string
    object: TextureItem
}

type Scene = {
    /**
     * Initializes the scene.
     *
     * Note: This method should be called before any operations or
     * interactions with the scene to ensure that it is properly initialized.
     * @returns {void} A promise that resolves to void when the
     * initialization process is complete.
     */
    initialize: () => void
    /**
     * Clears the entire scene.
     */
    clear: () => void
    /**
     * All the scene attributes.
     */
    attrs: SceneAttributes
    renderer: Texture
}

type SceneAttributes = {
    /**
     * The current inputs being used in the scene.
     */
    readonly input: Inputs
    /**
     * The current texture sources stored in the scene.
     */
    readonly textureSources: TextureSources
    /**
     * The current rendering context of the scene.
     */
    readonly ctx: CanvasRenderingContext2D | null
    /**
     * The current width of the scene.
     *
     * NOTE - can only be accessed if context is initialized
     */
    width: number
    /**
     * The current height of the scene.
     *
     * NOTE - can only be accessed if context is initialized
     */
    height: number
}

type Tilesets = {
    /**
     *  Tilesets in a json config format to render in the scene
     */
    [key: string]: {
        html: React.JSX.Element
        src: string
    },
}

export type {
  SceneAttributes,
  Control,
  Scene,
  Brush,
  Input,
  Inputs,
  Tilesets
};
