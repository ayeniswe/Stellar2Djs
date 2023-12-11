import { useEffect } from 'react';
import './DesignMenu.css';
import { useDesign } from './useDesign';

const DesignMenu = () => {
    const { getCategories, getTilesets, setTileset, showTileset, TILESET_VIEW } = useDesign();

    useEffect(() => {
      getTilesets();
    },[]);

    return (
      <div id="DesignMenu">
        <h2 className='DesignMenu__title'>
          LEVEL DESIGN
        </h2>
        <h4 className='DesignMenu__select'>
          Select Tileset
          <select className='DesignMenu__select__dropdown' onChange={e => setTileset(e.target.value)}>
            {getCategories()}
          </select>
        </h4>
        {showTileset()}
      </div>
    );
}

export default DesignMenu;