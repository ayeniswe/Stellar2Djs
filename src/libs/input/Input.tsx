import { DND, Keyboard, KMInput, KMMapping, Mouse, MouseInputToName } from '.';

/**
 * Handles tracking of keyboard/mouse inputs to specific custom actions.
 * Initializes a keyboard listener for entire document
 * when no id is specified. Element id can be specified
 * for specific element keyboard listener.
 */
class Input {
  static documentEventListenersAdded = false; // Only add document event listeners once

  constructor(mapping: KMMapping, id?: string) {
    this.keyboardListener(mapping, id);
    this.mouseButtonListener(mapping, id);
  }

  private addKey = (mapping: KMMapping) => (event: KeyboardEvent) => {
    if (!event.repeat) mapping[event.key as KMInput] = true;
  };

  private removeKey = (mapping: KMMapping) => (event: KeyboardEvent) => {
    delete mapping[event.key as KMInput];
  };

  private addButton = (mapping: KMMapping) => (event: MouseEvent) => {
    mapping[MouseInputToName[event.button] as KMInput] = true;
  };

  private removeButton = (mapping: KMMapping) => (event: MouseEvent) => {
    delete mapping[MouseInputToName[event.button] as KMInput];
  };

  /**
   * Executes the action if all inputs in
   * `allInputs` have a corresponding value in `mapping`,
   * otherwise does nothing.
   *
   * @param {function} fn - The function to execute if all keys
   * have a corresponding value
   * @param {string[]} allInputs - The keys to check in `mapping`
   * @param {object} mapping - The mapping object to check for values
   * @param {object} once - Fire the action once or repeatedly
   */
  private eventHandler = (fn: Function, mapping: KMMapping, allInputs: KMInput[], once: boolean) => (event: any) => {
    const action = () => {
      if (allInputs.length > 1) {
        for (const key of allInputs) {
          if (!mapping[key]) return;
        }
        fn(event);
      }
      else if (allInputs.length === 1) {
        if (event instanceof KeyboardEvent) {
          if (!mapping[allInputs[0]]) return;
          // Wait .15 seconds for next key press
          setTimeout(() => {
            if (mapping[allInputs[0]]) return;
            fn(event);
          }, 150);
        }
        else {
          if (!mapping[allInputs[0]]) return;
          fn(event);
        }
      }
      else {
        fn(event);
      }
    };
    if (!once) action();
    else if (event instanceof KeyboardEvent) {
      if (!event.repeat) action();
    }
  };

  /**
   * Ongoing listener for keyboard events. Defaults to entire
   * document if no id and custom mapping.
   *
   * @param {string} [id] - id of the element to attach the event listeners to.
   * @param {KMMapping} [mapping] - keyboard/button mapping object.
   */
  private keyboardListener = (mapping: KMMapping, id?: string) => {
    if (id && mapping) {
      document.getElementById(id)?.addEventListener('keydown', this.addKey(mapping));
      document.getElementById(id)?.addEventListener('keyup', this.removeKey(mapping));
    }
    else if (!Input.documentEventListenersAdded) {
      document.addEventListener('keydown', this.addKey(mapping));
      document.addEventListener('keyup', this.removeKey(mapping));
      Input.documentEventListenersAdded = true;
    }
  };

  /**
   * Ongoing listener for mouse button events. Defaults to
   * entire document if no id and custom mapping.
   *
   * @param {string} [id] - id of the element to attach the event listeners to.
   * @param {KMMapping} [mapping] - keyboard/button mapping object.
   */
  private mouseButtonListener = (mapping: KMMapping, id?: string) => {
    if (id) {
      document.getElementById(id)?.addEventListener('mousedown', this.addButton(mapping));
      document.getElementById(id)?.addEventListener('mouseup', this.removeButton(mapping));
    }
    else if (!Input.documentEventListenersAdded) {
      document.addEventListener('mousedown', this.addButton(mapping));
      document.addEventListener('mouseup', this.removeButton(mapping));
      Input.documentEventListenersAdded = true;
    }
  };

  /**
   * Create a key/mouse event listener.
   *
   * @param {Function} fn - The function to be executed when
   * the keyboard event is triggered.
   * @param {Keyboard} type - The listener type
   * @param {KMMapping} mapping - The keyboard mapping object to
   * check against the keyboard inputs.
   * @param {KMInput[]} inputs - The keyboard inputs to check for.
   * @param {string} id - The optional ID of the HTML element to
   * attach the keyboard event listener to.
   * @param {boolean} once - Fire the action once or repeatedly
   * @return {Function} - The bound function that was created to
   * handle the keyboard event.
   */
  public createEventListener(fn: Function, type: Keyboard | Mouse | DND,
    mapping: KMMapping, inputs: KMInput[], once: boolean, id?: string): Function {
    const bound = this.eventHandler(fn, mapping, inputs, once);
    if (id) {
      document.getElementById(id)?.addEventListener(type, bound);
    }
    else {
      document.addEventListener(type, bound);
    }
    return bound;
  }
}

export { Input };
