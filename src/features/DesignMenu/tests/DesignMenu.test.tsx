import '@testing-library/jest-dom/extend-expect';
import { render, screen} from '@testing-library/react';
import DesignMenu from '..';
import userEvent from '@testing-library/user-event';

const setup = () => render(<DesignMenu/>);
beforeEach(() => {
    //eslint-disable-next-line
    setup();
})

describe ('DesignMenu', () => {

    test('Retrieve tilesets and show a default tileset', () => {
        // Verify tile group section shows
        expect(screen.getByText('Wall')).toBeInTheDocument();
        // Verify total number of tiles show
        const tiles = screen.getAllByTestId('tile', {exact: false})
        expect(tiles.length).toEqual(6);
    });

    test('Select tile', () => {
        // Select new tile
        userEvent.click(screen.getByTestId('tile 1-1'));
        // Verify visual style is added
        expect(screen.getByTestId('tile 1-1').style.opacity).toBe("1");
        userEvent.click(screen.getByTestId('tile 1-2'));
        // Verify visual style is added and removed from previous tile
        expect(screen.getByTestId('tile 1-1').style.opacity).toBe("");
        expect(screen.getByTestId('tile 1-2').style.opacity).toBe("1");
    });

    test('Change tileset', () => {
        // Select new option
        userEvent.selectOptions(screen.getByRole('combobox'), 'grassland');
        // Verify tile previous group section does not shows
        expect(screen.queryByText('Wall')).not.toBeInTheDocument();
        // Verify total number of tiles show
        const tiles = screen.queryAllByTestId('tile')
        expect(tiles.length).toEqual(0);
    });

})