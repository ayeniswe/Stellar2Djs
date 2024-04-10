import '../style.css';
import React from 'react';
import { SCENE } from '../constants';

type Props = {
  reference : React.RefObject<HTMLCanvasElement>
}

const Canvas: React.FC<Props> = ({ reference }) => (
  <>
    <div id={SCENE.SELECTION}>
      <svg/>
      <svg/>
      <svg/>
      <svg/>
    </div>
    <svg id={SCENE.BRUSH}/>
    <canvas data-cy='canvas' aria-label='drawing canvas' id={SCENE.CANVAS} ref={reference}
      width={reference.current?.width} height={reference.current?.height} onDragOver={(e) => e.preventDefault()}/>
  </>
);

export default Canvas;
