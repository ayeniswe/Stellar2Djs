import { useSignal } from "@preact/signals-react";
import { Sprite } from "./type";
/**
 * The sprite animation currently being played and attributes
 */
const useSpriteAnimation = () => {
    const NAME = useSignal("SpriteAnimation-1");
    const CREATING = useSignal(true);
    const SPRITES = useSignal<Sprite[]>([]);
    const CURRENT_FRAME = useSignal(0);
    const SPRITE = useSignal<Sprite | null>(null);
    const FRAMES = useSignal(SPRITE.value?.frames || []);
    const changeSprite = (value: number) => {
        SPRITE.value = SPRITES.value[value];
        // TODO: better performance w/ linked list
        FRAMES.value = [ ...SPRITE.value.frames ];
    }
    const changeName = (name: string) => {
        NAME.value = name;
    }
    const showSprites = () => {
        return SPRITES.value.map((sprite, index) => (
            <option
                key={index}
                value={sprite.id}
            >
                {sprite.name}
            </option>
        ))
    }
    const loadFrame = (files: FileList) => {
        for (let index = 0; index < files.length; index++) {
            const reader = new FileReader;
            const file = files[index];
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target!.result as string;
                // TODO: better performance w/ linked list
                FRAMES.value = [...FRAMES.value, img];
            }
        }
    }
    const removeFrame = (index: number) => {;
        FRAMES.value.splice(index, 1);
        // TODO: better performance w/ linked list
        FRAMES.value = [ ...FRAMES.value ];
    }
    const saveAnimation = () => {
        const sprite = {
            name: SPRITE.value?.name || NAME.value,
            frames: FRAMES.value,
            id: Number(SPRITE.value?.id) || 0
        }
        if (CREATING.value) {
            sprite.id = SPRITES.value.length > 0 ? SPRITES.value.length : 0;
            // TODO: better performance w/ linked list
            SPRITES.value = [ ...SPRITES.value, sprite ];
            CREATING.value = false;
            changeSprite(sprite.id);
        } else {
            // TODO: better performance w/ linked list
            SPRITES.value[sprite.id] = sprite;
        }
    }
    const createAnimation = () => {
        FRAMES.value = [];
        SPRITE.value = null;
        CREATING.value = true;
    }
    return {
        changeName,
        changeSprite,
        createAnimation,
        saveAnimation,
        removeFrame,
        loadFrame,
        showSprites,
        SPRITE,
        SPRITES,
        CREATING,
        CURRENT_FRAME,
        FRAMES,
        NAME
    }
}
export default useSpriteAnimation