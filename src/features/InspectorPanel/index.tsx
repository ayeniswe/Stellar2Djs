import './style.css';
import { INSPECTOR } from './constants';
import React from 'react';

const InspectorPanel = () => (
  <div id={INSPECTOR.$}>
    <header className='panel-name'>
      Inspector Panel
    </header>
    <div className='object-name'>
      <header>
        Name
      </header>
      <div id={INSPECTOR.Name}>
        Default Object 1001
      </div>
    </div>
  </div>
);

export default InspectorPanel;
