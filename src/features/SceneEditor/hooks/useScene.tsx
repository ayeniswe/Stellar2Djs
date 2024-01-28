import { KMMapping } from '../../../libs/input';
import { useSignal } from '@preact/signals-react';
import { useInput } from './useInput';
import { useTextureRenderer } from '../../../libs/rendering';
import { TextureRenderer } from '../../../libs/rendering/types';
import { Brush, Input } from './type';
/**
 * The hook is responsible for managing the scene behavior and provides a way to set and interact with the canvas brush.
 * 
 * @class
 */
const useScene = (ctx: CanvasRenderingContext2D, mapping: KMMapping, id?: string) =>{
    const __brush = useSignal<Brush | null>(null);
    const __renderer = useSignal<TextureRenderer>(useTextureRenderer(ctx));
    const __input = useSignal<Input>(useInput(ctx, __renderer.value, mapping, __brush, id));
    const attrs = {
        get input() {
            return __input.value.input;
        },
        get brush() {
            return __brush.value;
        },
        set brush(value: Brush | null) {
            __brush.value = value;
        },
        get textureSources() {
            return __renderer.value.textureRenderer.textureSources;
        }
    }
    const initialize = async (): Promise<void> => {
        await __renderer.value.initialize()
        await __input.value.initialize();
    }
    const clear = () => {
        __input.value.removeAll();
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