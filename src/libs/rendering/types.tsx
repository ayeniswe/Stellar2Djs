type TextureAtlasMetadata = {
    name: string,
    src: string,
}
type Texture = TextureAtlasMetadata & {
    sx: number,
    sy: number,
    w: number,
    h: number
    dx: number,
    dy: number,
}
type TexturesMapping = {
    [key: string]: Texture
}
type TextureSources = {
    [key: string]: HTMLImageElement
}
type TextureObject = {
    name: string;
    sx: number;
    sy: number;
    w: number;
    h: number;
}
type TextureObjects = {
    [key: string]: TextureObject
}
type Textures = {
    name: string;
    src: string;
    groups: {
        [key: string]: TextureObjects
    };
}
type Config = {
    name: string;
    version: string;
    textures: {
        [key: string]: {
            [key: string]: Textures; // String will follow a numbering format starting from 1..n
        };
    };
}
type RevisionAction = "added" | "removed"
type RevisionRecord = Texture & {
    action: RevisionAction
}
type TextureRenderer = {
    /**
     * Adds a texture to the canvas.
     *
     * @param {boolean} clipping - Indicates whether clipping is applied.
     * @param {string} type - The type of the texture.
     * @param {string} group - The group of the texture.
     * @param {string} textureID - The ID of the texture.
     * @param {number} x - The x-coordinate of the texture.
     * @param {number} y - The y-coordinate of the texture.
     * @returns {number[]} Returns an array containing the x and y coordinates of the added texture, or an empty array if the texture was not added.
     *
     * @description
     * This method retrieves the brush information.
     * It then scales the x and y coordinates based on the dimensions of the texture.
     * 
     * NOTE: scaling only applies if clipping mode is on
     * 
     * If the texture does not already exist on the canvas, it retrieves the respective values from the config file.
     * It then stores the texture in the textures mapping using the destination coordinates and dimensions as the key.
     * Additionally, it stores an action object in the revisions array to keep track of the added texture.
     */
    addTexture: (clipping: boolean, textureType: string, group: string, id: string, x: number, y: number) => number[],
    /**
     * Removes a texture from the canvas.
     *
     * @param {boolean} clipping - Indicates whether clipping is applied.
     * @param {string} type - The type of the texture.
     * @param {string} group - The group of the texture.
     * @param {string} textureID - The ID of the texture.
     * @param {number} x - The x-coordinate of the texture.
     * @param {number} y - The y-coordinate of the texture.
     * @returns {number[]} Returns an array containing the x and y coordinates of the removed texture, or an empty array if the texture was not removed.
     *
     * @description
     * This method retrieves the height (h) and width (w) of the brush 
     * It then scales the x and y coordinates based on the dimensions of the texture.
     * If the destination coordinates (x, y) and dimensions (height, width) exists on the canvas, it clears the canvas at the specified destination coordinates and dimensions.
     * It also deletes the corresponding texture mapping.
     * Finally, it returns an array containing the x and y coordinates of the removed texture, or an empty array if the texture was not removed.
     */
    removeTexture: (clipping: boolean, textureType: string, group: string, id: string, x: number, y: number) => number[],
    /**
     * Undoes the last revision made to the canvas.
     *
     * @returns {boolean} Returns `true` if a revision was successfully undone, or `false` if there were no revisions to undo.
     *
     * @description
     * This method checks if there are any revisions in the `this.__revisions` array by checking its length.
     * If there are revisions, it pops the last revision from the array using the stack method.
     * The code then checks if there is a valid `action` object obtained from the popped revision.
     * Based on the action, it performs different actions:
     * - `added`: it deletes the corresponding texture from the textures mapping and clears the canvas in that area.
     * - `removed`: it adds the corresponding texture mapping back to the textures mapping.
     * 
     * NOTE: This method is only available to undo "added" actions
     */
    undoRevision: () => boolean,
    /**
    * Removes all textures from the canvas.
    */
    removeAllTexture: () => void
    /**
    * This mehtod is responsible for rendering textures onto a canvas.
    *
    * NOTE: this should be triggered on every frame update.
    */
    render: () => void
    /**
    * Initializes the renderer.
    */
    initialize: () => Promise<void>
    textureRenderer: {
        /**
        * All textures sources available to be used in the renderer
        */
        textureSources: TextureSources
        /**
        * The canvas for the scene to be rendered.
        */
        readonly ctx: CanvasRenderingContext2D
    }
}
export type {
    TextureRenderer,
    TextureAtlasMetadata,
    Texture,
    TextureSources,
    TextureObjects,
    Config,
    TexturesMapping,
    TextureObject,
    RevisionAction,
    RevisionRecord,
    Textures
}