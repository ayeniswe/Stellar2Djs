import './style.css';
import { useEffect } from 'react';
import { TilemapHook } from './hooks/type';
import { useTilemap } from './hooks/useTilemap';
import { useAppContext } from '../../context/appContext';
const Tilemap = () => {
    const { scene } = useAppContext();
    const {
      setTileset,
      setTilesetKey,
      setTilesBackground,
      getTilesets,
      showTileset,
      TILESET_KEY,
      EMPTY,
    }: TilemapHook = useTilemap();
    // This effect handles the initialization of the tileset chosen, set the background image of the tiles, and set the ready property of the editor input to receive input
    useEffect(() => {
      if (TILESET_KEY.value !== '') {
        scene!.attrs.input.ready = true;
        (async () => {
          await setTileset();
          setTilesBackground();
        })();
      }
    }, [TILESET_KEY.value, setTilesBackground, setTileset, scene]);
    return (
      <div id="Tilemap">
          <h4 className='Tilemap__select'>
            Select Tileset
            <select value={TILESET_KEY.value} onChange={e => setTilesetKey(e.target.value)}>
              <option value="" disabled>None</option>
              {getTilesets()}
            </select>
          </h4>
          {TILESET_KEY.value ?
          showTileset()
          :
          <h4 className='TilemapContent TilemapContent--empty'>
            No Tileset {`${EMPTY.value ? 'Available' : 'Selected'}`}
          </h4>
          }
      </div>
    );
}
export default Tilemap;