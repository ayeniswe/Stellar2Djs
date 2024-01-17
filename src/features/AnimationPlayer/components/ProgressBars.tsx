import "../styles/AnimationPlayer.css";

interface Props {
    scaling: number // px in seconds
    step: number
    width: number
}

const ProgressBars: React.FC<Props> = ({ scaling, step, width }) => {
    const numOfBars = width / (scaling * step) + 1
    return (
        <>
            {Array.from({ length: numOfBars }, (_, index) => {
                if (index > 0) {
                    return (
                        <div key={index} className="ProgressBar" style={{ left: `${index * scaling * step}px`}}>
                            <span className="ProgressBar__unit">{index * step}</span>
                        </div>
                    )
                }
            })}
        </>
    )
}

export default ProgressBars