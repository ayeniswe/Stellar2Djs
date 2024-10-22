import '../style.css';
import add from '../../../assets/images/icons/add.png';
import Button from '../../../components/Button';
import React from 'react';
import save from '../../../assets/images/icons/save.png';
import { useAppContext } from '../../../context/appContext';

/**
 * The sprite animation currently being played and attributes
 * @returns {JSX.Element} - The rendered SpriteAnimation component.
 */
const SpriteAnimation = () => {
  const { spriteAnimation } = useAppContext();

  return (
    <div className="SpriteAnimation AnimationPlayerGroup AnimationPlayerGroup--col">
      {spriteAnimation.creating.value ?
        <input data-cy="animation-name" className="display"
          onChange={(e) => spriteAnimation.changeName(e.target.value)} value={spriteAnimation.spriteName.value}/>
        :
        <select data-cy="animation-name" className="display"
          onChange={(e) => spriteAnimation.changeSprite(Number(e.target.value))}
          value={spriteAnimation.sprite.value?.id}>
          {spriteAnimation.showSprites()}
        </select>
      }
      <div className="AnimationPlayerGroup">
        <span className="ButtonMain">
          <Button
            action={() => {spriteAnimation.saveAnimation();}}
            label="Save"
            imgSrc={save}
            title="Save the current animation"
            cy="save-animation"
          />
        </span>
        <Button
          action={() => {spriteAnimation.createAnimation();}}
          label="New"
          imgSrc={add}
          title="Create a new animation"
          cy="create-animation"
        />
      </div>
    </div>
  );
};

export default SpriteAnimation;
