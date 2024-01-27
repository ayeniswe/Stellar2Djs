import './styles/Canvas.css';

type Props = {
  reference : React.RefObject<HTMLCanvasElement>;
  width : number;
  height : number;
}

const Canvas: React.FC<Props> = ({reference, width, height}) => {
    return (
      <>
        <div id="Canvas-brush"/>
        <canvas aria-label='drawing canvas' id="Canvas" ref={reference} width={width} height={height} />
      </>
    );
}

export default Canvas;