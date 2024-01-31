import '@testing-library/jest-dom/extend-expect';
import { act, render, renderHook, screen } from '@testing-library/react';
import { useControls } from '../useControls';
import { useScene } from '../useScene';
import Controls from '../../components/Controls';
import userEvent from '@testing-library/user-event';
beforeAll(() => {
    jest.spyOn(console,"warn").mockImplementation(() => {})
    jest.spyOn(console,"log").mockImplementation(() => {})
    jest.spyOn(console,"error").mockImplementation(() => {})
})
/*
* Setup a canvas element and brush for the scene to use
*/
let context: CanvasRenderingContext2D;
const canvas = document.createElement('canvas');
context = canvas.getContext('2d')!;
if (!context) throw new Error('Could not get 2d context');
const setupPartialControls = () => {
    const scene = renderHook(() => useScene(context, {})).result.current
    render(<Controls scene={scene}/>)
}
const setupFullControls = async () => {
    const scene = renderHook(() => useScene(context, {})).result.current
    await scene.initialize();
    const controls = renderHook(() => useControls(scene)).result.current
    return {
        controls,
        scene
    }
}
describe('SceneEditor controls', () => {
    test('show "DELETE ALL" confirmation prompt for 3 seconds', async () => {
        const { scene, controls } = await setupFullControls();
        jest.useFakeTimers();
        controls.showDeleteConfirmation();
        expect(scene.attrs.input.safety).toBe(false);
        act(() => jest.advanceTimersByTime(3000));
        expect(scene.attrs.input.safety).toBe(true);
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    })
    test('clear canvas and set safety back', async () => {
        const { scene, controls } = await setupFullControls();
        controls.clearCanvas();
        expect(scene.attrs.input.safety).toBe(true);
    })
    test('toggle editing mode', async () => {
        setupPartialControls();
        const button = screen.getByTitle('editing mode');
        const status = screen.getByTestId('editing mode status');
        await userEvent.click(button);
        expect(status.style.fill).toBe('green');
        await userEvent.click(button);
        expect(status.style.fill).toBe('white');
    })
    test('toggle clipping mode', async () => {
        setupPartialControls();
        const button = screen.getByTitle('clipping mode');
        const status = screen.getByTestId('clipping mode status');
        await userEvent.click(button);
        expect(status.style.fill).toBe('green');
        await userEvent.click(button);
        expect(status.style.fill).toBe('white');
    })
    test('toggle drag mode', async () => {
        setupPartialControls();
        const button = screen.getByTitle('drag mode');
        const status = screen.getByTestId('drag mode status');
        await userEvent.click(button);
        expect(status.style.fill).toBe('green');
        await userEvent.click(button);
        expect(status.style.fill).toBe('white');
    })
    test('toggle trash mode', async () => {
        setupPartialControls();
        const button = screen.getByTitle('trash mode');
        const status = screen.getByTestId('trash mode status');
        await userEvent.click(button);
        expect(status.style.fill).toBe('green');
        await userEvent.click(button);
        expect(status.style.fill).toBe('white');
    })
});
