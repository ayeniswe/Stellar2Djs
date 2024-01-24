import { getLeft, setLeft } from "../../../../utils/styleProps";
/**
 * Sets the inner display of timeline
 *
 * @param {number} position - the x position of slider
 * @param {number} scale - the scale value
 * @return {string} 
 */
const calculateDisplay = (position: number, scale: number): string => {
    return `${(position / scale).toFixed(2)}`;
}
/**
 * Sets the slider x position in timeline.
 *
 * @param {HTMLElement} element - the HTML element to set the position for
 * @param {number} newPosition - the new position to set
 * @return {void} 
 */
const setPosition = (element: HTMLElement, newPosition: number): void => {
    setLeft(element, newPosition);
}
export {
    calculateDisplay,
    setPosition
}