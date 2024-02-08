import { useSignal } from '@preact/signals-react';
import { useInput } from './useInput';
import { useTexture } from '../../../libs/rendering';
import { Brush } from './type';
/**
 * The hook is responsible for managing the scene behavior and provides a way to set and interact with the canvas brush.
 * @param ctx - The canvas rendering context
 */
const useScene = (ctx: CanvasRenderingContext2D | null) => {
    const __brush = useSignal<Brush | null>(null);
    const __renderer = useTexture(ctx!);
    const __input = useInput(__renderer, __brush);
    const attrs = {
        get width() {
            if (!ctx) return -1;
            return ctx.canvas.width;
        },
        set width(value: number) {
            if (!ctx) return;
            ctx.canvas.width = value;
        },
        get height() {
            if (!ctx) return -1;
            return ctx.canvas.height;
        },
        set height(value: number) {
            if (!ctx) return;
            ctx.canvas.height = value;
        },
        get ctx() {
            return ctx;
        },
        get input() {
            return __input.input;
        },
        get brush() {
            return __brush.value;
        },
        set brush(value: Brush | null) {
            __brush.value = value;
        },
        get textureSources() {
            return __renderer.textureRenderer.textureSources;
        }
    }
    const initialize = async (): Promise<void> => {
        if (ctx) {
            await __renderer.initialize();
            __input.initialize();
        }
    }
    const clear = () => {
        __input.removeAll();
    }
    return {
        initialize,
        clear,
        attrs
    }
}
export {
    useScene
}