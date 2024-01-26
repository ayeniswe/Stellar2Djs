import "../../style.css";
import UploadButton from "../UploadButton";
/**
 * A the menu of options for the assets manager.
 * @returns {JSX.Element} - The rendered Menu component.
 */
const Menu = () => {
    return (
        <div className="AssetsManagerMenu">
            <UploadButton/>
        </div>
    )
}
export default Menu