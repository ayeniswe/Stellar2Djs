import { createContext, useContext } from "react";
import useTimeline from "../features/AnimationPlayer/hooks/useTimeline";
import useControls from "../features/AnimationPlayer/hooks/useControls";
import useAssetsManager from "../features/AssetManager/hooks/useAssetsManager";
import { Controls, SpriteAnimation, Timeline } from "../features/AnimationPlayer/hooks/type";
import useSpriteAnimation from "../features/AnimationPlayer/hooks/useSpriteAnimation";
type AppContext = {
    timeline: Timeline,
    timelineControls: Controls
    assetsManager: ReturnType<typeof useAssetsManager>
    spriteAnimation: SpriteAnimation
}
const AppContext = createContext<AppContext | null>(null);
const AppContextProvider = ({ children }: { children: JSX.Element }) => {
    const assetsManager = useAssetsManager();
    const spriteAnimation = useSpriteAnimation();
    const timeline = useTimeline(spriteAnimation);
    const timelineControls = useControls(timeline);
    return (
        <AppContext.Provider 
            value={{ 
                timeline,
                timelineControls,
                assetsManager,
                spriteAnimation
            }}>
            {children}
        </AppContext.Provider>
    )
} 
const useAppContext = () => {
    const ctx = useContext(AppContext);
    if(!ctx) {
        throw new Error("useAppContext must be used within an AppContextProvider");
    }
    return ctx;
}
export {
    AppContextProvider, 
    useAppContext
}