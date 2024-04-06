import React from 'react';
import { Signal } from '@preact/signals-react';
import { TextureItem } from '../../../libs/rendering';

type TilemapHook = {
    /**
     * Sets the tileset JSX element.
     *
     * @description
     * This function sets the `TILESET.value` variable to a
     * JSX element representing the tileset.
     * The JSX element is created with a container element.
     * Inside the container, it includes the JSX elements
     * representing the groups of tiles obtained from the `getGroups` function.
     * Note that the function is declared as `async`, because it
     * is always called before `setTilesetBackground` which is dependent
     * on all tile elements being visible.
     */
    setTileset: () => Promise<void>,
    /**
     * Returns an array of JSX elements representing the available tilesets.
     *
     * @returns {JSX.Element[]} An array of JSX
     * elements representing the tilesets.
     *
     * @description
     * This function maps over the keys of the `TILESETS` object and for
     * each key, it returns a JSX element representing a tileset option.
     * The JSX element includes the value attribute set to the key, and the
     * displayed text is the capitalized name of the tileset obtained from
     * the corresponding `TILESETS` object.
     */
    getTilesets: () => React.JSX.Element[]
    /**
     * Sets the key of the selected tileset.
     *
     * @param {string} value - The value to set for the
     * `TILESET_KEY.value` variable.
     *
     * @description
     * This function updates the value of the `TILESET_KEY.value` variable
     * with the provided `value`.
     * It overwrites the existing value with the new value.
     */
    setTilesetKey: (value: string) => void
    /**
     * Draws the background image on a canvas based on the given texture object.
     *
     * @param {TextureItem} object - The texture object containing the
     * dimensions and source coordinates.
     * @returns {string} The data URL of the canvas image or empty string
     * if there's an error.
     *
     * @description
     * This function takes a object as a parameter, which should contain the
     * necessary information for drawing the background image.
     * It creates a canvas element and sets its width and height based on
     * the dimensions from the `object` parameter.
     * The function then obtains the 2D rendering context of the canvas
     * using `getContext('2d')`.
     * If the context is available, it retrieves the image from
     * `editor.input.textureSources` using the `TILESET_NAME` value and
     * draws it on the canvas using `drawImage`.
     * Finally, it returns the data URL of the canvas image using `toDataURL`.
     */
    drawBackground: (object: TextureItem) => string
    /**
     * Sets the tile brush for the scene.
     *
     * @param {string} id - The ID of the tile element.
     * @param {string} group - The group of the tile.
     * @param {TextureItem} object - The texture object for the tile.
     *
     * @description
     * This function sets the tile brush for the level editor
     * based on the provided parameters.
     * It first resets the previously selected tile by removing the
     * opacity and setting the `ariaPressed` attribute to 'false'.
     * Then, it sets the new tile by adding the specified opacity and
     * setting the `ariaPressed` attribute to 'true'.
     * The function also updates the `TILE.value` variable to store the
     * ID of the new tile.
     * Finally, it calls the `SceneDesign.setBrush` function to update the
     * brush in the level editor. The `SceneDesign.setBrush` static instance
     * plays a crucial role in integration for rendering texture on canvas
     * based on UI interaction.
     */
    setTileBrush: (id: string, group: string, object: TextureItem) => void
    /**
     * Sets the background image for the tiles all tiles.
     *
     * Note - defaults to solid color background
     */
    setTilesBackground: () => void
    /**
     * Returns an array of JSX elements representing the
     * available tileset currently selected.
     */
    showTileset: () => React.JSX.Element
    /**
     * The key of the selected tileset.
     */
    tileset_key: Signal<string>
    /**
     * The currently selected tileset.
     */
    tileset: Signal<React.JSX.Element>
    /**
     * Whether the tilesets is empty.
     */
    empty: Signal<boolean>
    /**
     * The ID of the selected tile.
     */
    tile: Signal<string>
}

export type { TilemapHook };
