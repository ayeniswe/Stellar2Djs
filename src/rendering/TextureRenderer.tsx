import tiles from '../assets/tiles/main.png';
import player from '../assets/character/player.png';
import { Texture, TextureAtlasMetadata, TextureSources } from '../rendering/types';
import { Signal } from '@preact/signals-react';

class TextureRenderer {
    private ctx: CanvasRenderingContext2D;
    private textureSources: TextureSources = {}
    private textures: Texture[] = [];
    public texturesToLoad: Signal<number> = new Signal();

    constructor(ctx: CanvasRenderingContext2D) {
        this.addSource('tiles', tiles);
        this.addSource('player', player);
        this.texturesToLoad.value = Object.keys(this.textureSources).length;
        this.ctx = ctx;
    }

    /**
     * Adds a new source to the textureSources object.
     *
     * @param {string} name - The name of the source.
     * @param {string} source - The URL of the image source.
     */
    private addSource(name: string, source: string) {
        this.textureSources = {
            ...this.textureSources,
            [name]: new Image(),
        };
        this.textureSources[name].src = source;
        this.textureSources[name].onload = () => {
            console.log(name + ' texture loaded')
            this.texturesToLoad.value--;
        }
    }

    /**
     * Adds a texture to the list of textures.
     *
     * @param {TextureAtlasMetadata} texture - The texture to be added.
     * @param {number} dx - The x-coordinate of the destination position.
     * @param {number} dy - The y-coordinate of the destination position.
     */
    add(texture: TextureAtlasMetadata, dx: number, dy: number) {
        const inBoundsY = (h: number, y: number) => {
            return y >= this.ctx.canvas.height ? this.ctx.canvas.height - h : y;
        }
        const inBoundsX = (w: number, x: number) => {
            return x >= this.ctx.canvas.width ? this.ctx.canvas.width - w : x;
        }
        this.textures.push({
            src: texture.src,
            name: texture.name,
            sx: texture.sx,
            sy: texture.sy,
            dx: inBoundsX(texture.w, dx),
            dy: inBoundsY(texture.h, dy),
            w: texture.w,
            h: texture.h
        });
    }
    
    /**
     * Renders the textures on the canvas using the provided rendering context.
     *
     * @param {CanvasRenderingContext2D} ctx - The rendering context of the canvas.
     */
    render(ctx: CanvasRenderingContext2D) {
        for (let index = 0; index < this.textures.length; index++) {
            const texture = this.textures[index];
            const name = texture.name;
            const src = texture.src;
            const sx = texture.sx;
            const sy = texture.sy;
            const w = texture.w;
            const h = texture.h;
            const dx = texture.dx;
            const dy = texture.dy;
            
            ctx.drawImage(this.textureSources[src], sx, sy, w, h, dx, dy, w, h);
            console.log(`Rendering ${name} at x: ${dx}, y: ${dy}`);
        }
    }
}

export {
    TextureRenderer
}