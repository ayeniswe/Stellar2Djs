import { useEffect, useRef, useState } from "react";
import SceneEditorUI from "./features/SceneEditor";
import Canvas from "./main/Canvas";
import Toolbar from "./main/Toolbar";
const App = () => {
    // Canvas
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [ctx, setContext] = useState<CanvasRenderingContext2D | null>(null);
    const [height, setHeight] = useState(600);
    const [width, setWidth] = useState(800);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            setHeight(canvas.height);
            setWidth(canvas.width);
            setContext(canvas.getContext('2d'));
        }
    }, [canvasRef]);
    useEffect(() => {
    }, [ctx]);
    return (
        <div id="App" className="App">
            <Canvas reference={canvasRef} width={width} height={height}/>
            {ctx && <SceneEditorUI ctx={ctx} mapping={{}}/>}
            <Toolbar/>
        </div>
    );
}
export default App;
