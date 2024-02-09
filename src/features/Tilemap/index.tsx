import './style.css';
import { useEffect } from 'react';
import { TilemapHook } from './hooks/type';
import { useTilemap } from './hooks/useTilemap';
import { useAppContext } from '../../context/appContext';
import { TILEMAP } from './constants';
const Tilemap = () => {
    const { scene } = useAppContext();
    const {
      setTileset,
      setTilesetKey,
      setTilesBackground,
      getTilesets,
      showTileset,
      tileset_key,
      empty,
    }: TilemapHook = useTilemap();
    // This effect handles the initialization of the tileset chosen, set the background image of the tiles, and set the ready property of the editor input to receive input
    useEffect(() => {
      if (tileset_key.value !== '') {
        scene!.attrs.input.ready = true;
        (async () => {
          await setTileset();
          setTilesBackground();
        })();
      }
    }, [tileset_key.value, setTilesBackground, setTileset, scene]);
    return (
      <div data-cy="tilemap-editor" className="Tilemap">
          <h4 className='dropdown'>
            Select Tileset
            <select data-cy="tileset-select" value={tileset_key.value} onChange={e => setTilesetKey(e.target.value)}>
              <option value="" disabled>None</option>
              {getTilesets()}
            </select>
          </h4>
          <div className="tileset">
            {tileset_key.value ?
            showTileset()
            :
            <h2 className='empty'>
              No Tileset {`${empty.value ? 'Available' : 'Selected'}`}
            </h2>
            }
          </div>
      </div>
    );
}
export default Tilemap;
export {
  TILEMAP
}