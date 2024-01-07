import configuration from '../../data/config.json';
import { Config, RevisionRecord, TexturesMapping, TextureSources } from '.';
import { capitalize } from '../../utils/text';
import { error, log, MESSAGE } from '../logging';

class TextureRenderer {
    private __revisions: RevisionRecord[] = [];
    private __textureSources: TextureSources = {};
    private __texturesMapping: TexturesMapping = {};
    private __config: Config = process.env.NODE_ENV === 'production' ? configuration : require('../../data/test-config.json');
    public ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    /**
     * Initializes the renderer.
     */
    async init() {
        await this.__addAllSources();
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
    private async __addAllSources(): Promise<void> {
        for (const key in this.__config.textures) {
            log(MESSAGE.ADDING_TEXTURE, `${capitalize(key)}`)
            const sources = Object.keys(this.__config.textures[key]).length;
            for (let index = 1; index <= sources; index++) {
                const texture = this.__config.textures[key][index];
                const name = texture.name;
                const path = `assets/textures/${texture.src}`;
                this.__textureSources = {
                    ...this.__textureSources,
                    [name]: new Image(),
                };
                try {
                    const url: string = (await import(`../../${path}`)).default;
                    this.__textureSources[name].src = url;
                    this.__textureSources[name].onload = () => {
                        log(MESSAGE.LOADING_TEXTURE, `${index} of ${sources}: ${capitalize(key)} `);
                    };
                    this.__textureSources[name].onerror = () => error(MESSAGE.FAILED_TEXTURE, `${name} from path: ${path}`);
                } catch {
                    error(MESSAGE.FAILED_TEXTURE, `${name} from path: ${path}`);
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
    private __posExists(x: number, y: number, w: number, h: number): boolean {
        return this.__texturesMapping[`${x},${y},${w},${h}`] ? true : false;
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
    private __scaling(x: number, y: number, w: number, h: number, clipping: boolean): number[] {
        const inBoundsY = (h: number, y: number) => {
            return y >= this.ctx.canvas.height - h ? this.ctx.canvas.height - h : y < 0 ? 0 : y;
        }
        const inBoundsX = (w: number, x: number) => {
            return x >= this.ctx.canvas.width - w ? this.ctx.canvas.width - w : x < 0 ? 0 : x;
        }
        const closestUnit = (val: number, scale: number) => {
            return Math.min(Math.abs(scale - val), val);
        }
        const clipX = (w: number, x: number) => {
            return (x - closestUnit(x % w, w)) % w === 0 ? x - closestUnit(x % w, w) : closestUnit(x % w, w) + x ;
        }
        const clipY = (h: number, y: number) => {
            return (y - closestUnit(y % h, h)) % h === 0 ? y - closestUnit(y % h, h) : closestUnit(y % h, h) + y ;
        }

        let dx, dy;
        if (clipping) {
            dx = clipX(w, inBoundsX(w, x));
            dy = clipY(h, inBoundsY(h, y));
            if (this.__posExists(dx, dy, w, h) && x < dx) dx = inBoundsX(w, dx - w);
            if (this.__posExists(dx, dy, w, h) && y < dy) dy = inBoundsY(w, dy - h);
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
    private __getBrushInfo(type: string, group: string, textureID: string): Array<any> {
        let srcID, h, w;
        try {
            srcID = textureID.split('-')[0];
            h = this.__config.textures[type][srcID].groups[group][textureID].h;
            w = this.__config.textures[type][srcID].groups[group][textureID].w;
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
    private __clearCanvas = (dx: number, dy: number, w: number, h: number) => {
        this.ctx.clearRect(dx, dy, w, h);
    }
    
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
    addTexture(clipping: boolean, type: string, group: string, textureID: string, x: number, y: number): number[] {
        // Get the source ID, height, and width of the current brush state
        const [key, h, w] = this.__getBrushInfo(type, group, textureID);
        // Scaling and account for clipping if true
        const [dx, dy] = this.__scaling(x, y, w, h, clipping);

        // Only add the texture once
        if (!this.__posExists(dx, dy, w, h)) {
            const src = this.__config.textures[type][key].name;
            const name = this.__config.textures[type][key].groups[group][textureID].name;
            const sx = this.__config.textures[type][key].groups[group][textureID].sx;
            const sy = this.__config.textures[type][key].groups[group][textureID].sy;

            // Store the texture by the x, y, w, h coordinates for uniqueness
            this.__texturesMapping[`${dx},${dy},${w},${h}`] = {
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
            this.__revisions.push({
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
    removeTexture(clipping: boolean, type: string, group: string, textureID: string, x: number, y: number): number[] {
        const [srcID, h, w] = this.__getBrushInfo(type, group, textureID);
        const [dx, dy] = this.__scaling(x, y, w, h, clipping);
        if (this.__posExists(dx, dy, w, h)) {
            this.__clearCanvas(dx, dy, w, h);
            delete this.__texturesMapping[`${dx},${dy},${w},${h}`];
            return [dx, dy];
        }
        return [];
    }

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
    undoRevision(): boolean {
        if (this.__revisions.length > 0) {
            const action = this.__revisions.pop();
            if (action) {
                const { dx, dy, w, h, src, name, sx, sy } = action;
                switch (action.action) {
                    case "added":
                        delete this.__texturesMapping[`${dx},${dy},${w},${h}`];
                        this.__clearCanvas(dx, dy, w, h);
                        break;
                    case "removed":
                        this.__texturesMapping[`${dx},${dy},${w},${h}`] = {
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

    /**
    * This mehtod is responsible for rendering textures onto a canvas.
    *
    * NOTE: this should be triggered on every frame update.
    */
    render() {
        for (const key in this.__texturesMapping) {
            const texture = this.__texturesMapping[key];
            this.ctx.drawImage(
                this.__textureSources[texture.src],
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

    removeAllTexture() {
        this.__texturesMapping = {};
        this.__clearCanvas(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    get textureSources() {
        return this.__textureSources;
    }
 
    // saveTextureMapping() {
    //     const data = new Blob([JSON.stringify(this.__texturesMapping)], { type: 'application/json' });
    //     // Create a URL for the Blob
    //     const url = URL.createObjectURL(data);
    //     // Create a link element to trigger the download
    //     const link = document.createElement('a');
    //     link.href = url;
    //     link.download = 'demo.json';
    //     link.click();
    //     // Remove link
    //     URL.revokeObjectURL(url);
    // }

}

export {
    TextureRenderer
}