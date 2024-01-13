import '@testing-library/jest-dom/extend-expect';
import { renderHook, render, screen } from '@testing-library/react';
import { SceneEditor } from '../../../../libs/SceneEditor';
import { useEditor } from '../useEditor';

beforeAll(() => {
    jest.spyOn(console,"warn").mockImplementation(() => {})
    jest.spyOn(console,"log").mockImplementation(() => {})
    jest.spyOn(console,"error").mockImplementation(() => {})
})

/*
* Setup a canvas element and bruah for the Level Editor to use
*/
let context: CanvasRenderingContext2D;
const canvas = document.createElement('canvas');
const brush = document.createElement('div');
brush.id = "Canvas-brush";
brush.title = "drawing brush";
canvas.id = "Canvas";
canvas.title = "canvas for drawing";
canvas.width = 800;
canvas.height = 600;
document.body.appendChild(canvas);
document.body.appendChild(brush);
context = canvas.getContext('2d')!;
if (!context) throw new Error('Could not get 2d context');

describe('SceneEditor editor', () => {

    test('default tileset is empty', async () => {
        const editor = new SceneEditor(context, {})
        await editor.init();
        const { result } = renderHook(() => useEditor(editor));
        expect(result.current.TILESET_KEY.value).toBe('');
    })

    test('parse tilesets from data config JSON', async () => {
        const editor = new SceneEditor(context, {})
        await editor.init();
        const { result } = renderHook(() => useEditor(editor));
        result.current.setTilesetKey("1");
        expect(result.current.TILESET_KEY.value).toBe("1");
        await result.current.setTileset();
        render(result.current.showTileset().value);
        expect(screen.getAllByRole('button')).toBeTruthy();
    })

    test('get list of categories', async () => {
        const editor = new SceneEditor(context, {})
        await editor.init();
        const { result } = renderHook(() => useEditor(editor));
        expect(result.current.getTilesets().length).toBe(2);
    })

    test('open/close Tab', async () => {
        const editor = new SceneEditor(context, {})
        await editor.init();
        const { result } = renderHook(() => useEditor(editor));
        expect(result.current.EDITOR_TAB.value).toBe(false);
        result.current.toggleEditorTab();
        expect(result.current.EDITOR_TAB.value).toBe(true);
        editor.input.ready = true;
        result.current.TILESET_KEY.value = "1"
        result.current.TILESET.value = <div>Test</div>;
        result.current.toggleEditorTab();
        expect(result.current.EDITOR_TAB.value).toBe(false);
        expect(result.current.TILESET_KEY.value).toBe('');
        expect(editor.input.ready).toBe(false);
        expect(result.current.TILESET.value).toStrictEqual(<></>);

    })

    test('set new brush tile', async () => {
        const editor = new SceneEditor(context, {})
        await editor.init();
        const { result } = renderHook(() => useEditor(editor));
        result.current.setTilesetKey("1");
        await result.current.setTileset();
        render(result.current.showTileset().value);
        result.current.setTileBrush("1-1", "wall", { sx: 0, sy: 0, w: 0, h: 0, name: 'testtile' });
        expect(screen.getByLabelText("tile: barwindow_wall")).toHaveAttribute('style', 'opacity: 1;');
        result.current.setTileBrush("1-2", "wall", { sx: 0, sy: 0, w: 0, h: 0, name: 'testtile' });
        expect(screen.getByLabelText("tile: barwindow_wall")).toHaveAttribute('style', '');
        expect(screen.getByLabelText("tile: damaged_wall")).toHaveAttribute('style', 'opacity: 1;');
    });

    // NOTE: this test is not working.
    // will need this line to pass this test:
    // background.onload = () => ctx.drawImage(background, sx, sy, w, h, 0, 0, w, h);

    // test('set background for tiles', async () => {
    //     const editor = new SceneEditor(context, {})
    //     await editor.init();
    //     const { result } = renderHook(() => useEditor(editor));
    //     result.current.setTilesetKey("1");
    //     await result.current.setTileset();
    //     render(result.current.showTileset().value);
    //     result.current.setTilesBackground();
    //     expect(screen.getByLabelText('tile: barwindow_wall')).toHaveAttribute('style', 'background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAABmJLR0QA/wD/AP+gvaeTAAAAGElEQVRIiWNgGAWjYBSMglEwCkbBKEAFAAggAAG9MfzxAAAAAElFTkSuQmCC);');
    // })
});
