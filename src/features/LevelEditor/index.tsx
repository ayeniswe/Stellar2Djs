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
      getCategories,
      getTilesets,
      setTileset,
      showTileset,
      togglePanel,
      setBackground,
      TILESET,
      PANEL,
    } = useEditor(editor);

    useEffect(() => {
      if (TILESET.value !== '') {
        editor.input.ready = true;
        getTilesets();
        (async () => {
         await setBackground();
        })();

      }
    },[TILESET.value]);

    return (
      <div id="LevelEditor">
        <h2 className='LevelEditor__title' onClick={() => togglePanel()}>
          LEVEL EDITOR
        </h2>
        {PANEL.value &&
        <>
          <h4 className='LevelEditor__select'>
            Select Tileset
            <select value={TILESET.value} className='LevelEditor__select__dropdown' onChange={e => setTileset(e.target.value)}>
              <option value="" disabled>None</option>
              {getCategories()}
            </select>
          </h4>
          {showTileset()}
          {TILESET.value && <LevelEditorControls editor={editor}/>}
        </>
        }
      </div>
    );
}

export default LevelEditorComp;