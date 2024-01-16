import "../styles/AnimationPlayer.css";

const ProgressBars = () => {
    const numOfBars = 24;
    const step = 5;
    return (
        <>
            <div/>{/* <initial progress bar> */}
            {Array.from({ length: numOfBars }, (_, index) => (
                <div key={index} className="AnimationPlayer__timeline__progress__bar">
                    {(index + 1) * step}<div/>
                </div>
            ))}
        </>
    )
}

export default ProgressBars