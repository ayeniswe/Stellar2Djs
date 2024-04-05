import '../style.css';
import { Control } from '../hooks/type';
import dragpointer from '../../../assets/images/icons/dragpointer.svg';
import editpointer from '../../../assets/images/icons/editpointer.png';
import React from 'react';
import { SCENE } from '..';
import scissors from '../../../assets/images/icons/scissors.svg';
import ToggleIcon from '../../../components/ToggleIcon';
import trashcan from '../../../assets/images/icons/trashcan.svg';
import { useAppContext } from '../../../context/appContext';
import { useControls } from '../hooks/useControls';

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
    <div className='SceneControls'>
      {scene.attrs.input.trash &&
            <>
              {scene.attrs.input.safety ?
                <button title= "clear scene" data-cy='scene-clear' aria-label='clear canvas'
                  className="button" onClick={() => showDeleteConfirmation()}>
                    X
                </button>
                :
                <dialog data-cy='scene-clear-confirmation'
                  className='dialog' aria-label='confirmation to clear canvas' open>
                    This action will clear the ENTIRE scene.
                  <br/>
                    Click &quotYes&quot to continue
                  <button data-cy='scene-clear' aria-label="yes to delete all confirmation message"
                    onClick={() => scene.clear()} className="button">Yes</button>
                </dialog>
              }
            </>
      }
      <ToggleIcon
        name={SCENE.TRASH}
        src={trashcan}
        fn={toggleTrashMode}
        keyShortcuts='Delete'
        title='trash mode'
        cy='scene-trash'
      />
      <ToggleIcon
        name={SCENE.CLIP}
        src={scissors}
        fn={toggleClippingMode}
        keyShortcuts='c'
        title='clipping mode'
        cy='scene-clip'
      />
      <ToggleIcon
        name={SCENE.DRAG}
        src={dragpointer}
        fn={toggleDragMode}
        keyShortcuts='d'
        title='drag mode'
        cy='scene-drag'
      />
      <ToggleIcon
        name={SCENE.EDIT}
        src={editpointer}
        fn={toggleEditingMode}
        keyShortcuts='e'
        title='editing mode'
        cy='scene-edit'
      />
    </div>
  );
};

export default Controls;
