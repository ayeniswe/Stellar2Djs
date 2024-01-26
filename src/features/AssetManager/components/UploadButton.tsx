import upload from "../../../assets/images/icons/upload.png"
import { useAppContext } from "../../../context/appContext";
import "../style.css";
/**
 * A button to upload one or more sprites
 * @returns {JSX.Element} - The rendered UploadButton component.
 */
const UploadButton = () => {
    const { assetsManager } = useAppContext();
    return (
        <button className="UploadButton">
            <label className="UploadButton__label" htmlFor="UploadSprites">
                <img src={upload}/>
                Upload Sprites
                <input id="UploadSprites" onChange={(e) => assetsManager.loadSprites(e.target.files!)} type='file' multiple/>
            </label>
        </button>
    )
}
export default UploadButton