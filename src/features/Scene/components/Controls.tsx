import '../style.css';
import trashcan from '../../../assets/images/icons/trashcan.svg';
import scissors from '../../../assets/images/icons/scissors.svg';
import dragpointer from '../../../assets/images/icons/dragpointer.svg';
import editpointer from '../../../assets/images/icons/editpointer.svg';
import { useControls } from '../hooks/useControls';
import ToggleIcon from '../../../components/ToggleIcon';
import { Control } from '../hooks/type';
import { useAppContext } from '../../../context/appContext';
const Controls = () => {
    const { scene } = useAppContext();
    const {
      toggleTrashMode,
      toggleClippingMode,
      toggleDragMode,
      toggleEditingMode,
      showDeleteConfirmation,
    }: Control = useControls();
    return (
        <>
            {scene.attrs.input.trash &&
            <>
                {scene.attrs.input.safety ?
                <button aria-label='clear canvas' className='Scene__button Scene__button--serious' onClick={() => showDeleteConfirmation()}>
                    Delete All
                </button>
                :
                <dialog className='Scene__delete-confirmation' aria-label='confirmation to clear canvas' open>
                    Are you sure? Action can't be UNDONE!
                    <div role='button' aria-label="yes to delete all confirmation message" onClick={() => scene.clear()} className='Scene__button Scene__button--serious'>Yes</div>
                </dialog>
                }
            </>
            }
            <div className='Scene__controls'>
                <ToggleIcon
                    name='trash mode'
                    src={trashcan}
                    fn={toggleTrashMode}
                    keyShortcuts='Delete'
                />
                <ToggleIcon
                    name='clipping mode'
                    src={scissors}
                    fn={toggleClippingMode}
                    keyShortcuts='C'
                />
                <ToggleIcon
                    name='drag mode'
                    src={dragpointer}
                    fn={toggleDragMode}
                    keyShortcuts='D'
                />
                <ToggleIcon
                    name='editing mode'
                    src={editpointer}
                    fn={toggleEditingMode}
                    keyShortcuts='E'
                />
            </div>
        </>
    );
}
export default Controls;