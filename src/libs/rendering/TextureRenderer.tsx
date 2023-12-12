import configuration from '../../data/config.json';
import { Config, TexturesMapping, TextureSources } from './types';
import { capitalize } from '../../utils/text';

class TextureRenderer {
    private __textureSources: TextureSources = {};
    private __texturesMapping: TexturesMapping = {};
    private __config: Config = configuration;
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
     * Adds a new source to the __textureSources object.
     * @param {string} type - The texture type.
     */
    private async __addSources(type: string) {
        const sources = Object.keys(this.__config.textures[type]).length;
        let sourcesLoaded = 0;
        console.log(`${capitalize(type)} textures to load:`, sources);
        for (let index = 1; index <= sources; index++) {
            const texture = this.__config.textures[type][index];
            const id = texture.id;
            const path = `assets/textures/${texture.src}`;
            this.__textureSources = {
                ...this.__textureSources,
                [id]: new Image(),
            };
            try {
                const url: string = (await import(`../../${path}`)).default;
                this.__textureSources[id].src = url;
                this.__textureSources[id].onload = () => {
                    sourcesLoaded++;
                    console.log(`${capitalize(type)}: ${id} texture loaded...`, sourcesLoaded, 'of', sources);
                };
            } catch (error) {
                console.error(`Failed to load texture: ${id} from path: ${path}`);
            }
        }
    }

    /**
     * Checks if an x, y position exists in rendering context.
     *
     * @param {number} x - The x-coordinate of the position.
     * @param {number} y - The y-coordinate of the position.
     * @return {boolean} Returns true if the position exists, false otherwise.
     */
    private __posExists(x: number, y: number): boolean {
        return this.__texturesMapping[`${x},${y}`] ? true : false;
    }

    private async __addAllSources() {
        for (const key in this.__config.textures) {
            console.log(`Adding textures: ${capitalize(key)}`)
            this.__addSources(key);
        }
    }

    /**
     * Scales the coordinates based on the canvas size
     *
     * @param {number} x - The x coordinate.
     * @param {number} y - The y coordinate.
     * @param {number} w - The width.
     * @param {number} h - The height.
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
            if (this.__posExists(dx, dy) && x < dx) dx = inBoundsX(w, dx - w);
            if (this.__posExists(dx, dy) && y < dy) dy = inBoundsY(w, dy - h);
        } else {
            dx = inBoundsX(w, x);
            dy = inBoundsY(h, y);
        }
        return [dx, dy];
    }


    /**
     * Retrieves the brush information based on the provided type, group, and textureID.
     *
     * @param {string} type - The type of brush.
     * @param {string} group - The group of the brush.
     * @param {string} textureID - The ID of the texture.
     * @return {Array} An array containing the source ID, height, and width of the brush.
     */
    private __getBrushInfo(type: string, group: string, textureID: string): Array<any> {
        let srcID, h, w;
        try {
            srcID = textureID.split('-')[0];
            h = this.__config.textures[type][srcID].objects[group][textureID].h;
            w = this.__config.textures[type][srcID].objects[group][textureID].w;
        } catch (error) {
            console.error(`Texture ID: ${textureID} could not be found`);
        }
        return [srcID, h, w];
    }

    /**
     * Adds a texture to the list of textures.
     *
     * @param {string} clipping - Allow clipping textures to nearest unit.
     * @param {string} type - The type of the texture.
     * @param {string} group - The group to which the texture belongs.
     * @param {string} textureID - The texture id (includes the src id and object id respectively "src-obj").
     * @param {number} x - The x-coordinate of the destination position.
     * @param {number} y - The y-coordinate of the destination position.
     */
    __addTexture(clipping: boolean, type: string, group: string, textureID: string, x: number, y: number) {
        const [srcID, h, w] = this.__getBrushInfo(type, group, textureID);
        try {
            // Scaling and account for clipping if true
            const [dx, dy] = this.__scaling(x, y, w, h, clipping);
            
            const src = this.__config.textures[type][srcID].id;
            const name = this.__config.textures[type][srcID].objects[group][textureID].name;
            const sx = this.__config.textures[type][srcID].objects[group][textureID].sx;
            const sy = this.__config.textures[type][srcID].objects[group][textureID].sy;

            if (!this.__posExists(dx, dy)) {
                console.log(`Rendering ${name} at x: ${dx}, y: ${dy}`);
            } 
            // Store the texture by the x, y position
            this.__texturesMapping[`${dx},${dy}`] = {
                src: src,
                name: name,
                sx: sx,
                sy: sy,
                dx: dx,
                dy: dy,
                w: w,
                h: h
            };

        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Removes a texture at the specified coordinates.
     *
     * @param {boolean} clipping - Whether or not to apply clipping.
     * @param {string} type - The type of the texture.
     * @param {string} group - The group to which the texture belongs.
     * @param {string} textureID - The ID of the texture.
     * @param {number} x - The x-coordinate of the texture.
     * @param {number} y - The y-coordinate of the texture.
     */
    __removeTexture(clipping: boolean, type: string, group: string, textureID: string, x: number, y: number) {
        const [srcID, h, w] = this.__getBrushInfo(type, group, textureID);;
        const [dx, dy] = this.__scaling(x, y, w, h, clipping);
        console.log(`Removing texture at x: ${dx}, y: ${dy}`);
        delete this.__texturesMapping[`${dx},${dy}`];
        this.ctx.clearRect(dx,dy,h,w);
    }
    
    /**
     * Renders the textures on the canvas using the provided rendering context.
     */
    __render() {
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

    saveTextureMapping() {
        const data = new Blob([JSON.stringify(this.__texturesMapping)], { type: 'application/json' });
        // Create a URL for the Blob
        const url = URL.createObjectURL(data);
        // Create a link element to trigger the download
        const link = document.createElement('a');
        link.href = url;
        link.download = 'demo.json';
        link.click();
        // Remove link
        URL.revokeObjectURL(url);
    }

}

export {
    TextureRenderer
}