import { useEffect, useRef, useState } from "react";
import SceneEditorUI from "./features/SceneEditor";
import Canvas from "./main/Canvas";
import { SceneEditor } from "./main/SceneEditor";

const Game = () => {
  // Canvas
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ctx, setContext] = useState<CanvasRenderingContext2D | null>(null)
  const [height, setHeight] = useState(600);
  const [width, setWidth] = useState(800);
  // SceneEditor
  const [editor, setEditor] = useState<SceneEditor | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      setHeight(canvas.height);
      setWidth(canvas.width);
      setContext(canvas.getContext('2d'));
    }
  }, [width, height]);

  useEffect(() => {
    if (ctx) {
      (async () => {
        const editor = new SceneEditor(ctx, {});
        await editor.init();
        setEditor(editor);
      })();
    }
  }, [ctx]);

  return (
    <div id="Game" className="Game">
      <Canvas reference={canvasRef} width={width} height={height}/>
      {editor && <SceneEditorUI editor={editor} />}
    </div>
  );
}

export default Game;
