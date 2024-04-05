import AnimationPlayer from '../../AnimationPlayer';
import { Bindings } from '../../../libs/input';
import { getHeight } from '../../../utils/styleProps';
import React from 'react';
import Tilemap from '../../Tilemap';
import { TOOLBAR } from '..';
import { ToolbarAttrs } from '.';

const input = (attrs: ToolbarAttrs) => {
  const bindings = Bindings.getInstance();
  const initialize = () => {
    bindings.addBinding(resizeToolbar, ['LeftButton'], ['mousedown'], false, TOOLBAR.HANDLE);
    bindings.addBinding(openAnimationPlayerTab, ['a'], 'keydown', false);
    bindings.addBinding(closeToolbar, ['t'], 'keydown', false);
    bindings.addBinding(openTilemapEditorTab, ['m'], 'keydown', false);
  };

  /**
   * Handles resizing the toolbar up and down
   */
  function resizeToolbar(e: MouseEvent) {
    const toolbar = document.getElementById(TOOLBAR.$)!;
    const currentY = e.clientY;
    const currentHeight = getHeight(toolbar).toNumber();
    document.onmousemove = () => {
      toolbar.style.height = `${currentHeight + -(e.clientY - currentY)}px`;
    };
    document.onmouseup = () => {
      document.onmousemove = null;
      document.onmouseup = null;
    };
  }

  /**
   * Handles opening the animation player tab
   *
   */
  function openAnimationPlayerTab() {
    if (attrs.tab) {
      attrs.tab.style.backgroundColor = '';
    }
    const tab = document.getElementById(TOOLBAR.ANIMATION_PLAYER);
        tab!.style.backgroundColor = 'var(--hover-color)';
        attrs.tabContent = <AnimationPlayer/>;
        attrs.tab = tab;
  }

  /**
   * Handles opening the tilemap editor tab
   *
   */
  function openTilemapEditorTab() {
    if (attrs.tab) {
      attrs.tab.style.backgroundColor = '';
    }
    const tab = document.getElementById(TOOLBAR.TILEMAP_EDITOR);
        tab!.style.backgroundColor = 'var(--hover-color)';
        attrs.tabContent = <Tilemap/>;
        attrs.tab = tab;
  }

  /**
   * Closes the toolbar
   *
   *  NOTE - height is reset to initial
   */
  function closeToolbar() {
    if (attrs.tab) {
      attrs.tab.style.backgroundColor = '';
    }
    attrs.tabContent = <div/>;
    attrs.tab = null;
  }

  return { initialize };
};

export { input };
