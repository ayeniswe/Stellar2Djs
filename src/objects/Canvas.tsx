import { useEffect, useRef, useState } from 'react';
import '../assets/style/Canvas.css';
import { TextureRenderer } from '../rendering/TextureRenderer';
import { TextureAtlas } from '../rendering';
import { effect } from '@preact/signals-react';

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
        const rend = new TextureRenderer(ctx);
        effect(() => {
          if (rend.texturesToLoad.value === 0) {
            rend.add(TextureAtlas.PLAIN_WALL, 0, 0);
            rend.add(TextureAtlas.PLAIN_WALL, 32, 0);
            rend.add(TextureAtlas.PLAIN_WALL, 64, 0);
            rend.render(ctx);
          }
        });
    }
    
    return (
      <canvas ref={canvasRef} width={width} height={height} id = "Canvas"/>
    );
}

export default Canvas;