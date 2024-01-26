import { useAppContext } from "../../../../context/appContext";
import "../../style.css";
/**
 * A window containing all uploaded Assets
 * @returns {JSX.Element} - The rendered Assets component.
 */
const Assets = () => {
    const { assetsManager } = useAppContext();
    return (
        <div className="Assets">
            {assetsManager.showSprites()}
        </div>
    )
}
export default Assets