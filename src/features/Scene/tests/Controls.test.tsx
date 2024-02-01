import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppContextProvider } from '../../../context/appContext';
import Scene from '..';
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
const setupScene = () => {
    render(<Scene/>, { wrapper: AppContextProvider });
}
describe('Scene controls', () => {
    test('toggle editing mode', async () => {
        setupScene();
        const button = await screen.findByTitle('editing mode');
        const status = await screen.findByTestId('editing mode status');
        await userEvent.click(button);
        expect(status.style.fill).toBe('green');
        await userEvent.click(button);
        expect(status.style.fill).toBe('white');
    })
    test('toggle clipping mode', async () => {
        setupScene();
        const button = await screen.findByTitle('clipping mode');
        const status = await screen.findByTestId('clipping mode status');
        await userEvent.click(button);
        expect(status.style.fill).toBe('green');
        await userEvent.click(button);
        expect(status.style.fill).toBe('white');
    })
    test('toggle drag mode', async () => {
        setupScene();
        const button = await screen.findByTitle('drag mode');
        const status = await screen.findByTestId('drag mode status');
        await userEvent.click(button);
        expect(status.style.fill).toBe('green');
        await userEvent.click(button);
        expect(status.style.fill).toBe('white');
    })
    test('toggle trash mode', async () => {
        setupScene();
        const button = await screen.findByTitle('trash mode');
        const status = await screen.findByTestId('trash mode status');
        await userEvent.click(button);
        expect(status.style.fill).toBe('green');
        await userEvent.click(button);
        expect(status.style.fill).toBe('white');
    })
});
