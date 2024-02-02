import { Bindings } from "../Bindings";
beforeAll(() => {
    jest.spyOn(console,"warn").mockImplementation(() => {})
    jest.spyOn(console,"log").mockImplementation(() => {})
    jest.spyOn(console,"error").mockImplementation(() => {})
})
describe("Bindings", () => {
    test("Binding is added", () => {
        const bindings = Bindings.getInstance();
        bindings.addBinding(()=>{}, ["a"], "keydown");
        expect(bindings.bindings["a"].fn).toBeDefined()
        expect(bindings.bindings["a"].id).toBe("")
        expect(bindings.bindings["a"].type).toBe("keydown")
    })
    test("Binding is removed", () => {
        const bindings = Bindings.getInstance();
        bindings.addBinding(()=>{}, ["a"], "keydown");
        expect(bindings.bindings["a"]).toBeDefined()
        bindings.removeBinding("a");
        expect(bindings.bindings["a"]).toBeUndefined()
    })
    test("Bindings are all removed", () => {
        const bindings = Bindings.getInstance();
        bindings.addBinding(()=>{}, ["a"], "keydown");
        bindings.addBinding(()=>{}, ["b"], "keydown");
        bindings.addBinding(()=>{}, ["c"], "keydown");
        bindings.removeAllBindings();
        expect(bindings.bindings).toMatchObject({})
    })
})