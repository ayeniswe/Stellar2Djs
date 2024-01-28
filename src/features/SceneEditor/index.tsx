import { useEffect } from 'react';
import './style.css';
import { useEditor } from './hooks/useEditor';
import { useScene } from './hooks/useScene';
import { KMMapping } from '../../libs/input';
import Controls from './components/Controls';
type Props = {
  ctx: CanvasRenderingContext2D;
  mapping: KMMapping;
  id?: string;
}
const Scene: React.FC<Props> = ({ ctx, mapping, id }) => {
    const scene = useScene(ctx, mapping, id);
    const {
      setTileset,
      setTilesetKey,
      setTilesBackground,
      getTilesets,
      showTileset,
      toggleEditorTab,
      TILESET_KEY,
      EDITOR_TAB,
    } = useEditor(scene.attrs);
    useEffect(() => {
      (async () => {
        await scene.initialize();
      })();
    },[]);
    // This effect handles the initialization of the tileset chosen, set the background image of the tiles, and set the ready property of the editor input to receive input
    useEffect(() => {
      if (TILESET_KEY.value !== '') {
        scene.attrs.input.ready = true;
        (async () => {
          await setTileset();
          setTilesBackground();
        })();
      }
    }, [TILESET_KEY.value, setTilesBackground, setTileset, scene.attrs.input.ready]);
    return (
      <div id="Scene">
        <h2 className='Scene__title' onClick={() => toggleEditorTab()}>
          SCENE EDITOR
        </h2>
        {EDITOR_TAB.value &&
        <>
          <h4 className='Scene__select'>
            Select Tileset
            <select value={TILESET_KEY.value} className='Scene__select__dropdown' onChange={e => setTilesetKey(e.target.value)}>
              <option value="" disabled>None</option>
              {getTilesets()}
            </select>
          </h4>
          {showTileset()}
          {TILESET_KEY.value && <Controls scene={scene}/>}
        </>
        }
      </div>
    );
}
export default Scene;