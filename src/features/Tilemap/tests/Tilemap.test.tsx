import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { AppContextProvider } from '../../../context/appContext';
import Tilemap from '..';
import 'jest-canvas-mock'
import userEvent from '@testing-library/user-event';
beforeAll(() => {
    jest.spyOn(console,"warn").mockImplementation(() => {})
    jest.spyOn(console,"log").mockImplementation(() => {})
    jest.spyOn(console,"error").mockImplementation(() => {})
})
const setupTilemap = () => {
    render(<Tilemap/>, { wrapper: AppContextProvider });
}
describe('Tilemap', () => {
    test('default no tilesets selected', async () => {
        setupTilemap();
        const tilesets = await screen.findByText('No Tileset Selected');
        expect(tilesets).toBeTruthy();
    })
    test('categories are populated', async () => {
        setupTilemap();
        const tilesets = await screen.findAllByRole('option');
        expect(tilesets.length).toBe(2);
    });
    test('set new brush tile', async () => {
        setupTilemap();
        const tilesets = await screen.findByRole('combobox');
        userEvent.selectOptions(tilesets, '1');
        const tile1 = await screen.findByRole('button', { name: 'tile: barwindow_wall' });
        const tile2 = await screen.findByRole('button', { name: 'tile: plain_wall' });
        await userEvent.click(tile1);
        expect(tile1.style.opacity).toBe('1');
        await userEvent.click(tile2);
        expect(tile1.style.opacity).toBe('');
        expect(tile2.style.opacity).toBe('1');
    });
});
