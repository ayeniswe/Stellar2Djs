import { BindingsMapping, DND, Input, Keyboard, KMInput, KMMapping, Mouse } from '.';

/**
 * Sets up the bindings for the keyboard/mouse events
 * to specific keys and/or mouse buttons.
 */
class Bindings extends Input {
  static instance: Bindings | null = null;
  private bindings: BindingsMapping = {};
  private mapping: KMMapping;

  private constructor(mapping = {}) {
    super(mapping);
    this.mapping = mapping;
    Bindings.instance = this;
  }

  static getInstance() {
    return Bindings.instance || new Bindings();
  }

  private checkBindingExists(binding: string) {
    return !!(this.bindings[binding]);
  }

  removeEventListener(binding: string) {
    const id = this.bindings[binding]?.id;
    const fn: any = this.bindings[binding]?.fn;
    const type = this.bindings[binding]?.type;
    if (id) {
      document.getElementById(id)?.removeEventListener(type, fn);
    }
    else {
      document.removeEventListener(type, fn);
    }
  }

  removeAllBindings() {
    for (const binding in this.bindings) {
      if (Object.hasOwn(this.bindings, 'fn')
      && Object.hasOwn(this.bindings, 'id')
      && Object.hasOwn(this.bindings, 'type')) {
        this.removeBinding(binding);
      }
    }
  }

  removeBinding(binding: string) {
    this.removeEventListener(binding);
    delete this.bindings[binding];
  }

  /**
   * Adds a new binding for a given function and input configuration.
   *
   * @param {Function} fn - The function to be executed when
   * the binding is triggered.
   * @param {KMInput[]} inputs - An array of KMInput objects representing
   * the input configuration for the binding.
   * @param {Keyboard | Mouse | Mouse[]} types - The type(s) of input event(s)
   * that will trigger the binding.
   * @param {boolean} [once=true] - Optional. Specifies whether the binding
   * should be triggered only once (default: true).
   * @param {string} [id=""] - Optional. An identifier for the binding.
   *
   * @description
   * This function adds a new binding for a specific function
   * and input configuration. A binding associates a function with a
   * set of inputs and the event type(s) that will trigger the function
   * execution. Once the binding is added, whenever the specified input
   * event(s) occur, the associated function will be called.
   *
   * If the `once` parameter is set to `true` (default), the binding will be
   * triggered only once. If set to `false`, the binding will be triggered
   * every time the input event(s) occur.
   *
   * An optional `id` parameter can be provided to assign an identifier to
   * the binding. This can be useful for targeting specific elements
   */
  addBinding(fn: Function, inputs: KMInput[], types: Keyboard | Mouse | DND | Mouse[],
    once: boolean = true, id: string = '') {
    /*
     * Check if id exists; then switch mapping and
     * initialize new event listeners for element
     */
    const mapping = id
      ? {}
      : this.mapping;
    if (id) new Input(mapping, id);
    // Add bindings per type if more than one
    if (Array.isArray(types)) {
      for (const type of types) {
        // Join inputs , types and id together to create a key lookup
        const key = `${inputs.join(',')}+${type}${id
          ? `+${id}`
          : ''}`;
        if (this.checkBindingExists(key)) this.removeBinding(key);
        this.bindings[key] = {
          fn: this.createEventListener(fn, type, mapping, inputs, once, id),
          id,
          type
        };
      }
    }
    else {
      // Join inputs , types and id together to create a key lookup
      const key = `${inputs.join(',')}+${types}${id
        ? `+${id}`
        : ''}`;
      if (this.checkBindingExists(key)) this.removeBinding(key);
      this.bindings[key] = {
        fn: this.createEventListener(fn, types, mapping, inputs, once, id),
        id,
        type: types
      };
    }
  }
}

export { Bindings };
