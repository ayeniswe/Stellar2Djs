import './style.css';
import { INSPECTOR } from './constants';
import React from 'react';
import { usePanel } from './usePanel';

const InspectorPanel = () => {
  const { getObject } = usePanel();
  const {
    src,
    name,
    yPos,
    xPos,
    width,
    height,
    layer,
    flipX,
    flipY
  } = getObject();

  return (
    <div id={INSPECTOR.$}>
      <header>
      Inspector Panel
      </header>
      <div className='attributes'>
        <input className='name' placeholder='None' title="object name" value={name} disabled/>
        <table>
          <tbody>
            <tr>
              <td>Flip</td>
              <td className='content'>
                <div className='tight-group'>
                  <label title='x-axis'>
                    X
                    <input type='checkbox' checked={flipX} onClick={() => console.log('Click me')}/>
                  </label>
                  <label title='y-axis'>
                    Y
                    <input type='checkbox' checked={flipY}/>
                  </label>
                </div>
              </td>
            </tr>
            <tr>
              <td>Position</td>
              <td className='content'>
                <div className='wide-group values'>
                  <span>
                    x:<input value={xPos} disabled/>
                  </span>
                  <span>
                    y:<input value={yPos} disabled/>
                  </span>
                </div>
              </td>
            </tr>
            <tr>
              <td>Size</td>
              <td className='content'>
                <div className='wide-group values'>
                  <span>
                    w:<input value={width} disabled/>
                  </span>
                  <span>
                    h:<input value={height} disabled/>
                  </span>
                </div>
              </td>
            </tr>
            <tr>
              <td>Layer</td>
              <td className='content'>
                <div className='values'>
                  <input value={layer} disabled/>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InspectorPanel;
