import { useAppContext } from '../../../context/appContext';
import configuration from '../../../data/config.json';
import { Config, TextureItem, TextureItems } from '../../../libs/rendering';
import { capitalize } from '../../../utils/text';
import { computed, signal, useComputed, useSignal } from '@preact/signals-react';
/**
 * This hook provides functionality to manage the tilesets, tiles, and editor tab.
 * 
 */
const useTilemap = () => {
    const { scene } = useAppContext();
    let config: Config = process.env.NODE_ENV === 'production' ? configuration : require('../../../data/test-config.json');
    const tilesets = config.textures.tilesets;
    const empty = useComputed( () => { return !(Object.keys(tilesets).length > 0) });
    const tileset_key = useSignal("");
    const tileset = useSignal<JSX.Element>(<></>);
    const tile = useSignal("");
    const tiles = signal<TextureItems>({});
    const tileset_NAME = computed(() => tilesets[tileset_key.value].name);
    const drawBackground = (object: TextureItem): string => {
        const { sx, sy, w, h } = object
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            let background = scene.attrs.textureSources[tileset_NAME.value];
            ctx.drawImage(background, sx, sy, w, h, 0, 0, w, h);
            return canvas.toDataURL();
        }
        return '';
    };
    const setTilesBackground = (): void => {
        for (const key in tiles.value) {
            const tile = document.getElementById(key);
            if (tile) {
                const url = drawBackground(tiles.value[key]);
                tile.style.backgroundImage = `url("${url}")`;
            };
        };
    }
    const setTileBrush = (id: string, group: string, object: TextureItem): void => {
        // Reset previous tile
        if (tile.value) {
            document.getElementById(tile.value)!.style.opacity = "";
            document.getElementById(tile.value)!.ariaPressed = 'false';
        }
        // Set new tile
        document.getElementById(id)!.style.opacity = '1';
        document.getElementById(id)!.ariaPressed = 'true';
        tile.value = id;
        scene.attrs.input.brush = { id, group, object};
    }
    /**
     * Returns an array of JSX elements representing tiles based on the provided `tiles` object and `group` string.
     *
     * @param {TextureItems} tiles - The object containing the texture objects for the tiles.
     * @param {string} group - The group of the tiles.
     * @returns {Array<JSX.Element>} An array of JSX elements representing the tiles.
     *
     * @description
     * This function updates the `tiles.value` object by merging the existing `tiles.value` object with the provided `tiles` object.
     * It then maps over the keys of the `tiles` object and for each key, it extracts the width (`w`), height (`h`), source x-coordinate (`sx`), source y-coordinate (`sy`), and name (`name`) of the tile from the corresponding texture object.
     * It returns a JSX element representing the tile, with the extracted information used to set the `id`, `key`, `title`, `aria-label`, `role`, and `className` attributes.
     * It also attaches an `onClick` event listener that calls the `setTileBrush` function with the current tile's ID, the provided `group`, and the corresponding texture object.
     */
    const getTiles = (items: TextureItems , group: string): Array<JSX.Element> => {
        tiles.value = {
            ...tiles.value,
            ...items
        }; // keep track of all tiles
        return Object.keys(items).map(key => {
            const [w, h, x, y, name] = [items[key].w, items[key].h, items[key].sx, items[key].sy, items[key].name];
            return (
                <button
                    className='tile'
                    id={key}
                    key={key}
                    data-cy={key}
                    title={`${w} x ${h}\n${x} , ${y}`}
                    aria-label={`tile: ${name}`}
                    onClick={(e) =>setTileBrush(e.currentTarget.id, group, items[key])}
                >
                    <img/>
                </button>
            );
        });
    }
    /**
     * Returns an array of JSX elements representing groups of tiles.
     *
     * @returns {Array<JSX.Element>} An array of JSX elements representing the tile groups.
     *
     * @description
     * This function retrieves the groups of tiles from the `tilesets` object based on the current `tileset_key.value`.
     * It maps over the keys of the `groups` object and for each key (group name), it returns a JSX element representing the group.
     * The JSX element includes a title element with the capitalized group name and a container for the tiles of that group.
     * It also calls the `getTiles` function to retrieve the JSX elements representing the tiles within the group.
     */
    const getGroups = (): JSX.Element[] => {
        const groups = tilesets[tileset_key.value].groups;
        return Object.keys(groups).map(name => {
            return (
                <div className='group' key={name}>
                    <h5 className='title'>
                        {capitalize(name)}
                    </h5>
                    <div className='tiles'>
                        {getTiles(groups[name], name)}
                    </div>
                </div>
            );
        });
    }
    const setTileset = async (): Promise<void> => {
        tileset.value = (
            <>
                {getGroups()}
            </>
        );
    }
    const getTilesets = (): JSX.Element[] => {
        return Object.keys(tilesets).map(key => {
            return (
                <option value={key} key={key}>
                    {capitalize(tilesets[key].name)}
                </option>
            );
        });
    }
    const setTilesetKey = (value: string): void => {
       tileset_key.value = value;
    }
    const showTileset = () => {
        return tileset;
    }
    return {
        setTileset,
        getTilesets,
        setTilesetKey,
        showTileset,
        setTilesBackground,
        drawBackground,
        setTileBrush,
        tileset_key,
        tileset,
        empty,
        tile
    }
}
export {
    useTilemap
}