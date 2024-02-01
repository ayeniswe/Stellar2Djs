import { createContext, useContext } from "react";
import { AppContext } from "./type";
import { useControls, useSpriteAnimation, useTimeline } from "../features/AnimationPlayer/hooks";
import { useScene } from "../features/Scene/hooks";
const Context = createContext<AppContext | null>(null);
const AppContextProvider = ({ children }: { children: JSX.Element }) => {
    const spriteAnimation = useSpriteAnimation();
    const timeline = useTimeline(spriteAnimation);
    const timelineControls = useControls(timeline);
    const scene = useScene(null); // should be replaced when scene component is rendered
    return (
        <Context.Provider
            value={{
                timeline,
                timelineControls,
                spriteAnimation,
                scene,
            }}>
            {children}
        </Context.Provider>
    )
}
const useAppContext = () => {
    const ctx = useContext(Context);
    if(!ctx) {
        throw new Error("useAppContext must be used within an AppContextProvider");
    }
    return ctx;
}
export {
    AppContextProvider,
    useAppContext
}