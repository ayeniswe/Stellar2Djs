import { Controls, SpriteAnimation, Timeline } from "../features/AnimationPlayer/hooks"
import { Scene } from "../features/Scene/hooks"
import { Toolbar } from "../features/Toolbar/hooks"
type AppContextProps = {
    timeline: Timeline,
    timelineControls: Controls
    spriteAnimation: SpriteAnimation
    scene: Scene
    toolbar: Toolbar
}
export type {
    AppContextProps
}