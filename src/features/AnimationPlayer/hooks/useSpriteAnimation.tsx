import { useSignal } from "@preact/signals-react";
import { Sprite } from "./type";
/**
 * The sprite animation currently being played and attributes
 */
const useSpriteAnimation = () => {
    const spriteName = useSignal("SpriteAnimation-1");
    const creating = useSignal(true);
    const sprites = useSignal<Sprite[]>([]);
    const current_frame = useSignal(0);
    const sprite = useSignal<Sprite | null>(null);
    const frames = useSignal(sprite.value?.frames || []);
    const changeSprite = (value: number) => {
        sprite.value = sprites.value[value];
        // TODO: better performance w/ linked list
        frames.value = [ ...sprite.value.frames ];
    }
    const changeName = (name: string) => {
        spriteName.value = name;
    }
    const showSprites = () => {
        return sprites.value.map((sprite, index) => (
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
            const img = new Image();
            const file = files[index];
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                img.src = e.target?.result as string;
                img.onload = () => {
                    frames.value = [...frames.value, { 
                        h: img.height,
                        w: img.width,
                        src: img.src
                    }];
                };
            }
        }
    }
    const removeFrame = (index: number) => {;
        frames.value.splice(index, 1);
        // TODO: better performance w/ linked list
        frames.value = [ ...frames.value ];
    }
    const saveAnimation = () => {
        const currentSprite = {
            name: sprite.value?.name || spriteName.value,
            frames: frames.value,
            id: Number(sprite.value?.id) || 0
        }
        if (creating.value) {
            currentSprite.id = sprites.value.length > 0 ? sprites.value.length : 0;
            // TODO: better performance w/ linked list
            sprites.value = [ ...sprites.value, currentSprite ];
            creating.value = false;
            changeSprite(currentSprite.id);
        } else {
            // TODO: better performance w/ linked list
            sprites.value[currentSprite.id] = currentSprite;
        }
    }
    const createAnimation = () => {
        frames.value = [];
        sprite.value = null;
        creating.value = true;
    }
    const handleSpriteDragDrop = (e: React.DragEvent<HTMLImageElement>) => {
        e.dataTransfer.setData("application/sprite", JSON.stringify({
            frames: frames.value
        }));
    }
    return {
        changeName,
        changeSprite,
        handleSpriteDragDrop,
        createAnimation,
        saveAnimation,
        removeFrame,
        loadFrame,
        showSprites,
        sprite,
        sprites,
        creating,
        current_frame,
        frames,
        spriteName
    }
}
export default useSpriteAnimation