import "./style.css";
import { FC } from "react";
import { ButtonProps } from "./type";
/**
 * A button w/ a single action
 * @returns {JSX.Element} - The rendered Button component.
 */
const Button: FC<ButtonProps> = ({ action, label, imgSrc, type }) => {
    return (
        <button className="Button" onClick={() => type ? null : action()}>
            <label className="ButtonLabel" htmlFor={type}>
                {imgSrc && <img alt={label} src={imgSrc}/>}
                {label}
                {type === "file" && <input id="file" type="file" onChange={(e) => action(e.target.files)} multiple/>}
            </label>
        </button>
    )
}
export default Button