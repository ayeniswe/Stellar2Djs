import { useInput } from './useInput';
import { useTexture } from '../../../libs/rendering';
/**
 * The hook is responsible for managing the scene behavior and provides a way to set and interact with the canvas brush.
 * @param ctx - The canvas rendering context
 */
const useScene = (ctx: CanvasRenderingContext2D | null) => {
    const renderer = useTexture(ctx!);
    const input = useInput(renderer);
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
            return input.input;
        },
        get textureSources() {
            return renderer.textureRenderer.textureSources;
        }
    }
    const initialize = async (): Promise<void> => {
        if (ctx) {
            await renderer.initialize();
            input.initialize();
        }
    }
    const clear = () => {
        input.removeAll();
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