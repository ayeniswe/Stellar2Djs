import config from './config.json';
import { Config, Texture, TexturesMapping, TextureSources } from '../rendering/types';

class TextureRenderer {
    private ctx: CanvasRenderingContext2D;
    private textureSources: TextureSources = {}
    private texturesMapping: TexturesMapping = {};
    private config: Config = config;
    private clipping: boolean = true;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    /**
     * Initializes the renderer.
     */
    async init() {
        await this.addSources();
    }

    /**
     * Adds a new source to the textureSources object.
     */
    private async addSources() {
        for (let index = 1; index < Object.keys(this.config.textures).length + 1; index++) {
            const texture = this.config.textures[index];
            const id = texture.id
            const path = `assets/textures/${texture.src}`
            this.textureSources = {
                ...this.textureSources,
                [id]: new Image(),
            };
            try {
                const url = (await import(`../${path}`)).default;
                this.textureSources[id].src = url;
                this.textureSources[id].onload = () => {
                    console.log(id + ' texture loaded')
                }
            } catch (error) {
                console.error(`Failed to load texture: ${id} from path: ${path}`);
            }
        }
    }

    /**
     * Turns off clipping. Enables clipping by default.
     */
    turnOffClipping() {
        this.clipping = false;
    }

    /**
     * Checks if an x, y position exists in rendering context.
     *
     * @param {number} x - The x-coordinate of the position.
     * @param {number} y - The y-coordinate of the position.
     * @return {boolean} Returns true if the position exists, false otherwise.
     */
    private posExists(x: number, y: number): boolean {
        return this.texturesMapping[`${x},${y}`] ? true : false;
    }

    private logRender(x: number, y: number) {
        
    }
    /**
     * Adds a texture to the list of textures.
     *
     * @param {string} textureID - The texture id to be added.
     * @param {number} x - The x-coordinate of the destination position.
     * @param {number} y - The y-coordinate of the destination position.
     */
    add(textureID: string, x: number, y: number) {
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
        
        const srcID = textureID.split('-')[0];
        try {
            
            const h = this.config.textures[srcID].objects[textureID].h;
            const w = this.config.textures[srcID].objects[textureID].w;
            // Clipping the positions to the closest units of x and y
            // and checking bounds
            let dx, dy;
            if (this.clipping) {
                dx = clipX(w, inBoundsX(w, x));
                dy = clipY(h, inBoundsY(h, y));
                if (this.posExists(dx, dy) && x < dx) dx = inBoundsX(w, dx - w)
                if (this.posExists(dx, dy) && y < dy) dy = inBoundsY(w, dy - h)
            } else {
                dx = inBoundsX(w, x);
                dy = inBoundsY(h, y);
            }
        
            const src = this.config.textures[srcID].id;
            const name = this.config.textures[srcID].objects[textureID].name
            const sx = this.config.textures[srcID].objects[textureID].sx;
            const sy = this.config.textures[srcID].objects[textureID].sy;
            // Log the position
            if (!this.posExists(dx, dy)) {
                console.log(`Rendering ${name} at x: ${dx}, y: ${dy}`);
            } else {
                console.log(`Rendered ${name} at x: ${dx}, y: ${dy}`);
            }
            // Store the texture by the x, y position
            this.texturesMapping[`${dx},${dy}`] = {
                src: src,
                name: name,
                sx: sx,
                sy: sy,
                dx: dx,
                dy: dy,
                w: w,
                h: h
            }

        } catch (error) {
            console.error(`Texture ID: ${textureID} could not found`);
        }
    }
    
    /**
     * Renders the textures on the canvas using the provided rendering context.
     *
     * @param {CanvasRenderingContext2D} ctx - The rendering context of the canvas.
     */
    render(ctx: CanvasRenderingContext2D) {
        for (const key in this.texturesMapping) {
            const texture = this.texturesMapping[key];
            ctx.drawImage(
                this.textureSources[texture.src],
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
}

export {
    TextureRenderer
}