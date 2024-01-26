import Menu from "./components/Menu";
import ManagerWindow from "./components/Window";
import "./style.css";
/**
 * A manager for all uploaded Assets
 * @returns {JSX.Element} - The rendered Manager component.
 */
const AssetsManager = () => {
    return (
        <div className="AssetsManager">
            <Menu/>
            <ManagerWindow/>
        </div>
    )
}
export default AssetsManager