import configuration from '../../data/config.json';
import { Config, RevisionRecord, TexturesMapping, TextureSources } from './types';
import { capitalize } from '../../utils/text';
import { useSignal } from '@preact/signals-react';
import { getHeight, getWidth } from '../../utils/styleProps';
const useTextureRenderer = (ctx: CanvasRenderingContext2D) => {
    const __revisions = useSignal<RevisionRecord[]>([]);
    const __textureSources = useSignal<TextureSources>({});
    const __textureMapping = useSignal<TexturesMapping>({});
    const CONFIG: Config = process.env.NODE_ENV === 'production' ? configuration : require('../../data/test-config.json');
    const textureRenderer = {
        get textureSources() {
            return __textureSources.value
        },
        get ctx() {
            return ctx
        }
    }
    const initialize = async () => {
        await addAllSources();
        startListeners();
    }
    /**
     * Adds all texture sources to the canvas.
     *
     * @returns {Promise<void>} Returns a promise that resolves when all texture sources have been added.
     *
     * @description
     * This method iterates over each textures type and texture within the textures type
     * For each texture, it retrieves the name and src (where file is found relative to the path).
     * It adds an entry to the textures sources
     * 
     * NOTE: All textures should be loaded before dealing with application
     * 
     * @todo Allow application use while loading in background using web workers
     */
    const addAllSources = async (): Promise<void> => {
        for (const key in CONFIG.textures) {
            const sources = Object.keys(CONFIG.textures[key]).length;
            for (let index = 1; index <= sources; index++) {
                const texture = CONFIG.textures[key][index];
                const name = texture.name;
                const path = `assets/textures/${texture.src}`;
                __textureSources.value = {
                    ...__textureSources.value,
                    [name]: new Image(),
                };
                try {
                    const url: string = (await import(`../../${path}`)).default;
                    __textureSources.value[name].src = url;
                    __textureSources.value[name].onload = () => {
                        console.log(`Loaded "${name}" texture - ${index} of ${sources}`);
                    };
                    __textureSources.value[name].onerror = () => console.error(`Failed to load "${name}" texture from ${path}`);
                } catch {
                }
            }
        }
    }
    /**
     * Checks if an position exists in texture mapping.
     *
     * @param {number} x The x-coordinate of the position.
     * @param {number} y The y-coordinate of the position.
     * @param {number} w The width of the position.
     * @param {number} h The height of the position.
     * @return {boolean} Returns true if the position exists, false otherwise.
     * 
     * NOTE: The key is generated from the destination coordinates (x and y) and dimensions (height and width).
     */
    const posExists = (x: number, y: number, w: number, h: number): boolean => {
        return __textureMapping.value[`${x},${y},${w},${h}`] ? true : false;
    }
    /**
     * Scales the coordinates based on the canvas size
     *
     * @param {number} x The x coordinate.
     * @param {number} y The y coordinate.
     * @param {number} w The width.
     * @param {number} h The height.
     * @param {boolean} clipping - Whether clipping is enabled or not.
     * @return {number[]} The scaled coordinates.
     */
    const scaling = (x: number, y: number, w: number, h: number, clipping: boolean): number[] => {
        const inBoundsY = (h: number, y: number) => {
            return y >= ctx.canvas.height - h ? ctx.canvas.height - h : y < 0 ? 0 : y;
        }
        const inBoundsX = (w: number, x: number) => {
            return x >= ctx.canvas.width - w ? ctx.canvas.width - w : x < 0 ? 0 : x;
        }
        const closestUnit = (val: number, scale: number) => {
            return Math.min(Math.abs(scale - val), val);
        }
        const clipX = (w: number, x: number) => {
            return (x - closestUnit(x % w, w)) % w === 0 ? x - closestUnit(x % w, w) : closestUnit(x % w, w) + x;
        }
        const clipY = (h: number, y: number) => {
            return (y - closestUnit(y % h, h)) % h === 0 ? y - closestUnit(y % h, h) : closestUnit(y % h, h) + y;
        }

        let dx, dy;
        if (clipping) {
            dx = clipX(w, inBoundsX(w, x));
            dy = clipY(h, inBoundsY(h, y));
            if (posExists(dx, dy, w, h) && x < dx) dx = inBoundsX(w, dx - w);
            if (posExists(dx, dy, w, h) && y < dy) dy = inBoundsY(w, dy - h);
        } else {
            dx = inBoundsX(w, x);
            dy = inBoundsY(h, y);
        }
        return [dx, dy];
    }
    /**
     * Retrieves brush information based on the provided type, group, and textureID.
     *
     * @param {string} type - The type of the texture.
     * @param {string} group - The group of the texture.
     * @param {string} textureID - The ID of the texture.
     * @returns {Array<any>} Returns an array containing the srcID, h, and w values of the texture.
     *
     * @description
     * This method tries to retrieve the srcID, height (h), and width (w) values.
     * 
     *  NOTE: The srcID is always the first part of the textureID string.
     */
    const getBrushInfo = (type: string, group: string, textureID: string): Array<any> => {
        let srcID, h, w;
        try {
            srcID = textureID.split('-')[0];
            h = CONFIG.textures[type][srcID].groups[group][textureID].h;
            w = CONFIG.textures[type][srcID].groups[group][textureID].w;
        } catch (error) {
            console.error(`Texture ID: ${textureID} could not be found`);
        }
        return [srcID, h, w];
    }
    /**
     * Clears any part of the canvas.
     * 
     * @param {number} dx - The x-coordinate of the top-left corner of the area.
     * @param {number} dy - The y-coordinate of the top-left corner of the area.
     * @param {number} w - The width of the area.
     * @param {number} h - The height of the area.
     */
    const clearCanvas = (dx: number, dy: number, w: number, h: number) => {
        ctx.clearRect(dx, dy, w, h);
    }
    const addTexture = (clipping: boolean, type: string, group: string, textureID: string, x: number, y: number): number[] => {
        // Get the source ID, height, and width of the current brush state
        const [key, h, w] = getBrushInfo(type, group, textureID);
        // Scaling and account for clipping if true
        const [dx, dy] = scaling(x, y, w, h, clipping);
        // Only add the texture once
        if (!posExists(dx, dy, w, h)) {
            const src = CONFIG.textures[type][key].name;
            const name = CONFIG.textures[type][key].groups[group][textureID].name;
            const sx = CONFIG.textures[type][key].groups[group][textureID].sx;
            const sy = CONFIG.textures[type][key].groups[group][textureID].sy;
            // Store the texture by the x, y, w, h coordinates for uniqueness
            __textureMapping.value[`${dx},${dy},${w},${h}`] = {
                src: src,
                name: name,
                sx: sx,
                sy: sy,
                dx: dx,
                dy: dy,
                w: w,
                h: h
            };
            // Store action in history
            __revisions.value.push({
                src: src,
                name: name,
                sx: sx,
                sy: sy,
                dx: dx,
                dy: dy,
                w: w,
                h: h,
                action: "added"
            });
            return [dx, dy];
        }
        return [];
    }
    const removeTexture = (clipping: boolean, type: string, group: string, textureID: string, x: number, y: number): number[] => {
        const [srcID, h, w] = getBrushInfo(type, group, textureID);
        const [dx, dy] = scaling(x, y, w, h, clipping);
        if (posExists(dx, dy, w, h)) {
            clearCanvas(dx, dy, w, h);
            delete __textureMapping.value[`${dx},${dy},${w},${h}`];
            return [dx, dy];
        }
        return [];
    }
    const undoRevision = (): boolean => {
        if (__revisions.value.length > 0) {
            const action = __revisions.value.pop();
            if (action) {
                const { dx, dy, w, h, src, name, sx, sy } = action;
                switch (action.action) {
                    case "added":
                        delete __textureMapping.value[`${dx},${dy},${w},${h}`];
                        clearCanvas(dx, dy, w, h);
                        break;
                    case "removed":
                        __textureMapping.value[`${dx},${dy},${w},${h}`] = {
                            src: src,
                            name: name,
                            sx: sx,
                            sy: sy,
                            dx: dx,
                            dy: dy,
                            w: w,
                            h: h
                        };
                        break;
                }
            }
            return true;
        }
        return false;
    }
    const render = () => {
        for (const key in __textureMapping.value) {
            const texture = __textureMapping.value[key];
            ctx.drawImage(
                __textureSources.value[texture.src],
                texture.sx,
                texture.sy,
                texture.w,
                texture.h,
                texture.dx,
                texture.dy,
                texture.w,
                texture.h
            );
        }
    }
    const removeAllTexture = () =>{
        __textureMapping.value = {};
        clearCanvas(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
    /**
     * Add a listener to listen for various rendering events
     */
    const startListeners = () => {
        // Resizing application window
        window.addEventListener("resize", () => {
            ctx.canvas.width = getWidth(ctx.canvas).toNumber();
            ctx.canvas.height = getHeight(ctx.canvas).toNumber();
            render();
        })
    }
    return {
        initialize,
        addTexture,
        removeTexture,
        undoRevision,
        render,
        removeAllTexture,
        textureRenderer,
    };
}
export {
    useTextureRenderer
}