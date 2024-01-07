import { TextureRenderer } from "..";
import "jest-canvas-mock"
let renderer: TextureRenderer;

beforeAll(() => {
    jest.spyOn(console,"warn").mockImplementation(() => {})
    jest.spyOn(console,"log").mockImplementation(() => {})
    jest.spyOn(console,"error").mockImplementation(() => {})
})

beforeAll(() => {
    const canvas = document.createElement('canvas')
    canvas.height = 800
    canvas.width = 600
    renderer = new TextureRenderer(canvas.getContext('2d')!);
})

describe("TextureRenderer", () => {

    test("should not remove non existing texture", () => {
        const res = renderer.removeTexture(true, "tilesets", "walls", "1-1", 1, 1);
        expect(res).toEqual([]);
    })

    test("should add texture without clipping", () => {
        const res = renderer.addTexture(false, "tilesets", "walls", "1-1", 1, 1);
        expect(res).toEqual([1, 1]);
    })

    test("should add texture with clipping", () => {
        const res = renderer.addTexture(true, "tilesets", "walls", "1-1", 1, 1);
        expect(res).toEqual([0, 0]);
    })

    test("should not readd texture", () => {
        const res = renderer.addTexture(false, "tilesets", "walls", "1-1", 1, 1);
        expect(res).toEqual([]);
    })

    test("should be able to undo revision until empty", () => {
        expect(renderer.undoRevision()).toEqual(true);
        expect(renderer.undoRevision()).toEqual(true);
        expect(renderer.undoRevision()).toEqual(false);
    })

    test("should remove texture without clipping", () => {
        renderer.addTexture(false, "tilesets", "walls", "1-1", 1, 1);
        const res = renderer.removeTexture(false, "tilesets", "walls", "1-1", 1, 1);
        expect(res).toEqual([1, 1]);
    })
    
    test("should remove texture with clipping", () => {
        renderer.addTexture(true, "tilesets", "walls", "1-1", 1, 1);
        const res = renderer.removeTexture(true, "tilesets", "walls", "1-1", 1, 1);
        expect(res).toEqual([0, 0]);
    })

    test("should add all texture sources at initilization", async () => {
        await renderer.init();
        expect(Object.keys(renderer.textureSources).length).toBe(2)
    })

    test("render image", async () => {
        // Mock context.drawImage()
        const drawImageMock = jest.spyOn(renderer.ctx, "drawImage");
        await renderer.init();
        renderer.addTexture(false, "tilesets", "walls", "1-1", 1, 1);
        renderer.render();
        expect(drawImageMock).toHaveBeenCalledWith(expect.any(Image), 16, 48, 16, 32, 1, 1, 16, 32);
    })

})