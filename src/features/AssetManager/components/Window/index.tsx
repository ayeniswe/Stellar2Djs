import "../../style.css";
import Assets from "./Assets";
/**
 * A window containing all uploaded Assets
 * @returns {JSX.Element} - The rendered Window component.
 */
const ManagerWindow = () => {
    return (
        <div className="AssetsManagerWindow">
            <Assets/>
        </div>
    )
}
export default ManagerWindow