import { KMMapping } from '../../../libs/input';
import { useSignal } from '@preact/signals-react';
import { useInput } from './useInput';
import { useTextureRenderer } from '../../../libs/rendering';
import { Brush, Input } from './type';
/**
 * The hook is responsible for managing the scene behavior and provides a way to set and interact with the canvas brush.
 * 
 * @class
 */
const useScene = (ctx: CanvasRenderingContext2D, mapping: KMMapping, id?: string) =>{
    const __brush = useSignal<Brush | null>(null);
    const __renderer = useTextureRenderer(ctx);
    const __input = useInput(ctx, __renderer, mapping, __brush, id);
    const attrs = {
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
        await __renderer.initialize()
        await __input.initialize();
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