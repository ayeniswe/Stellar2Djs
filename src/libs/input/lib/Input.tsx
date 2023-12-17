import { KMMapping, Mouse, Keyboard, KMInput, MouseInputToName } from "..";
import { MESSAGE, warn } from "../../logging";

/**
 * Handles tracking of keyboard/mouse inputs to specfic custom actions.
 * Initializes a keyboard listener for entire document when no id is specified. Element id can be specified for specific element keyboard listener.
 */
class Input {
    static documentEventListenersAdded = false; // Only add document event listeners once

    constructor(mapping: KMMapping, id?: string) {
        this.__keyboardListener(mapping, id);
        this.__mouseButtonListener(mapping, id);
    }
    
    private __addKey = (mapping: KMMapping) => {
        return (event: KeyboardEvent) => {
            if (!event.repeat) mapping[event.key as KMInput] = true;
        }
    }
    
    private __removeKey = (mapping: KMMapping) => {
        return (event: KeyboardEvent) => {
            delete mapping[event.key as KMInput];
        }
    }

    private __addButton = (mapping: KMMapping) => {
        return (event: MouseEvent) => {
            mapping[MouseInputToName[event.button] as KMInput] = true;
        }
    }
    
    private __removeButton = (mapping: KMMapping) => {
        return (event: MouseEvent) => {
            delete mapping[MouseInputToName[event.button] as KMInput];
        }
    }

    /**
     * Executes the action if all inputs in `allInputs` have a corresponding value in `mapping`,
     * otherwise does nothing.
     *
     * @param {function} fn - The function to execute if all keys have a corresponding value
     * @param {string[]} allInputs - The keys to check in `mapping`
     * @param {object} mapping - The mapping object to check for values
     * @param {object} once - Fire the action once or repeatedly
     */
    private __eventHandler = (fn: Function, mapping: KMMapping, allInputs: KMInput[], once: boolean) => {
        return (event: any) => {
            const action = () => {
                if (event instanceof KeyboardEvent){
                    if (allInputs.length === 1) {
                        if (!mapping[allInputs[0]]) return;
                        // Wait .15 seconds for next key press
                        setTimeout(() => {
                            if (mapping[allInputs[0]]) {
                                warn(MESSAGE.KEY_WAIT, allInputs[0]);
                                return;
                            };
                            fn(event);
                        },150);
                    } 
                    else if (allInputs.length > 1) {
                        for (const key of allInputs) {
                            if (!mapping[key]) return;
                        } 
                        fn(event);
                    }
                }
                else if (event instanceof MouseEvent) {
                    if (allInputs.length === 1) {
                        if (!mapping[allInputs[0]]) return;
                        fn(event);
                    } 
                    else if (allInputs.length > 1) {
                        for (const key of allInputs) {
                            if (!mapping[key]) return;
                        }
                        fn(event);
                    } else {
                        fn(event);
                    }
                }
            }
            if (!once) action();
            else if (event instanceof KeyboardEvent) {
                if (!event.repeat) action();
            }
        }
    }

    /**
     * Ongoing listener for keyboard events. Defaults to entire document if no id and custom mapping.
     * 
     * @param {string} [id] - id of the element to attach the event listeners to.
     * @param {KMMapping} [mapping] - keyboard/button mapping object.
     */
    private __keyboardListener = (mapping: KMMapping, id?: string) => {
        if (id && mapping) {
            document.getElementById(id)?.addEventListener("keydown", this.__addKey(mapping));
            document.getElementById(id)?.addEventListener("keyup", this.__removeKey(mapping));
        } else {
            if (!Input.documentEventListenersAdded) {
                document.addEventListener("keydown", this.__addKey(mapping));
                document.addEventListener("keyup", this.__removeKey(mapping));
            }
        }
    }

    /**
     * Ongoing listener for mouse button events. Defaults to entire document if no id and custom mapping.
     * 
     * @param {string} [id] - id of the element to attach the event listeners to.
     * @param {KMMapping} [mapping] - keyboard/button mapping object.
     */
    private __mouseButtonListener = (mapping: KMMapping, id?: string) => {
        if (id) {
            document.getElementById(id)?.addEventListener("mousedown", this.__addButton(mapping));
            document.getElementById(id)?.addEventListener("mouseup", this.__removeButton(mapping));
        } else {
            if (!Input.documentEventListenersAdded) {
                document.addEventListener("mousedown", this.__addButton(mapping));
                document.addEventListener("mouseup", this.__removeButton(mapping));
                Input.documentEventListenersAdded = true;
            }
        }
    }

    /**
     * Create a key/mouse event listener.
     *
     * @param {Function} fn - The function to be executed when the keyboard event is triggered.
     * @param {Keyboard} type - The listener type
     * @param {KMMapping} mapping - The keyboard mapping object to check against the keyboard inputs.
     * @param {KMInput[]} inputs - The keyboard inputs to check for.
     * @param {string} id - The optional ID of the HTML element to attach the keyboard event listener to.
     * @param {boolean} once - Fire the action once or repeatedly
     * @return {Function} - The bound function that was created to handle the keyboard event.
     */
    protected __eventListener(fn: Function, type: Keyboard | Mouse, mapping: KMMapping, inputs: KMInput[], once: boolean, id?:string): Function {
        const bound = this.__eventHandler(fn, mapping, inputs, once);
        if (id) {
            document.getElementById(id)?.addEventListener(type, bound);
        } else {
            document.addEventListener(type, bound);
        };
        return bound;
    }
}

export {
    Input
}