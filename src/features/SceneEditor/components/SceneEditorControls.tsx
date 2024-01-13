import '../styles/SceneEditor.css';
import trashcan from '../../../assets/images/icons/trashcan.svg';
import scissors from '../../../assets/images/icons/scissors.svg';
import dragpointer from '../../../assets/images/icons/dragpointer.svg';
import editpointer from '../../../assets/images/icons/editpointer.svg';
import { SceneEditor } from '../../../libs/SceneEditor';
import { useControls } from '../hooks/useControls';
import ToggleIcon from '../../../components/ToggleIcon';

type Props = {
  editor: SceneEditor,
}

const SceneEditorControls: React.FC<Props> = ({ editor }) => {
    const {
      toggleTrashMode,
      toggleClippingMode,
      toggleDragMode,
      toggleEditingMode,
      showDeleteConfirmation,
      clearCanvas,
    } = useControls(editor);

    return (
        <>
            {editor.input.trash &&
            <>
                {editor.input.safety ?
                <div role='button' aria-label='delete all placed tiles in canvas' className='SceneEditor__button SceneEditor__button--serious' onClick={() => showDeleteConfirmation()}>
                    Delete All
                </div>
                :
                <div role="dialog" className='SceneEditor__delete-confirmation' aria-label='confirmation message to delete all placed tiles in canvas'>
                    Are you sure? Action can't be UNDONE!
                    <div role='button' aria-label="yes to delete all confirmation message" onClick={() => clearCanvas()} className='SceneEditor__button SceneEditor__button--serious'>Yes</div>
                </div>
                }
            </>
            }
            <div className='SceneEditor__controls'>
                <ToggleIcon
                    name='trash'
                    src={trashcan}
                    fn={toggleTrashMode}
                    alt='trashcan'
                    title='trash mode'
                    keyShortcuts='Delete'
                />
                <ToggleIcon
                    name='clipping'
                    src={scissors}
                    fn={toggleClippingMode}
                    alt='scissors'
                    keyShortcuts='C'
                    title='clipping mode'
                />
                <ToggleIcon
                    name='drag'
                    src={dragpointer}
                    fn={toggleDragMode}
                    alt='drag pointer'
                    keyShortcuts='D'
                    title='drag mode'
                />
                <ToggleIcon
                    name='editing'
                    src={editpointer}
                    fn={toggleEditingMode}
                    width={6}
                    alt='pencil'
                    keyShortcuts='E'
                    title='editing mode'
                />
            </div>
        </>
    );
}

export default SceneEditorControls;