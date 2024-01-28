import { TextureObject, TextureSources } from "../../../libs/rendering"

type Input = {
    /**
     * Removes all textures from the scene
     * 
     * NOTE - wraps the `removeAll` method of the renderer
     */
    removeAll: () => void
    /**
     * Initializes the input bindings and texture sources for the level editor.
     * This method sets up various input bindings that allow the user to interact with the level editor and perform editing actions.
     * Each binding is associated with a specific key or mouse event and triggers a corresponding method when the event occurs.
     * All texture sources are preloaded aswell.
     * @returns {Promise<void>} A promise that resolves once the input bindings are initialized.
     */
    initialize: () => Promise<void>
    /**
     * All the `on/off` input attributes
     */
    input: Inputs
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
}
type Brush = {
    id: string
    group: string
    object: TextureObject
}
type Scene = {
    /**
     * Initializes the scene.
     * 
     * Note: This method should be called before any operations or interactions with the scene to ensure that it is properly initialized.
     * @returns {Promise<void>} A promise that resolves to void when the initialization process is complete.
     */
    initialize: () => Promise<void>
    /**
     * Clears the entire scene.
     */
    clear: () => void
    /**
     * All the scene attributes.
     */
    attrs: SceneAttributes
}
type SceneAttributes = {
    /**
     * The current inputs being used in the scene.
     */
    readonly input: Inputs;
    /**
     * The current texture sources stored in the scene.
     */
    readonly textureSources: TextureSources;
    /**
     * The current brush being used in the scene.
     */
    brush: Brush | null;
}
type Tilesets = {
    [key: string]: {
        html: JSX.Element,
        src: string,
    },
}
export type {
    SceneAttributes,
    Scene,
    Brush,
    Input,
    Inputs,
    Tilesets
}
