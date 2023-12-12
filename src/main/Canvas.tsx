import { useEffect, useRef, useState } from 'react';
import '../assets/style/Canvas.css';
import { Level } from '../libs/design/level';
import { LevelInput } from '../libs/input/Level';

const Canvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const [ctx, setContext] = useState<CanvasRenderingContext2D | null>(null)
    const [height, setHeight] = useState(600);
    const [width, setWidth] = useState(800);
    
    useEffect(() => {
      const canvas = canvasRef.current
      if (canvas) {
        setHeight(canvas.height);
        setWidth(canvas.width);
        setContext(canvas.getContext('2d'));
      }
    },[width, height]);

    if (ctx) {
      (async () => {
        await new LevelInput(ctx).init();
      })();
    }
    
    return (
      <canvas ref={canvasRef} width={width} height={height} id = "Canvas"/>
    );
}

export default Canvas;