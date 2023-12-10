import { useEffect, useRef, useState } from 'react';
import '../assets/style/Canvas.css';
import { TextureRenderer } from '../rendering/TextureRenderer';
import { TextureAtlas } from '../rendering';

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
      // Add event listener for mousemove event
      

      (async () => {
        const rend = new TextureRenderer(ctx);
        await rend.init();
        document.getElementById("Canvas")?.addEventListener("mousedown", function(event) {
          rend.add(TextureAtlas.PLAIN_WALL, event.offsetX, event.offsetY);
          rend.render(ctx);
        })
      })();
    }
    
    return (
      <canvas ref={canvasRef} width={width} height={height} id = "Canvas"/>
    );
}

export default Canvas;