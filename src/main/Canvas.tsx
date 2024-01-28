import './styles/Canvas.css';
type Props = {
  width : number
  height : number
  reference : React.RefObject<HTMLCanvasElement>
}
const Canvas: React.FC<Props> = ({reference, width, height }) => {
    return (
      <>
        <div id="Canvas-brush"/>
        <canvas aria-label='drawing canvas' id="Canvas" ref={reference} width={width} height={height} />
      </>
    );
}
export default Canvas;