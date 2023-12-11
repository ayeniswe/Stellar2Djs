import configuration from '../../data/config.json';
import { Config, TextureObject } from '../../rendering/types';
import { capitalize } from '../../utils/text';
import { computed, effect, signal } from '@preact/signals-react';
import { Tilesets } from './type';

const useDesign = () => {
    let config: Config = configuration;
    const TILES = config.textures.tiles;

    const TILES_SRC = signal("");
    const TILESET = signal("dungeon");
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

    const getTiles = (objects: { [key: string]: TextureObject; }) => {
        TILES_METADATA.value = {
            ...TILES_METADATA.value,
            ...objects
        }; // keep track of all tiles
        return Object.keys(objects).map(key => {
            return <div id={key} key={key} className='DesignMenu__content__tiles__tile'/>
        });
    }

    const getGroups = (keyId: string) => {
        let groups = TILES[keyId].objects
        return Object.keys(groups).map(key => {
            return (
                <div key={key}>
                    <h5 className='DesignMenu__content__title'>
                        {capitalize(key)}
                    </h5>
                    <div className='DesignMenu__content__tiles'>
                        {getTiles(groups[key])}
                    </div>
                </div>
            )
        });
    }

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

    const showTileset = () => {
        return TILESET_VIEW
    }

    const getCategories = () => {
        return Object.keys(TILES).map(key => {
            return <option value={TILES[key].id} key={key}>{capitalize(TILES[key].id)}</option>
        });
    }

    const setTileset = (val: string) => {
        TILESET.value = val;
        TILES_SRC.value = TILESETS.value[TILESET.value].src;
    }

    return {
        getTilesets,
        getCategories,
        setTileset,
        showTileset,
        TILESET_VIEW,
        TILESET
    }
}

export {
    useDesign
}