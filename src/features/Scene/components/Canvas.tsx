import '../style.css';
type Props = {
  reference : React.RefObject<HTMLCanvasElement>
}
const Canvas: React.FC<Props> = ({ reference }) => {
    return (
      <>
        <div id="Canvas-brush"/>
        <canvas aria-label='drawing canvas' id="Canvas" ref={reference} width={reference.current?.width} height={reference.current?.height} />
      </>
    );
}
export default Canvas;