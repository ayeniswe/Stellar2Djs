import { Brush, Input } from './type';
import { Config, Texture } from '../../../libs/rendering';
import { Bindings } from '../../../libs/input';
import configuration from '../../../data/test-config.json';
import { iconEffects } from '../../../libs/effects';
import { SCENE } from '..';
import { useSignal } from '@preact/signals-react';

/**
 * The hook is responsible for managing
 * the scene user interaction and keybindings and
 * provides a way to set and interact with the selected brush.
 *
 * @param renderer - The texture renderer
 * @param brush - The selected brush
 *
 */
const useInput = (renderer: Texture) => {
  const config: Config = configuration;
  const editable = useSignal(false);
  const drag = useSignal(false);
  const safety = useSignal(true);
  const trash = useSignal(false);
  const clip = useSignal(false);
  const ready = useSignal(false);
  const brush = useSignal<Brush | null>(null);
  const { applyDragEffect, applyTrashEffect, applyClippingEffect, applyEditingEffect } = iconEffects();
  const input = {
    get editable() {
      return editable.value;
    },
    set editable(value: boolean) {
      editable.value = value;
    },
    get clip() {
      return clip.value;
    },
    set clip(value: boolean) {
      clip.value = value;
    },
    get trash() {
      return trash.value;
    },
    set trash(value: boolean) {
      trash.value = value;
    },
    get ready() {
      return ready.value;
    },
    set ready(value: boolean) {
      ready.value = value;
    },
    get safety() {
      return safety.value;
    },
    set safety(value: boolean) {
      safety.value = value;
    },
    get drag() {
      return drag.value;
    },
    set drag(value: boolean) {
      drag.value = value;
    },
    get brush() {
      return brush.value;
    },
    set brush(value: Brush | null) {
      brush.value = value;
    }
  };

  function initialize(this: any): void {
    const bindings = Bindings.getInstance();
    bindings.addBinding(handleDropSprite.bind(this), [], 'drop', false, SCENE.CANVAS);
    bindings.addBinding(handleBrush.bind(this), [], 'mousemove', false, SCENE.CANVAS);
    bindings.addBinding(handleDrawing.bind(this), ['LeftButton'], ['mousedown', 'mousemove'], false, SCENE.CANVAS);
    bindings.addBinding(toggleClipMode.bind(this), ['c'], 'keydown', true);
    bindings.addBinding(toggleDragMode.bind(this), ['d'], 'keydown', true);
    bindings.addBinding(toggleEditMode.bind(this), ['e'], 'keydown', true);
    bindings.addBinding(toggleTrashMode.bind(this), ['Delete'], 'keydown', true);
    bindings.addBinding(clearCanvas.bind(this), ['Control', 'a'], 'keydown', true);
    bindings.addBinding(handleUndo.bind(this), ['Control', 'z'], 'keydown', false);
  }

  function removeAll() {
    renderer.removeAllTexture();
  }

  /**
   * Handles the ability to undo actions, such as adding a tile onto the scene.
   *
   * NOTE: This method is only available if the scene is ready.
   *
   * NOTE: The method does not allow redo, such as
   * undoing a previous undo action.
   */
  function handleUndo(): void {
    renderer.undoRevision();
    renderer.render();
  }

  /**
   * Handles the constant creation of a div to
   * create a brush effect.
   */
  function handleBrush(event: MouseEvent): void {
    if (!brush.value) return;
    const brushElement = document.getElementById(SCENE.BRUSH)!;
    if (editable.value) {
      const { w, h } = brush.value.object;
      brushElement.style.left = `${event.clientX}px`;
      brushElement.style.top = `${event.clientY}px`;
      brushElement.style.display = 'flex';
      brushElement.style.width = `${w}px`;
      brushElement.style.height = `${h}px`;
    }
    else {
      brushElement.style.display = 'none';
    }
  }

  /**
   * Handles the drawing action in the level scene based on mouse events.
   * If the scene is in `trash` mode, it removes an element at the specified
   * position.
   * If the scene is in `selection` mode "when edit it turned off", it
   * allows the selection of an element and drop it at the specified position.
   * If the scene is in `drag` mode, it rapidly adds an element
   * at the specified position.
   * @param {MouseEvent} event - The mouse event object.
   *
   * NOTE: This method is only available if the scene is ready.
   */
  function handleDrawing(event: MouseEvent): void {
    if (!editable.value && !trash.value) {
      // Select texture
      renderer.selectTexture(event.offsetX, event.offsetY, 1);
    }
    else {
      if (!ready.value || !brush.value || !drag.value && event.type === 'mousemove') return;
      /*
       * TODO: make more dynamic way to do this
       * Get brush src image tilesheet data
       */
      const { id, object } = brush.value!;
      const { name, h, w, sx, sy } = object;
      const src = config.textures['tilesets'][id.split('-')[0]].name;
      // Remove or add a texture
      if (trash.value) {
        renderer.removeTexture(event.offsetX, event.offsetY);
      }
      else {
        renderer.addTexture(src, name, clip.value, event.offsetX, event.offsetY, w, h, sx, sy);
      }
    }
    renderer.render();
  }

  /**
   * Handles the dropping of a sprite onto the scene.
   *
   */
  function handleDropSprite(e: DragEvent): void {
    e.preventDefault();
    const { frames } = JSON.parse(e.dataTransfer!.getData('application/sprite'));
    renderer.addTexture(frames[0].src, '', clip.value, e.offsetX, e.offsetY, frames[0].w, frames[0].h);
    renderer.render();
  }

  /*
   * *****************************************
   *        TOGGLE HANDLERS SECTION
   * *****************************************
   * The handlers below are used
   * to toggle the state of the scene
   * modes and apply/remove effects respectively
   *
   * NOTE: These methods are only available if
   * the scene is ready
   * *****************************************
   */
  function toggleTrashMode() {
    const button = document.getElementById(SCENE.TRASH);
    if (!button) return;
    if (trash.value) {
      trash.value = false;
      applyTrashEffect(button, false);
    }
    else {
      trash.value = true;
      applyTrashEffect(button);
    }
  }

  function toggleEditMode() {
    const button = document.getElementById(SCENE.EDIT);
    if (!ready.value || !button) return;
    if (editable.value) {
      editable.value = false;
      applyEditingEffect(button, false);
    }
    else {
      editable.value = true;
      applyEditingEffect(button);
    }
  }

  function toggleClipMode() {
    const button = document.getElementById(SCENE.CLIP);
    if (!button) return;
    if (clip.value) {
      clip.value = false;
      applyClippingEffect(button, false);
    }
    else {
      clip.value = true;
      applyClippingEffect(button);
    }
  }

  function toggleDragMode() {
    const button = document.getElementById(SCENE.DRAG);
    if (!ready.value || !button) return;
    if (drag.value) {
      drag.value = false;
      applyDragEffect(button, false);
    }
    else {
      drag.value = true;
      applyDragEffect(button);
    }
  }

  /**
   * Handles the clearing of the entire canvas in the scene.
   * The safety pin is turned off for 3 seconds.
   * After 3 seconds, the safety pin is turned back
   * on to prevent serious actions.
   *
   * NOTE: This method is only available if the editor is ready.
   */
  function clearCanvas() {
    toggleTrashMode();
    safety.value = false;
    setTimeout(() => {
      toggleTrashMode();
      safety.value = true;
    }, 3000);
  }

  return {
    input,
    removeAll,
    initialize
  };
};

export { useInput };
