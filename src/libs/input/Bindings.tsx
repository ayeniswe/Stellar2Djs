import { Input, BindingsMapping, Keyboard, KMInput, Mouse, KMMapping, DND } from ".";
/**
 * Sets up the bindings for the keyboard/mouse events to specific keys and/or mouse buttons.
 */
class Bindings extends Input {
    static instance: Bindings | null = null;
    private __bindings: BindingsMapping = {}
    private __mapping: KMMapping;
    private constructor(mapping = {}) {
        super(mapping);
        this.__mapping = mapping;
        Bindings.instance = this;
    }
    get bindings(): BindingsMapping {
        return this.__bindings;
    }
    static getInstance() {
        return Bindings.instance || new Bindings();
    }
    private checkBindingExists(binding: string) {
        return (this.bindings[binding]) ? true : false;
    }
    removeEventListener(binding: string) {
        const id = this.__bindings[binding]?.id;
        const fn: any = this.__bindings[binding]?.fn
        const type = this.__bindings[binding]?.type
        if (id) {
            document.getElementById(id)?.removeEventListener(type, fn)
        } else {
            document.removeEventListener(type, fn)
        }
    }
    removeAllBindings() {
        for (const binding in this.__bindings) {
            this.removeBinding(binding)
        }
    }
    removeBinding(binding: string) {
        this.removeEventListener(binding)
        delete this.__bindings[binding];
    }
    /**
     * Adds a new binding for a given function and input configuration.
     *
     * @param {Function} fn - The function to be executed when the binding is triggered.
     * @param {KMInput[]} inputs - An array of KMInput objects representing the input configuration for the binding.
     * @param {Keyboard | Mouse | Mouse[]} types - The type(s) of input event(s) that will trigger the binding.
     * @param {boolean} [once=true] - Optional. Specifies whether the binding should be triggered only once (default: true).
     * @param {string} [id=""] - Optional. An identifier for the binding.
     * 
     * @description
     * This function adds a new binding for a specific function and input configuration. A binding associates a function with a set of inputs and the event type(s) that will trigger the function execution. Once the binding is added, whenever the specified input event(s) occur, the associated function will be called.
     * 
     * If the `once` parameter is set to `true` (default), the binding will be triggered only once. If set to `false`, the binding will be triggered every time the input event(s) occur.
     * 
     * An optional `id` parameter can be provided to assign an identifier to the binding. This can be useful for targeting specific elements
     */
    addBinding(fn: Function, inputs: KMInput[], types: Keyboard | Mouse | DND | Mouse[], once: boolean = true, id: string = "") {
        // Check if id exists; then switch mapping and
        // intialize new event listeners for element
        const mapping = id ? {} : this.__mapping;
        if (id) new Input(mapping, id);
        // Join inputs together to create a key lookup
        const key = inputs.join(",");
        // Add bindings per type if more than one
        if (Array.isArray(types)) {
            for (const type of types) {
                if (this.checkBindingExists(`${key}+${type}`)) this.removeBinding(key);
                this.__bindings[`${key}+${type}`] = {
                    fn: this.createEventListener(fn, type, mapping, inputs, once, id),
                    id: id,
                    type: type
                }
            }
        } else {
            if (this.checkBindingExists(key)) this.removeBinding(key);
            this.__bindings[key] = {
                fn: this.createEventListener(fn, types, mapping, inputs, once, id),
                id: id,
                type: types
            }
        }
    };
}
export {
    Bindings
}