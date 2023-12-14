import { Input, BindingsMapping, Keyboard, KMInput, MouseInteraction, KMMapping } from "..";

/**
 * Sets up the bindings for the keyboard/mouse events to specific keys and/or mouse buttons.
 */
class Bindings extends Input {
    private __bindings: BindingsMapping = {}
    private __mapping: KMMapping = {}

    constructor(mapping: KMMapping, id?: string) {
        super(mapping, id);
        this.__mapping = mapping;
    }

    private checkBindingExists(binding: string) {
        return (this.bindings[binding]) ? true : false;
    }
    
    get bindings() : BindingsMapping {
        return this.__bindings;
    }
    
    removeAllBindings() {
        for (const binding in this.__bindings) {
            const id = this.__bindings[binding].id
            const fn: any = this.__bindings[binding].fn
            const type = this.__bindings[binding].type
            if (id) {
                document.getElementById(id)?.removeEventListener(type, fn)
            } else {
                document.removeEventListener(type, fn)
            }
        }
        this.__bindings = {};
    }

    removeBinding(binding: string) {
        const id = this.__bindings[binding].id
        const fn: any = this.__bindings[binding].fn
        const type = this.__bindings[binding].type
        if (id) {
            document.getElementById(id)?.removeEventListener(type, fn)
        } else {
            document.removeEventListener(type, fn)
        }
        delete this.__bindings[binding];
    }

    addBinding(fn: Function, inputs: KMInput[], type: Keyboard | MouseInteraction, once: boolean = true, id: string = "") {
        // Join inputs together to create a key
        const key = inputs.join(",");
        if (this.checkBindingExists(key)) this.removeBinding(key);
        // Check if id exists; then switch mapping and
        // intialize new event listeners for element
        const mapping = id ? {} : this.__mapping;
        if (id) new Input(mapping, id);
        // Add bindings
        this.__bindings[key] = {
            fn: this.__eventListener(fn, type, mapping, inputs, once, id),
            id: id,
            type: type
        }
    };

}

export {
    Bindings
}