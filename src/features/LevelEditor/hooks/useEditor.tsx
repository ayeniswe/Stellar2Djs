import configuration from '../../../data/config.json';
import { Config, TextureObject, TextureObjects } from '../../../libs/rendering';
import { capitalize } from '../../../utils/text';
import { computed, signal, useSignal } from '@preact/signals-react';
import { Tilesets } from '../type';
import { LevelEditorDesign } from '../../../libs/design/level';
import { LevelEditor } from '../../../main/LevelEditor';

const useEditor = (editor: LevelEditor) => {
    let config: Config = configuration;
    const TILES = config.textures.tiles;

    const PANEL = useSignal(false);
    const TILESET = useSignal("");
    const CURRENT_TILE = signal("");
    const TILESETS = signal<Tilesets>({});
    const TILES_METADATA = signal<{ [key: string]: TextureObject; } | null>(null);
    const TILES_SRC = signal("");
    const TILESET_VIEW = computed(() => TILESETS.value[TILESET.value]?.html);

    const ASSETS_PATH = `assets/textures/{}`;
    const SELECTED_TILE_OPACITY = '1' // 100% opacity

    /**
     * Loads the background image for the given texture object.
     *
     * @param {TextureObject} object - The texture object containing the dimensions and source coordinates.
     * @return {Promise<string | undefined>} The data URL of the loaded image.
     */
    const loadBackground = async (object: TextureObject): Promise<string | undefined> => {
        const img = new Image();
        const path = ASSETS_PATH.replace("{}", TILES_SRC.value);
        const url: string = (await import(`../../../${path}`)).default;
        img.src = url;

        const imageLoading = new Promise<HTMLImageElement>((resolve) => {
            img.onload = () => {
                resolve(img);
            };
        });
        await imageLoading;

        try {
            // Create a temporary canvas
            const canvas = document.createElement('canvas');
            canvas.width = object.w;
            canvas.height = object.h;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                // Draw temporary canvas
                ctx.drawImage(img, object.sx, object.sy, object.w, object.h, 0, 0, object.w, object.h);
                return canvas.toDataURL();
            };
        } catch(error) {
            console.error("The JSON file key: 'objects' has an invalid key for src: " + TILES_SRC.value);
            
        };
    }

    /**
     * Sets the background image for each element in the TILES_METADATA object.
     */
    const setBackground = async () => {
        for (const key in TILES_METADATA.value) {
            const url = await loadBackground(TILES_METADATA.value[key]);
            if (url) {
                const ELE = document.getElementById(key);
                if (ELE) {
                    ELE.style.backgroundImage = `url(${url})`;
                };
            };
        };
    }

    /**
     * Sets the current tile to the selected tile and update the LevelEditor brush.
     *
     * @param {string} id - The ID of the tile to set as the brush.
     * @param {string} group - The group of the tile.
     * @param {TextureObject} object - The brush metadata.
     */
    const setTileBrush = (id: string, group: string, object: TextureObject) => {
        // Reset previous tile
        if (CURRENT_TILE.value) document.getElementById(CURRENT_TILE.value)!.style.opacity = "";
        // Set new tile
        document.getElementById(id)!.style.opacity = SELECTED_TILE_OPACITY;
        CURRENT_TILE.value = id;
        LevelEditorDesign.setBrush(id, group, object);
    }

    /**
     * Retrieves the tiles for the given objects.
     *
     * @param {Object} objects - An object containing texture objects.
     * @param {string} group - The group the tiles belong to.
     * @return {Array<JSX.Element>} An array of JSX elements representing the tiles.
     */
    const getTiles = (objects: TextureObjects , group: string): Array<JSX.Element> => {
        TILES_METADATA.value = {
            ...TILES_METADATA.value,
            ...objects
        }; // keep track of all tiles
        const tiles = Object.keys(objects).map(key => {
            return (
                <div
                    data-testid={`tile ${key}`}
                    id={key}
                    key={key}
                    aria-label={objects[key].name}
                    className='LevelEditor__content__tiles__tile'
                    onClick={(e) =>setTileBrush(e.currentTarget.id, group, objects[key])}
                />
            );
        });

        return tiles;
    }

    /**
     * Retrieves the groups of objects associated with the given key ID.
     *
     * @param {string} keyId - The ID of the key to retrieve groups for.
     * @return {JSX.Element[]} An array of JSX elements representing the groups of objects.
     */
    const getGroups = (keyId: string): JSX.Element[] => {
        let groups = TILES[keyId].objects
        return Object.keys(groups).map(key => {
            return (
                <div className='LevelEditor__content__group' key={key}>
                    <h5 className='LevelEditor__content__group__title' data-testid='group'>
                        {capitalize(key)}
                    </h5>
                    <div className='LevelEditor__content__group__tiles'>
                        {getTiles(groups[key], key)}
                    </div>
                </div>
            );
        });
    }

    /**
     * Get the tilesets from the JSON file.
     */
    const getTilesets = async () => {
        for (const key in TILES) {
            TILESETS.value = {
                ...TILESETS.value,
                [TILES[key].id]: {
                    src: TILES[key].src,
                    html: (
                        <div className='LevelEditor__content'>
                            {getGroups(key)}
                        </div>
                    )
                }
            };
            // Set default for first tileset found
            // if (key === "1") {
            //     TILESET.value = TILES[key].id;
            //     TILES_SRC.value = TILESETS.value[TILESET.value].src;
            // };
        };
        TILES_SRC.value = TILESETS.value[TILESET.value]?.src
    }
    
    /**
     * Returns an array of options for categories based on the TILES object.
     *
     * @return {Array} An array of <option> elements for each category.
     */
    const getCategories = (): Array<any> => {
        return Object.keys(TILES).map(key => {
            return (
                <option value={TILES[key].id} key={key}>
                    {capitalize(TILES[key].id)}
                </option>
            );
        });
    }

    const showTileset = () => {
        return TILESET_VIEW;
    }

    const setTileset = (val: string) => {
        TILESET.value = val;
    }

    /**
     * Hide and show the panel when clicking on the title. Set the
     * tileset to null when the panel is closed.
     */
    const togglePanel = () => {
        if (PANEL.value) {
            PANEL.value = false;
            editor.input.ready = false;
            TILESET.value = '';
        } else {
            PANEL.value = true;
        }
    }

    return {
        getTilesets,
        getCategories,
        setTileset,
        showTileset,
        togglePanel,
        setBackground,
        PANEL,
        TILESET,
        TILESETS,
        TILES_SRC
    }
}

export {
    useEditor
}