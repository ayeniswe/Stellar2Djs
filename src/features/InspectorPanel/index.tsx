import './style.css';
import { INSPECTOR } from './constants';
import React from 'react';
import { usePanel } from './usePanel';

const InspectorPanel = () => {
  const { getObject } = usePanel();
  const { src, name } = getObject();

  return (
    <div id={INSPECTOR.$}>
      <header>
      Inspector Panel
      </header>
      <div>
        <label>
          Name
          <input id={INSPECTOR.Name} placeholder='None' title="object selected" value={name} disabled/>
        </label>
        <div className='object'>
          <img src={src}/>
        </div>
        <div className='attributes'>
          <label>
            Flip
            <input id={INSPECTOR.Name} placeholder='None' title="object selected" value={name} disabled/>
            <input id={INSPECTOR.Name} placeholder='None' title="object selected" value={name} disabled/>
          </label>
          <label>
            Flip
            <input id={INSPECTOR.Name} placeholder='None' title="object selected" value={name} disabled/>
          </label>
        </div>
      </div>
    </div>
  );
};

export default InspectorPanel;
