import './style.css';
import React, { useEffect } from 'react';
import AnimationPlayer from '../AnimationPlayer';
import Tilemap from '../Tilemap';
import { TOOLBAR } from './constants';
import { useAppContext } from '../../context/appContext';

const Toolbar = () => {
  const { toolbar } = useAppContext();
  useEffect(() => toolbar.initialize(), []);
  return (
    <div data-cy="toolbar" id={TOOLBAR.$} aria-keyshortcuts="t">
      <div data-cy="toolbar-handle" id={TOOLBAR.HANDLE}/>
      <div className="header">
        <button data-cy="animation" id={TOOLBAR.ANIMATION_PLAYER}
          aria-keyshortcuts="a" onClick={(e) => toolbar.openTab(e.currentTarget, <AnimationPlayer/>)}>
                    Animation Player
        </button>
        <button data-cy="tilemap" id={TOOLBAR.TILEMAP_EDITOR}
          aria-keyshortcuts="m" onClick={(e) => toolbar.openTab(e.currentTarget, <Tilemap/>)}>
                    Tilemap Editor
        </button>
      </div>
      <div className="content">
        {toolbar.attrs.tabContent}
      </div>
    </div>
  );
};

export default Toolbar;
export { TOOLBAR };
