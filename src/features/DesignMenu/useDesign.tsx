import configuration from '../../data/config.json';
import { Config, TextureObject } from '../../libs/rendering/types';
import { capitalize } from '../../utils/text';
import { computed, effect, signal } from '@preact/signals-react';
import { Tilesets } from './type';
import { Level } from '../../libs/design/level/index';

const useDesign = () => {
    let config: Config = configuration;
    const TILES = config.textures.tiles;

    const TILES_SRC = signal("");
    const TILESET = signal("dungeon");
    const CURRENT_TILE = signal("");
    const TILESETS = signal<Tilesets>({});
    const TILES_METADATA = signal<{ [key: string]: TextureObject; } | null>(null);
    const TILESET_VIEW = computed(() => TILESETS.value[TILESET.value]?.html);

    const ASSETS_PATH = `assets/textures/placeholder`;

    // Set background for all tiles
    effect( async () => {
        if (TILES_SRC.value && TILES_METADATA.value) {
            await setBackground();
        };
    })

    /**
     * Loads the background image for the given texture object.
     *
     * @param {TextureObject} object - The texture object containing the dimensions and source coordinates.
     * @return {Promise<string | undefined>} The data URL of the loaded image.
     */
    const loadBackground = async (object: TextureObject): Promise<string | undefined> => {
        const IMG = new Image();
        const PATH = ASSETS_PATH.replace("placeholder", TILES_SRC.value);
        const URL: string = (await import(`../../${PATH}`)).default;
        IMG.src = URL;

        const IMAGELOADING = new Promise<HTMLImageElement>((resolve) => {
            IMG.onload = () => {
                resolve(IMG);
            };
        });
        await IMAGELOADING;

        try {
            // Create a temporary canvas
            const CANVAS = document.createElement('canvas');
            CANVAS.width = object.w;
            CANVAS.height = object.h;
            const CTX = CANVAS.getContext('2d');
            if (CTX) {
                // Draw temporary canvas
                CTX.drawImage(IMG, object.sx, object.sy, object.w, object.h, 0, 0, object.w, object.h);
                return CANVAS.toDataURL();
            };
        } catch(error) {
            console.error("The JSON file key: 'objects' has an invalid key for src: " + TILES_SRC.value);
            
        };
    }

    /**
     * Sets the background image for each element in the TILES_METADATA object.
     *
     * @return {Promise<void>} A promise that resolves when all the background images have been set.
     */
    const setBackground = async () => {
        for (const key in TILES_METADATA.value) {
            const URL = await loadBackground(TILES_METADATA.value[key]);
            if (URL) {
                const ELE = document.getElementById(key);
                if (ELE) {
                    ELE.style.backgroundImage = `url(${URL})`;
                };
            };
        };
    }

    /**
     * Retrieves the tiles for the given objects.
     *
     * @param {Object} objects - An object containing texture objects.
     * @param {string} group - The group the tiles belong to.
     * @return {Array<JSX.Element>} An array of JSX elements representing the tiles.
     */
    const getTiles = (objects: { [key: string]: TextureObject; }, group: string): Array<JSX.Element> => {
        TILES_METADATA.value = {
            ...TILES_METADATA.value,
            ...objects
        }; // keep track of all tiles
        return Object.keys(objects).map(key => {
            return <div id={key} key={key} className='DesignMenu__content__tiles__tile' onClick={(e) =>Level.setBrush(e.currentTarget.id, group)}/>
        });
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
                <div key={key}>
                    <h5 className='DesignMenu__content__title'>
                        {capitalize(key)}
                    </h5>
                    <div className='DesignMenu__content__tiles'>
                        {getTiles(groups[key], key)}
                    </div>
                </div>
            )
        });
    }

    /**
     * Get the tilesets from the JSON file.
     */
    const getTilesets = () => {
        for (const key in TILES) {
            TILESETS.value = {
                ...TILESETS.value,
                [TILES[key].id]: {
                    src: TILES[key].src,
                    html: (
                        <>
                            <div className='DesignMenu__content'>
                                {getGroups(key)}
                            </div>
                        </>
                    )
                }
            };
        }
        TILES_SRC.value = TILESETS.value[TILESET.value].src;
    }
    
    /**
     * Returns an array of options for categories based on the TILES object.
     *
     * @return {Array} An array of <option> elements for each category.
     */
    const getCategories = () => {
        return Object.keys(TILES).map(key => {
            return <option value={TILES[key].id} key={key}>{capitalize(TILES[key].id)}</option>
        });
    }

    // const getTileMetadata = (key: string) => {
    //     if (TILES_METADATA.value) {
    //         return TILES_METADATA.value[key];
    //     }
    // }

    const showTileset = () => {
        return TILESET_VIEW
    }

    const setTileset = (val: string) => {
        TILESET.value = val;
        TILES_SRC.value = TILESETS.value[TILESET.value].src;
    }
    
    return {
        getTilesets,
        getCategories,
        setTileset,
        showTileset
    }
}

export {
    useDesign
}