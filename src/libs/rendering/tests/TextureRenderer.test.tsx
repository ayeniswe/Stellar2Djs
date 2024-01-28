import "jest-canvas-mock"
import { useTextureRenderer } from "..";
import { renderHook } from "@testing-library/react";
const canvas = document.createElement('canvas')
canvas.height = 800
canvas.width = 600
const {
    removeAllTexture, 
    addTexture, 
    removeTexture,
    initialize,
    render,
    undoRevision,
    textureRenderer
} = renderHook(() => useTextureRenderer(canvas.getContext('2d')!)).result.current;
beforeAll(() => {
    jest.spyOn(console,"warn").mockImplementation(() => {})
    jest.spyOn(console,"log").mockImplementation(() => {})
    jest.spyOn(console,"error").mockImplementation(() => {})
})
describe("TextureRenderer", () => {
    test("should not remove non existing texture", () => {
        const res = removeTexture(true, "tilesets", "walls", "1-1", 1, 1);
        expect(res).toEqual([]);
    })
    test("should add texture without clipping", () => {
        const res = addTexture(false, "tilesets", "walls", "1-1", 1, 1);
        expect(res).toEqual([1, 1]);
    })
    test("should add texture with clipping", () => {
        const res = addTexture(true, "tilesets", "walls", "1-1", 1, 1);
        expect(res).toEqual([0, 0]);
    })
    test("should not readd texture", () => {
        const res = addTexture(false, "tilesets", "walls", "1-1", 1, 1);
        expect(res).toEqual([]);
    })
    test("should be able to undo revision until empty", () => {
        expect(undoRevision()).toEqual(true);
        expect(undoRevision()).toEqual(true);
        expect(undoRevision()).toEqual(false);
    })
    test("should remove texture without clipping", () => {
        addTexture(false, "tilesets", "walls", "1-1", 1, 1);
        const res = removeTexture(false, "tilesets", "walls", "1-1", 1, 1);
        expect(res).toEqual([1, 1]);
    })
    test("should remove texture with clipping", () => {
        addTexture(true, "tilesets", "walls", "1-1", 1, 1);
        const res = removeTexture(true, "tilesets", "walls", "1-1", 1, 1);
        expect(res).toEqual([0, 0]);
    })
    test("should add all texture sources at initilization", async () => {
        await initialize();
        expect(Object.keys(textureRenderer.textureSources).length).toBe(2)
    })
    test("render image", async () => {
        // Mock context.drawImage()
        const drawImageMock = jest.spyOn(textureRenderer.ctx, "drawImage");
        await initialize();
        addTexture(false, "tilesets", "walls", "1-1", 1, 1);
        render();
        expect(drawImageMock).toHaveBeenCalledWith(expect.any(Image), 16, 48, 16, 32, 1, 1, 16, 32);
    })
})