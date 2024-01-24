import { FC } from "react";
import { SpriteManagerProps } from "../type";
import "../style.css";
const SpriteManager: FC<SpriteManagerProps> = ({ timeline }) => {
    return (
        <div className="SpriteManager">
            SpritesManager
            <div className="SpriteManager__upload"><input className="SpriteManager__upload" onChange={(e) => timeline.loadFrame(e.target.files!)} type='file' accept="image/png, image/jpeg image/jpg" multiple/></div>
        </div>
    )
}
export default SpriteManager