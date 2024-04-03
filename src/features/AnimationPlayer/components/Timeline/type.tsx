import { Signal } from "@preact/signals-react";
/**
 * All the dynamic elements of the timeline
 */
type TimelineElements = {
    slider: HTMLElement
    sliderThumb: HTMLElement
    timeline: HTMLElement
    frameCollection: HTMLElement
}
type ProgressBarsProps = {
    /**
     * The scaling factor for the progress bars to represent a second. 
     * @type {number}
     */
    scaling: number // px in seconds
    /**
     * The step size for each progress bar.
     * @type {number}
     */
    step: number
    /**
     * The total width of the container for the progress bars.
     * @type {number}
     */
    width: number
}
export type {
    TimelineElements,
    ProgressBarsProps
}