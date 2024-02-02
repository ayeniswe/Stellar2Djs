import { useEffect, useRef } from "react";
import Canvas from "./components/Canvas";
import { useSignal } from "@preact/signals-react";
import { useAppContext } from "../../context/appContext";
import Controls from "./components/Controls";
import { useScene } from "./hooks";
import { getHeight, getWidth } from "../../utils/styleProps";
const Scene = () => {
    const ctx = useSignal<CanvasRenderingContext2D | null>(null);
    const ref = useRef<HTMLCanvasElement>(null);
    const app = useAppContext();
    app.scene = useScene(ctx.value!);
    // link canvas to scene
    useEffect(() => {
        if (ref.current) {
            // set scene size
            ref.current.width = getWidth(ref.current).toNumber();
            ref.current.height = getHeight(ref.current).toNumber();
            ctx.value = ref.current.getContext('2d');
            // initialize scene
            (async () => {
                await app.scene.initialize();
            })();
        }
    }, [ctx.value]);
    return (
        <div className="Scene">
            <Canvas reference={ref}/>
            <Controls/>
        </div>
    );
}
export default Scene;
