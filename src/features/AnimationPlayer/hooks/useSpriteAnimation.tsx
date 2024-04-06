import React from 'react';
import { Sprite } from './type';
import { useSignal } from '@preact/signals-react';

/**
 * The sprite animation currently being played and attributes
 */
const useSpriteAnimation = () => {
  const spriteName = useSignal('SpriteAnimation-1');
  const creating = useSignal(true);
  const sprites = useSignal<Sprite[]>([]);
  const current_frame = useSignal(0);
  const sprite = useSignal<Sprite | null>(null);
  const frames = useSignal(sprite.value?.frames || []);

  function changeSprite(value: number) {
    sprite.value = sprites.value[value];
    // TODO: better performance w/ linked list
    frames.value = [...sprite.value.frames];
  }

  function changeName(name: string) {
    spriteName.value = name;
  }

  function showSprites() {
    return sprites.value.map((sp, index) => (
      <option
        key={index}
        value={sp.id}
      >
        {sp.name}
      </option>
    ));
  }

  function loadFrame(files: FileList) {
    for (let index = 0; index < files.length; index++) {
      const reader = new FileReader;
      const img = new Image();
      const file = files[index];
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        img.src = e.target?.result as string;
        img.onload = () => {
          frames.value = [
            ...frames.value,
            {
              h: img.height,
              w: img.width,
              src: img.src
            }
          ];
        };
      };
    }
  }

  function removeFrame(index: number) {
    frames.value.splice(index, 1);
    // TODO: better performance w/ linked list
    frames.value = [...frames.value];
  }

  function saveAnimation() {
    const currentSprite = {
      name: sprite.value?.name || spriteName.value,
      frames: frames.value,
      id: Number(sprite.value?.id) || 0
    };
    if (creating.value) {
      currentSprite.id = sprites.value.length > 0
        ? sprites.value.length
        : 0;
      // TODO: better performance w/ linked list
      sprites.value = [...sprites.value, currentSprite];
      creating.value = false;
      changeSprite(currentSprite.id);
    }
    else {
      // TODO: better performance w/ linked list
      sprites.value[currentSprite.id] = currentSprite;
    }
  }

  function createAnimation() {
    frames.value = [];
    sprite.value = null;
    creating.value = true;
  }

  function handleSpriteDragDrop(e: React.DragEvent<HTMLImageElement>) {
    e.dataTransfer.setData('application/sprite', JSON.stringify({ frames: frames.value }));
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
  };
};

export default useSpriteAnimation;
