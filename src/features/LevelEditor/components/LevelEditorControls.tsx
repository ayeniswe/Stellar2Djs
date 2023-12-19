import '../styles/LevelEditor.css';
import trashcan from '../../../assets/images/icons/trashcan.svg';
import scissors from '../../../assets/images/icons/scissors.svg';
import dragpointer from '../../../assets/images/icons/dragpointer.svg';
import editpointer from '../../../assets/images/icons/editpointer.svg';
import { LevelEditor } from '../../../main/LevelEditor';
import { useControls } from '../hooks/useControls';
import ToggleIcon from '../../../components/ToggleIcon';

type Props = {
  editor: LevelEditor,
}

const LevelEditorControls: React.FC<Props> = ({ editor }) => {
    const {
      toggleTrashmode,
      toggleClippingMode,
      toggleDragMode,
      toggleEditMode,
      showDeleteConfirmation,
      clearCanvas,
    } = useControls(editor);

    return (
        <>
            {editor.input.trash &&
            <>
                {editor.input.safety ?
                <div role='button' aria-label='delete all' className='LevelEditor__button LevelEditor__button--serious' onClick={() => showDeleteConfirmation()}>
                    Delete All
                </div>
                :
                <div role="dialog" className='LevelEditor__delete-confirmation' aria-label='delete all confirmation message'>
                    Are you sure? Action can't be UNDONE!
                    <div role='button' aria-label="yes to delete all confirmation message" onClick={() => clearCanvas()} className='LevelEditor__button LevelEditor__button--serious'>Yes</div>
                </div>
                }
            </>
            }
            <div className='LevelEditor__controls'>
                <ToggleIcon
                    id='toggle-trash'
                    src={trashcan}
                    fn={toggleTrashmode}
                    alt='trashcan'
                    ariaLabel='toggle trash mode'
                />
                <ToggleIcon
                    id='toggle-clipping'
                    src={scissors}
                    fn={toggleClippingMode}
                    alt='scissors'
                    ariaLabel='toggle clipping mode'
                />
                <ToggleIcon
                    id='toggle-drag'
                    src={dragpointer}
                    fn={toggleDragMode}
                    alt='drag pointer'
                    ariaLabel='toggle drag mode'
                />
                <ToggleIcon
                    id='toggle-editing'
                    src={editpointer}
                    fn={toggleEditMode}
                    width={6}
                    alt='pencil'
                    ariaLabel='toggle editing mode'
                />
            </div>
        </>
    );
}

export default LevelEditorControls;