import { Signal } from "@preact/signals-react";
type TimelineElements = {
    slider: HTMLElement
    sliderThumb: HTMLElement
    timeline: HTMLElement
    frameCollection: HTMLElement
}
/**
 * This hook provides functionality for updating the timeline slider and displaying the current time in the timeline.
 */
type TimelineHook = {
    /**
     * Reset the timeline slider to the beginning.
     *
     * @description
     * This function resets the slider position to the beginning of the timeline.
     * It first checks if the slider is at the end of the playback.
     * Then it sets the slider position to the beginning of the timeline.
     * It also sets the display value to zero
     *
     */
    reset: () => void;
    /**
     * Show all the frames in the frame collection
     * 
     * @description
     * This function returns all frames in the frame collection.
     */
    showFrames: () => JSX.Element[];
    /**
     * Load a list of files into the frame collection.
     * 
     * @param {FileList} files - The files to load into the frame collection.
     * @description
     * This function takes a FileList as input and loads the files into the frame collection.
     * Files must be of type `image/png`, `image/jpeg`, or `image/jpg`.
     * The frames will fill the collection based on the fps value.
     */
    loadFrame: (files: FileList) => void;
    /**
     * Move the slider to the next/prev frame.
     */
    moveFrame: () => void;
    /**
     * Move the slider to the given position.
     *
     * @param {string} value - The value to move the slider to.
     * @description
     * This function takes a position as input and moves the physical slider to that position.
     * Also, it updates the display value based on the new position.
     *
     */
    moveSlider: (value: number) => void;
    /**
     * Updates the slider display with the given value.
     *
     * @param {string} value - The value to update the slider with.
     * @description
     * This function takes a value as input and updates the slider based on the value.
     * It first calculates the maximum time based on the width and scale values.
     * Then it validates the input value using a regular expression pattern.
     * If the value passes the validation and falls within the range of the minimum and maximum time,
     * it updates the display value and adjusts the position of the slider accordingly.
     * If the value is an empty string, it clears the display value.
     *
     */
    changeSliderDisplay: (value: string) => void;
    /**
     * Initializes the timeline functionality
     * 
     * @description
     * This function finds the necessary DOM elements for the timeline slider (slider, sliderThumb, and timeline)
     * and assigns them to the `TIMELINE` object. It also sets up an event listener for the window's `resize` event
     * to update the width of the timeline and slider. Additionally, it sets up an event listener for the `mousedown`
     * event on the sliderThumb element to enable dragging the slider within the timeline dimensions. Finally, it
     * sets up an event listener for the `mouseup` event on the document to stop dragging when the mouse button is released.
     * 
     * @returns {void} This function does not return a value.
     */
    initialize: () => void;
    /**
     * Represents the timeline display value.
     * @type {Signal<string>}
     */
    DISPLAY: Signal<string>;
    /**
     * Represents the pixel scaling value for one second
     * 
     * Example: 10px represents 1 seconds.
     * @type {Signal<number>}
     */
    SCALE: Signal<number>;
    /**
     * Represents the width value of the timeline.
     * @type {Signal<number>}
     */
    WIDTH: Signal<number>;
     /**
     * Represents the slider position
     * @type {Signal<number>}
     */
    SLIDER: Signal<number>;
    /**
     * Represents the timeline componenets
     * @type {Signal<TimelineElements | null>}
     */
    ELEMENTS: Signal<TimelineElements | null>;
    /**
     * Represents the frames in the timeline
     * @type {Signal<HTMLImageElement[]>}
     */
    FRAMES: Signal<HTMLImageElement[]>;
    /**
     * Represents the current frame to be displayed
     * @type {Signal<HTMLImageElement>}
     */
    FRAME: Signal<HTMLImageElement>;
    /**
     * Represents the frames per second
     * @type {Signal<string>}
     */
    FPS: Signal<string>;
}
type ControlsHook = {
    /**
     * Start the timeline playback
     *
     * @return {void}
     * 
     * @description
     * It resets timeline if already finished and not looping.
     * At any time it can be stopped. Also it can be repeated if looping is enabled.
     * 
     */
    play: () => void;
    /**
     * Stop the timeline playback
     *
     * @return {void}
     */
    stop: () => void;
    /**
     * Decrease by scale/fps seconds
     *
     * @return {void}
     */
    playBackward: () => void;
    /**
     * Increase by scale/fps seconds
     *
     * @return {void}
     */
    playForward: () => void;
    /**
     * Seek the timeline to the previous frame
     *
     * @return {void}
     */
    playFastBackward: () => void;
    /**
     * Seek the timeline to the next frame
     *
     * @return {void}
     */
    playFastForward: () => void;
    /**
     * Loop playing the timeline from beginning to end
     *
     * @return {void}
     */
    repeat: () => void;
    /**
     * Updates the slider display with the given value.
     *
     * @description
     * This function takes a value as input and updates the slider based on the value.
     * It first calculates the maximum time based on the width and scale values.
     * Then it validates the input value using a regular expression pattern.
     * If the value passes the validation and falls within the range of the minimum and maximum time,
     * it updates the display value and adjusts the position of the slider accordingly.
     * If the value is an empty string, it clears the display value.
     *
     * @param {string} value - The value to update the slider with.
     */
    changeSliderDisplay: (value: string) => void;
    /**
     * Change the play fps of timeline
     *
     * @param {"up" | "down"} direction - increase or decrease fps respectively
     * @return {void}
     */
    changeFPS: (direction: "up" | "down") => void;
    /**
     * Check if timeline is in play or not
     * @type {Signal<Boolean | null>}
     */
    PLAYING: Signal<Boolean | null>;
    /**
     * Repeat timeline 
     * @type {Signal<Boolean>}
     */
    LOOP: Signal<Boolean>;
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
type TimelineProps = {
    /**
     * The lib of hooks for the Timeline 
     * @type {TimelineHook}
     */
    hook: TimelineHook
}
type FrameCollectionProps = {
    /**
     * The inherited hook from the Timeline
     * @type {TimelineHook}
     */
    hook: TimelineHook
}
type ControlsProps = {
    /**
     * The lib of hooks for the controls 
     * @type {ControlsHook}
     */
    hook: ControlsHook
    /**
     * The lib of hooks for the Timeline 
     * @type {TimelineHook}
     */
    timeline: TimelineHook
}
type PlaybackProps = {
    /**
     * The inherited hook from the Controls
     * @type {ControlsHook}
     */
    hook: ControlsHook
}
type FPSProps = {
    /**
     * The inherited hook from the Controls
     * @type {ControlsHook}
     */
    hook: ControlsHook
    /**
     * The lib of hooks for the Timeline 
     * @type {TimelineHook}
     */
    timeline: TimelineHook
}
type AnimationDisplayProps = {
    /**
     * The lib of hooks for the Timeline 
     * @type {TimelineHook}
     */
    timeline: TimelineHook
}
type SpriteManagerProps = {
    /**
     * The lib of hooks for the Timeline 
     * @type {TimelineHook}
     */
    timeline: TimelineHook
}
export type {
    TimelineElements,
    TimelineHook,
    ControlsHook,
    TimelineProps,
    ProgressBarsProps,
    FrameCollectionProps,
    PlaybackProps,
    FPSProps,
    ControlsProps,
    SpriteManagerProps,
    AnimationDisplayProps
}