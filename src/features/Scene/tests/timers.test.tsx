import '@testing-library/jest-dom/extend-expect';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Scene from '..';
import { AppContextProvider } from '../../../context/appContext';
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
describe('Scene dialogs', () => {
    test('hide/show "DELETE ALL" confirmation after 3 seconds', async () => {
        setupScene();
        const trashButton = screen.getByTitle('trash mode');
        userEvent.click(trashButton);
        const deleteAllButton = await screen.findByRole('button', { name: 'clear canvas'});
        expect(screen.queryByRole('dialog')).toBeFalsy();
        jest.useFakeTimers();
        userEvent.click(deleteAllButton);
        expect(await screen.findByRole('dialog')).toBeTruthy();
        act(() => {
            jest.advanceTimersByTime(3000);
        });
        expect(screen.queryByRole('dialog')).toBeFalsy()
    })
});
