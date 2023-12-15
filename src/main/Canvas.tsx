import '../assets/styles/Canvas.css';

type Props = {
  reference : React.RefObject<HTMLCanvasElement>;
  width : number;
  height : number;
}

const Canvas: React.FC<Props> = ({reference, width, height}) => {
    return (
      <canvas ref={reference} width={width} height={height} id = "Canvas"/>
    );
}

export default Canvas;