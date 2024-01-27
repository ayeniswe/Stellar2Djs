import { useEffect } from 'react';
import './style.css';
import { SceneEditor } from '../../libs/SceneEditor';
import { useEditor } from './hooks/useEditor';
import SceneEditorControls from './components/SceneEditorControls';

type Props = {
  editor: SceneEditor
}

const SceneEditorComp: React.FC<Props> = ({ editor }) => {

    const {
      setTileset,
      setTilesetKey,
      setTilesBackground,
      getTilesets,
      showTileset,
      toggleEditorTab,
      TILESET_KEY,
      EDITOR_TAB,
    } = useEditor(editor);

    // This effect handles the initialization of the tileset chosen, set the background image of the tiles, and set the ready property of the editor input to receive input
    useEffect(() => {
      if (TILESET_KEY.value !== '') {
        editor.input.ready = true;
        (async () => {
          await setTileset();
          setTilesBackground();
        })();
      }
    }, [TILESET_KEY.value, setTilesBackground, setTileset, editor.input]);

    return (
      <div id="SceneEditor">
        <h2 className='SceneEditor__title' onClick={() => toggleEditorTab()}>
          SCENE EDITOR
        </h2>
        {EDITOR_TAB.value &&
        <>
          <h4 className='SceneEditor__select'>
            Select Tileset
            <select value={TILESET_KEY.value} className='SceneEditor__select__dropdown' onChange={e => setTilesetKey(e.target.value)}>
              <option value="" disabled>None</option>
              {getTilesets()}
            </select>
          </h4>
          {showTileset()}
          {TILESET_KEY.value && <SceneEditorControls editor={editor}/>}
        </>
        }
      </div>
    );
}

export default SceneEditorComp;