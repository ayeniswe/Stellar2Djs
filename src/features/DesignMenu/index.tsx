import { useEffect } from 'react';
import './styles/DesignMenu.css';
import { useDesign } from './hooks/useDesign';

const DesignMenu = () => {
    const { getCategories, getTilesets, setTileset, showTileset } = useDesign();

    useEffect(() => {
      getTilesets();
    },[]);

    return (
      <div id="DesignMenu">
        <h2 className='DesignMenu__title'>
          LEVEL EDITOR
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