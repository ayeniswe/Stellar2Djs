import configuration from '../../../data/config.json';
import { Config, TextureObject, TextureObjects } from '../../../libs/rendering';
import { capitalize } from '../../../utils/text';
import { computed, signal, useSignal } from '@preact/signals-react';
import { SceneAttributes } from './type';
/**
 * This hook provides functionality to manage the tilesets, tiles, and editor tab.
 * 
 */
const useEditor = (scene: SceneAttributes) => {
    let config: Config = process.env.NODE_ENV === 'production' ? configuration : require('../../../data/test-config.json');
    const TILESETS = config.textures.tilesets;
    const EDITOR_TAB = useSignal(false);
    const TILESET_KEY = useSignal("");
    const TILESET = useSignal<JSX.Element>(<></>);
    const TILE = useSignal("");
    const TILES = signal<TextureObjects>({});
    const TILESET_NAME = computed(() => TILESETS[TILESET_KEY.value].name);
    const SELECTED_TILE_OPACITY = '1' // 100% opacity
    /**
     * Draws the background image on a canvas based on the given texture object.
     *
     * @param {TextureObject} object - The texture object containing the dimensions and source coordinates.
     * @returns {string} The data URL of the canvas image or empty string if there's an error.
     * @throws {Error} If if 2d context is not available
     *
     * @description
     * This function takes a `TextureObject` as a parameter, which should contain the necessary information for drawing the background image.
     * It creates a canvas element and sets its width and height based on the dimensions from the `object` parameter.
     * The function then obtains the 2D rendering context of the canvas using `getContext('2d')`.
     * If the context is available, it retrieves the image from `editor.input.textureSources` using the `TILESET_NAME` value and draws it on the canvas using `drawImage`.
     * Finally, it returns the data URL of the canvas image using `toDataURL`.
     */
    const drawBackground =  (object: TextureObject): string => {
        const { sx, sy, w, h } = object
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            let background = scene.textureSources[TILESET_NAME.value];
            ctx.drawImage(background, sx, sy, w, h, 0, 0, w, h);
            return canvas.toDataURL();
        }
        return '';
    };
    /**
     * Sets the background image for each tile element based on the corresponding texture object.
     *
     * @returns {void}
     *
     * @description
     * This function iterates over the keys of the `TILES.value` object.
     * For each key, it retrieves the corresponding tile element using `document.getElementById`.
     * If the tile element exists, it calls the `drawBackground` function with the corresponding texture object to get the URL of the background image.
     * It then sets the `backgroundImage` CSS property of the tile element to the obtained URL.
     */
    const setTilesBackground = (): void => {
        for (const key in TILES.value) {
            const tile = document.getElementById(key);
            if (tile) {
                const url = drawBackground(TILES.value[key]);
                tile.style.backgroundImage = `url("${url}")`;
            };
        };
    }
    /**
     * Sets the tile brush for the scene.
     *
     * @param {string} id - The ID of the tile element.
     * @param {string} group - The group of the tile.
     * @param {TextureObject} object - The texture object for the tile.
     * @returns {void}
     *
     * @description
     * This function sets the tile brush for the level editor based on the provided parameters.
     * It first resets the previously selected tile by removing the opacity and setting the `ariaPressed` attribute to 'false'.
     * Then, it sets the new tile by adding the specified opacity and setting the `ariaPressed` attribute to 'true'.
     * The function also updates the `TILE.value` variable to store the ID of the new tile.
     * Finally, it calls the `SceneDesign.setBrush` function to update the brush in the level editor. The `SceneDesign.setBrush` static instance plays a crucial role in integration for rendering texture on canvas based on UI interaction.
     */
    const setTileBrush = (id: string, group: string, object: TextureObject): void => {
        // Reset previous tile
        if (TILE.value) {
            document.getElementById(TILE.value)!.style.opacity = "";
            document.getElementById(TILE.value)!.ariaPressed = 'false';
        }
        // Set new tile
        document.getElementById(id)!.style.opacity = SELECTED_TILE_OPACITY;
        document.getElementById(id)!.ariaPressed = 'true';
        TILE.value = id;
        scene.brush = { id, group, object };
    }
    /**
     * Returns an array of JSX elements representing tiles based on the provided `tiles` object and `group` string.
     *
     * @param {TextureObjects} tiles - The object containing the texture objects for the tiles.
     * @param {string} group - The group of the tiles.
     * @returns {Array<JSX.Element>} An array of JSX elements representing the tiles.
     *
     * @description
     * This function updates the `TILES.value` object by merging the existing `TILES.value` object with the provided `tiles` object.
     * It then maps over the keys of the `tiles` object and for each key, it extracts the width (`w`), height (`h`), source x-coordinate (`sx`), source y-coordinate (`sy`), and name (`name`) of the tile from the corresponding texture object.
     * It returns a JSX element representing the tile, with the extracted information used to set the `id`, `key`, `title`, `aria-label`, `role`, and `className` attributes.
     * It also attaches an `onClick` event listener that calls the `setTileBrush` function with the current tile's ID, the provided `group`, and the corresponding texture object.
     */
    const getTiles = (tiles: TextureObjects , group: string): Array<JSX.Element> => {
        TILES.value = {
            ...TILES.value,
            ...tiles
        }; // keep track of all tiles
        return Object.keys(tiles).map(key => {
            const [w, h, x, y, name] = [tiles[key].w, tiles[key].h, tiles[key].sx, tiles[key].sy, tiles[key].name];
            return (
                <img
                    id={key}
                    key={key}
                    title={`${w} x ${h}\n${x} , ${y}`}
                    aria-label={`tile: ${name}`}
                    role='button'
                    className='Scene__content__tiles__tile'
                    onClick={(e) =>setTileBrush(e.currentTarget.id, group, tiles[key])}
                 />
            );
        });
    }
    /**
     * Returns an array of JSX elements representing groups of tiles.
     *
     * @returns {Array<JSX.Element>} An array of JSX elements representing the tile groups.
     *
     * @description
     * This function retrieves the groups of tiles from the `TILESETS` object based on the current `TILESET_KEY.value`.
     * It maps over the keys of the `groups` object and for each key (group name), it returns a JSX element representing the group.
     * The JSX element includes a title element with the capitalized group name and a container for the tiles of that group.
     * It also calls the `getTiles` function to retrieve the JSX elements representing the tiles within the group.
     */
    const getGroups = (): JSX.Element[] => {
        const groups = TILESETS[TILESET_KEY.value].groups;
        return Object.keys(groups).map(name => {
            return (
                <div className='Scene__content__group' key={name}>
                    <h5 className='Scene__content__group__title'>
                        {capitalize(name)}
                    </h5>
                    <div className='Scene__content__group__tiles'>
                        {getTiles(groups[name], name)}
                    </div>
                </div>
            );
        });
    }
    /**
     * Sets the tileset JSX element for the scene.
     *
     * @returns {Promise<void>}
     *
     * @description
     * This function sets the `TILESET.value` variable to a JSX element representing the tileset.
     * The JSX element is created with a container element having the CSS class `Scene__content`.
     * Inside the container, it includes the JSX elements representing the groups of tiles obtained from the `getGroups` function.
     * Note that the function is declared as `async`, because it is always called before `setTilesetBackground` which is dependent on all tile elements being visible.
     */
    const setTileset = async (): Promise<void> => {
        TILESET.value = (
            <div className='Scene__content'>
                {getGroups()}
            </div>
        );
    }
    /**
     * Returns an array of JSX elements representing the available tilesets.
     *
     * @returns {Array<any>} An array of JSX elements representing the tilesets.
     *
     * @description
     * This function maps over the keys of the `TILESETS` object and for each key, it returns a JSX element representing a tileset option.
     * The JSX element includes the value attribute set to the key, and the displayed text is the capitalized name of the tileset obtained from the corresponding `TILESETS` object.
     */
    const getTilesets = (): Array<any> => {
        return Object.keys(TILESETS).map(key => {
            return (
                <option value={key} key={key}>
                    {capitalize(TILESETS[key].name)}
                </option>
            );
        });
    }
    /**
     * Sets the value of the `TILESET_KEY.value` variable.
     *
     * @param {string} value - The value to set for the `TILESET_KEY.value` variable.
     * @returns {void}
     *
     * @description
     * This function updates the value of the `TILESET_KEY.value` variable with the provided `value`.
     * It overwrites the existing value with the new value.
     */
    const setTilesetKey = (value: string): void => {
       TILESET_KEY.value = value;
    }
    /**
     * Closes the tab.
     *
     * @returns {void}
     *
     * @description
     * This function performs the following actions to close the tab:
     * - Sets the value of the `EDITOR_TAB.value` variable to `false`.
     * - Clears the `TILESET.value` variable by assigning an empty JSX element.
     * - Clears the `TILESET_KEY.value` variable by assigning an empty string.
     * - Sets the `ready` property of the `editor.input` object to `false`.
     */
    const closeEditorTab = (): void => {
        EDITOR_TAB.value = false;
        TILESET.value = <></>;
        TILESET_KEY.value = '';
        scene.input.ready = false;
    }
    /**
     * Toggles the state of the editor tab.
     *
     * @returns {void}
     *
     * @description
     * This function checks the current value of the `EDITOR_TAB.value` variable.
     * If it is `true`, it calls the `closeEditorTab` function to close the tab.
     * If it is `false`, it sets the value of the `EDITOR_TAB.value` variable to `true` to open the tab.
     */
    const toggleEditorTab = (): void => {
       if (EDITOR_TAB.value) {
           closeEditorTab();
        } else {
            EDITOR_TAB.value = true;
        }
    }
    const showTileset = () => {
        return TILESET;
    }
    return {
        setTileset,
        getTilesets,
        setTilesetKey,
        showTileset,
        toggleEditorTab,
        setTilesBackground,
        drawBackground,
        setTileBrush,
        EDITOR_TAB,
        TILESET_KEY,
        TILESET,
        TILE
    }
}
export {
    useEditor
}