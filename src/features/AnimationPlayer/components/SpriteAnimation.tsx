import Button from "../../../components/Button";
import { useAppContext } from "../../../context/appContext";
import save from "../../../assets/images/icons/save.png";
import add from "../../../assets/images/icons/add.png";
import "../style.css";
/**
 * The sprite animation currently being played and attributes
 * @returns {JSX.Element} - The rendered SpriteAnimation component.
 */
const SpriteAnimation = () => {
    const { spriteAnimation } = useAppContext();
    return (
        <div className="SpriteAnimation AnimationPlayerGroup AnimationPlayerGroup--col">
            {spriteAnimation.CREATING.value ? 
            <input className="display" onChange={(e) => spriteAnimation.changeName(e.target.value)} value={spriteAnimation.NAME.value}/>
            :
            <select className="display" value={spriteAnimation.SPRITE.value?.id} onChange={(e) => spriteAnimation.changeSprite(Number(e.target.value))}>
                {spriteAnimation.showSprites()}
            </select>
            }
            <div className="AnimationPlayerGroup">
                <span className="ButtonMain">
                    <Button
                        action={() => { spriteAnimation.saveAnimation() }}
                        label="Save"
                        imgSrc={save}
                    />
                </span>
                <Button
                    action={() => { spriteAnimation.createAnimation() }}
                    label="New"
                    imgSrc={add}
                />
            </div>
        </div>
    )
}
export default SpriteAnimation