import { useEffect } from 'react';
import './styles/LevelEditor.css';
import { LevelEditor } from '../../main/LevelEditor';
import { useEditor } from './hooks/useEditor';
import trashcan from '../../assets/images/trashcan.svg';

type Props = {
  editor: LevelEditor
}
const LevelEditorComp: React.FC<Props> = ({ editor }) => {
    const {
      getCategories,
      getTilesets,
      setTileset,
      showTileset,
      toggleTrashmode,
    } = useEditor(editor);

    useEffect(() => {
      getTilesets();
    },[editor.input.trash]);

    return (
      <div id="LevelEditor">
        <h2 className='LevelEditor__title'>
          LEVEL EDITOR
        </h2>
        <h4 className='LevelEditor__select'>
          Select Tileset
          <select className='LevelEditor__select__dropdown' onChange={e => setTileset(e.target.value)}>
            {getCategories()}
          </select>
        </h4>
        {showTileset()}
        <div className='LevelEditor__controls'>
          <div id='trashcan-editor-title' className='LevelEditor__controls__title'>
            {editor.input.trash ? 'on' : 'off'}
          </div>
          <img id='trashcan-editor' className='LevelEditor__controls__trashcan' src={trashcan} onClick={() => toggleTrashmode()}/>
        </div>
      </div>
    );
}

export default LevelEditorComp;