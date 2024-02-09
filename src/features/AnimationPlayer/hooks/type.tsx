import { Signal } from "@preact/signals-react";
type Direction = "forward" | "backward";
/**
 * This hook provides functionality for updating the timeline slider and displaying the current time in the timeline.
 */
type Timeline = {
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
    showFrames: () => JSX.Element[] | undefined;
    /**
     * Remove the current frame from the frame collection
     * 
     */
    removeFrame: () => void;
    /**
     * Move the slider by the given amount of frames.
     */
    moveFrame: (amount: number) => void;
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
    display: Signal<string>;
    /**
     * Represents the pixel scaling value for one second
     * 
     * Example: 10px represents 1 seconds.
     * @type {Signal<number>}
     */
    scale: Signal<number>;
    /**
     * Represents the width value of the timeline.
     * @type {Signal<number>}
     */
    width: Signal<number>;
     /**
     * Represents the slider position
     * @type {Signal<number>}
     */
    slider: Signal<number>;
    /**
     * Represents the frames src in the timeline 
     * @description
     * This list of frames src is inherited from the current sprite animation
     * @type {Signal<ImageData[] | undefined>}
     */
    frames: Signal<ImageData[] | undefined>;
    /**
     * Represents the current frame to be displayed
     * @type {Signal<ImageData | undefined>}
     */
    frame: Signal<ImageData | undefined>;
    /**
     * Represents the frames per second
     * @type {Signal<string>}
     */
    fps: Signal<string>;
}
/**
 * This hook provides functionality for controlling the playback of the timeline.
 */
type Controls = {
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
    playing: Signal<Boolean | null>;
    /**
     * Repeat timeline 
     * @type {Signal<Boolean>}
     */
    loop: Signal<Boolean>;
}
/**
 * This hook provides functionality for managing the sprite animation.
 */
type SpriteAnimation = {
    /**
     * Show the list of sprite animations
     */
    showSprites: () => JSX.Element[]
    /**
     * Create a new sprite animation
     */
    createAnimation: () => void
    /**
     * Save the current sprite in animation player
     * @description
     * If the sprite already exists, it will overwrite the existing frames. 
     * If the sprite doesn't exist, it will create a new sprite with `Sprite` attributes.
     */
    saveAnimation: () => void
    /**
     * Change the current sprite
     *  
     * @param {string} value - The index of the sprite animation
     */
    changeSprite: (value: number) => void
    /**
     * Change the name of the sprite animation
     *  
     * @param {string} name - The name of the sprite animation
     * @returns {void}
     */
    changeName: (name: string) => void
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
     * Remove the frame from the sprite animation
     * 
     */
    removeFrame: (index: number) => void;
    /**
     * Handle sprite drag drop from animation display
     * 
     * NOTE - data is JSON stringify is sent using `application/sprite` tag
     */
    handleSpriteDragDrop: (e: React.DragEvent<HTMLImageElement>) => void;
    /**
     * Sprite animation unique name
     * @type {Signal<string>}
     */
    spriteName: Signal<string>;
    /**
     * The current sprite
     * @type {Signal<Sprite | null>}
     */
    sprite: Signal<Sprite | null>;
    /**
     * The list of sprite animations objects
     * @type {Signal<Sprite[]>}
     */
    sprites: Signal<Sprite[]>;
    /**
     * The current frame selected
     * @type {Signal<number>}
     */
    current_frame: Signal<number>;
    /**
     * Indicates if sprite animation is currently being created
     * @type {Signal<boolean>}
     */
    creating: Signal<boolean>;
    /**
     * Represents the frames src in the current sprite animation
     * @type {Signal<ImageData[]>}
     */
    frames: Signal<ImageData[]>;
}
type Sprite = {
    /**
     * Represents the name of the sprite
     * @type {Signal<HTMLImageElement[]>}
     */
    name: string,
    /**
     * Represents the frames src in the sprite
     * @type {Signal<ImageData[]>}
     */
    frames: ImageData[]
    /**
     * Represents the id of the sprite
     * @type {string | number}
     */
    id: string | number
}
type ImageData = {
    h: number,
    w: number,
    src: string
}
export type {
    Timeline,
    Controls,
    SpriteAnimation,
    Direction,
    Sprite
}