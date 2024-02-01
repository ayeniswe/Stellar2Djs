import { Controls, SpriteAnimation, Timeline } from "../features/AnimationPlayer/hooks"
import { Scene } from "../features/Scene/hooks"
type AppContext = {
    timeline: Timeline,
    timelineControls: Controls
    spriteAnimation: SpriteAnimation
    scene: Scene
}
export type {
    AppContext
}