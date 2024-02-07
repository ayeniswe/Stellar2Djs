import { SCENE } from '..';
import '../style.css';
type Props = {
  reference : React.RefObject<HTMLCanvasElement>
}
const Canvas: React.FC<Props> = ({ reference }) => {
    return (
      <>
        <div id={SCENE.BRUSH}/>
        <canvas data-cy='canvas' aria-label='drawing canvas' id={SCENE.CANVAS} ref={reference} width={reference.current?.width} height={reference.current?.height} onDragOver={(e) => e.preventDefault()}/>
      </>
    );
}
export default Canvas;