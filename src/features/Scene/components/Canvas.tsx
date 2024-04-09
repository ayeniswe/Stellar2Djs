import '../style.css';
import { getHeight } from '../../../utils/styleProps';
import React from 'react';
import { SCENE } from '../constants';

type Props = {
  reference : React.RefObject<HTMLCanvasElement>
}

const Canvas: React.FC<Props> = ({ reference }) => (
  <>
    <div id={SCENE.SELECTION}>
      <svg className='top-border'/>
      <svg className='left-border'/>
      <svg className='right-border'/>
      <svg className='bottom-border' onMouseDown={(e) => {
        const selection = e.currentTarget.parentElement!;
        const currentY = e.clientY;
        const currentHeight = getHeight(selection).toNumber();
        document.onmousemove = (event) => {
          selection.style.height = `${currentHeight + (event.clientY - currentY)}px`;
        };
        document.onmouseup = () => {
          document.onmousemove = null;
          document.onmouseup = null;
        };
      }}/>
    </div>
    <svg id={SCENE.BRUSH}/>
    <canvas data-cy='canvas' aria-label='drawing canvas' id={SCENE.CANVAS} ref={reference}
      width={reference.current?.width} height={reference.current?.height} onDragOver={(e) => e.preventDefault()}/>
  </>
);

export default Canvas;
