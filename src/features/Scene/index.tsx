import { useEffect, useRef } from "react";
import Canvas from "./components/Canvas";
import { useSignal } from "@preact/signals-react";
import { useAppContext } from "../../context/appContext";
import Controls from "./components/Controls";
import { useScene } from "./hooks";
const Scene = ({ width = 800, height = 600 }) => {
    const ctx = useSignal<CanvasRenderingContext2D | null>(null);
    const ref = useRef<HTMLCanvasElement>(null);
    // set scene dimensions
    const app = useAppContext();
    app.scene = useScene(ctx.value!);
    app.scene!.attrs.height = height;
    app.scene!.attrs.width = width;
    // link canvas to scene
    useEffect(() => {
        if (ref.current) {
            ctx.value = ref.current.getContext('2d');
            // initialize scene
            (async () => {
                await app.scene.initialize();
            })();
        }
    }, [ctx.value]);
    return (
        <>
            <Canvas reference={ref}/>
            <Controls/>
        </>
    );
}
export default Scene;
