import './style.css';
import { INSPECTOR } from './constants';
import React from 'react';
import { usePanel } from './usePanel';

const InspectorPanel = () => {
  const { getObjectName } = usePanel();

  return (
    <div id={INSPECTOR.$}>
      <header className='panel-name'>
      Inspector Panel
      </header>
      <div className='object-name'>
        <header>
        Name
        </header>
        <div id={INSPECTOR.Name}>
          {getObjectName()}
        </div>
      </div>
    </div>
  );
};

export default InspectorPanel;
