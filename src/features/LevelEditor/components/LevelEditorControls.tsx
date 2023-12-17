import '../styles/LevelEditor.css';
import trashcan from '../../../assets/images/icons/trashcan.svg';
import scissors from '../../../assets/images/icons/scissors.svg';
import dragpointer from '../../../assets/images/icons/dragpointer.svg';
import editpointer from '../../../assets/images/icons/editpointer.svg';
import { LevelEditor } from '../../../main/LevelEditor';
import { useControls } from '../hooks/useControls';
import ToggleIcon from '../../../components/ToggleIcon';
import { useEffect } from 'react';
import { effect } from '@preact/signals-react';

type Props = {
  editor: LevelEditor,
}

const LevelEditorControls: React.FC<Props> = ({ editor }) => {
    const {
      toggleTrashmode,
      toggleClippingMode,
      toggleDragMode,
      toggleEditMode,
      setEditMode,
      showDeleteConfirmation,
      clearCanvas,
    } = useControls(editor);

    useEffect(() => {
      setEditMode();
    },[]);

    return (
        <>
            {editor.input.trash &&
            <>
                {editor.input.safety ?
                <div className='LevelEditor__button LevelEditor__button--serious' onClick={() => showDeleteConfirmation()}>
                    Delete All
                </div>
                :
                <div className='LevelEditor__delete-confirmation'>
                    Are you sure? Action can't be UNDONE!
                    <span onClick={() => clearCanvas()} className='LevelEditor__button LevelEditor__button--serious'>Yes</span>
                </div>
                }
            </>
            }
            <div className='LevelEditor__controls'>
                <ToggleIcon
                    id='toggle-trash'
                    src={trashcan}
                    fn={toggleTrashmode}
                />
                <ToggleIcon
                    id='toggle-clipping'
                    src={scissors}
                    fn={toggleClippingMode}
                />
                <ToggleIcon
                    id='toggle-drag'
                    src={dragpointer}
                    fn={toggleDragMode}
                />
                <ToggleIcon
                    id='toggle-editing'
                    src={editpointer}
                    fn={toggleEditMode}
                />
            </div>
        </>
    );
}

export default LevelEditorControls;