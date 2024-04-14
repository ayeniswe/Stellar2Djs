import './style.css';
import { INSPECTOR } from './constants';
import React from 'react';
import { usePanel } from './usePanel';

const InspectorPanel = () => {
  const { getObject, flipObject } = usePanel();
  const {
    src,
    name,
    posY,
    posX,
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
                    <input type='checkbox' checked={flipX}
                      onChange={(e) => flipObject(true, false)}/>
                  </label>
                  <label title='y-axis'>
                    Y
                    <input type='checkbox' checked={flipY}
                      onChange={(e) => flipObject(false, true)}/>
                  </label>
                </div>
              </td>
            </tr>
            <tr>
              <td>Position</td>
              <td className='content'>
                <div className='wide-group values'>
                  <span>
                    x:<input value={posX} disabled/>
                  </span>
                  <span>
                    y:<input value={posY} disabled/>
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
            <tr>
              <td>Angle</td>
              <td className='content'>
                <div className='values'>
                  <input value={`0${ String.fromCharCode(177)}`} disabled/>
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
