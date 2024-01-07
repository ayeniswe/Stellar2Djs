import '@testing-library/jest-dom/extend-expect';
import { act, renderHook } from '@testing-library/react';
import { LevelEditor } from '../../../../main';
import { useControls } from '../useControls';

beforeAll(() => {
    jest.spyOn(console,"warn").mockImplementation(() => {})
    jest.spyOn(console,"log").mockImplementation(() => {})
    jest.spyOn(console,"error").mockImplementation(() => {})
})

/*
* Setup a canvas element and brush for the Level Editor to use
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

describe('LevelEditor controls', () => {

    test('show "DELETE ALL" confirmation prompt for 3 seconds', async () => {
        const editor = new LevelEditor(context, {})
        await editor.init();
        const { result } = renderHook(() => useControls(editor));
        jest.useFakeTimers();
        result.current.showDeleteConfirmation();
        expect(editor.input.safety).toBe(false);
        act(() => jest.advanceTimersByTime(3000));
        expect(editor.input.safety).toBe(true);
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    })

    test('clear canvas and set safety back', async () => {
        const editor = new LevelEditor(context, {})
        await editor.init();
        const { result } = renderHook(() => useControls(editor));
        result.current.clearCanvas();
        expect(editor.input.safety).toBe(true);
    })

    test('toggle clipping mode', async () => {
        const editor = new LevelEditor(context, {})
        await editor.init();
        const { result } = renderHook(() => useControls(editor));
        const clippingModeStatus = document.createElement('div');
        const clippingModeButton = document.createElement('div');
        clippingModeStatus.id = 'toggle-clipping-status';
        clippingModeButton.id = 'toggle-clipping-button';
        document.body.append(clippingModeButton, clippingModeStatus);
        result.current.toggleClippingMode();
        expect(clippingModeStatus).toHaveAttribute('style', 'background-color: green;');
        result.current.toggleClippingMode();
        expect(clippingModeStatus).toHaveAttribute('style', '');
    })

    test('toggle drag mode', async () => {
        const editor = new LevelEditor(context, {})
        await editor.init();
        const { result } = renderHook(() => useControls(editor));
        const dragModeStatus = document.createElement('div');
        const dragModeButton = document.createElement('div');
        dragModeStatus.id = 'toggle-drag-status';
        dragModeButton.id = 'toggle-drag-button';
        document.body.append(dragModeButton, dragModeStatus);
        result.current.toggleDragMode();
        expect(dragModeStatus).toHaveAttribute('style', 'background-color: green;');
        result.current.toggleDragMode();
        expect(dragModeStatus).toHaveAttribute('style', '');
    })

    test('toggle editing mode', async () => {
        const editor = new LevelEditor(context, {})
        await editor.init();
        const { result } = renderHook(() => useControls(editor));
        const editingModeStatus = document.createElement('div');
        const editingModeButton = document.createElement('div');
        editingModeStatus.id = 'toggle-editing-status';
        editingModeButton.id = 'toggle-editing-button';
        document.body.append(editingModeButton, editingModeStatus);
        result.current.toggleEditingMode();
        expect(editingModeStatus).toHaveAttribute('style', 'background-color: green;');
        result.current.toggleEditingMode();
        expect(editingModeStatus).toHaveAttribute('style', '');
    })

    test('toggle trash mode', async () => {
        const editor = new LevelEditor(context, {})
        await editor.init();
        const { result } = renderHook(() => useControls(editor));
        const trashModeIcon = document.createElement('img');
        const trashModeStatus = document.createElement('div');
        const trashModeButton = document.createElement('div');
        trashModeIcon.id = 'toggle-trash-icon';
        trashModeStatus.id = 'toggle-trash-status';
        trashModeButton.id = 'toggle-trash-button';
        document.body.append(trashModeIcon, trashModeButton, trashModeStatus);
        result.current.toggleTrashMode();
        expect(trashModeIcon).toHaveAttribute('style', 'animation-name: shake;');
        expect(trashModeStatus).toHaveAttribute('style', 'background-color: green;');
        result.current.toggleTrashMode();
        expect(trashModeStatus).toHaveAttribute('style', '');
        expect(trashModeIcon).toHaveAttribute('style', '');
    })
});
