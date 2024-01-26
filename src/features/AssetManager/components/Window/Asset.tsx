import { FC } from "react";
import "../../style.css";
import { AssetProps } from "./type";
/**
 * A asset to be displayed in the Assets window
 * @returns {JSX.Element} - The rendered Asset component.
 */
const Asset: FC<AssetProps> = ({ src, filename }) => {
    return (
        <div className="Asset">
            <img src={src}/>
            <label>{filename}</label>
        </div>
    )
}
export default Asset