import { useEffect } from 'react';
import './styles/LevelEditor.css';
import { LevelEditor } from '../../main/LevelEditor';
import { useEditor } from './hooks/useEditor';
import LevelEditorControls from './components/LevelEditorControls';

type Props = {
  editor: LevelEditor
}

const LevelEditorComp: React.FC<Props> = ({ editor }) => {

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
      <div id="LevelEditor">
        <h2 className='LevelEditor__title' onClick={() => toggleEditorTab()}>
          LEVEL EDITOR
        </h2>
        {EDITOR_TAB.value &&
        <>
          <h4 className='LevelEditor__select'>
            Select Tileset
            <select value={TILESET_KEY.value} className='LevelEditor__select__dropdown' onChange={e => setTilesetKey(e.target.value)}>
              <option value="" disabled>None</option>
              {getTilesets()}
            </select>
          </h4>
          {showTileset()}
          {TILESET_KEY.value && <LevelEditorControls editor={editor}/>}
        </>
        }
      </div>
    );
}

export default LevelEditorComp;