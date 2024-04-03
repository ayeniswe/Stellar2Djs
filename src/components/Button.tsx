import "./style.css";
import { FC } from "react";
import { ButtonProps } from "./type";
/**
 * A button w/ a single action
 * @returns {JSX.Element} - The rendered Button component.
 */
const Button: FC<ButtonProps> = ({ action, label, imgSrc, type, title, cy }) => {
    return (
        <button data-cy={cy} className="Button" title={title} onClick={() => type ? null : action()}>
            <label htmlFor={type}>
                {imgSrc && <img alt={label} src={imgSrc}/>}
                {label}
                {type === "file" && <input data-cy={`${cy}-file`} id="file" type="file" onChange={(e) => action(e.target.files)} multiple/>}
            </label>
        </button>
    )
}
export default Button