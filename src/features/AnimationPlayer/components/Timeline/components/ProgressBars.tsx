import "../../../style.css";
import { FC, memo } from "react";
import { ProgressBarsProps } from "../type";
/**
 * Displays a series of progress bars.
 * @returns {JSX.Element} - The `memomized` rendered ProgressBars component.
 */
const ProgressBars: FC<ProgressBarsProps> = memo(({ scaling, step, width }) => {
    const numOfBars = width / (scaling * step) + 1
    return (
        <div className="Progress">
            {Array.from({ length: numOfBars }, (_, index) => {
                if (index > 0) {
                    return (
                        <div key={index} className="Progress__bar" style={{ left: `${index * scaling * step}px`}}>
                            <span className="Progress__bar__unit">{index * step}</span>
                        </div>
                    )
                }
            })}
        </div>
    )
})
export default ProgressBars