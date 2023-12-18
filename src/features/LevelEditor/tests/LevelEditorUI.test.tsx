import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import LevelEditorComp from '..';
import userEvent from '@testing-library/user-event';
import { LevelEditor } from '../../../main/LevelEditor';

// Setup canvas and brush
let ctx: CanvasRenderingContext2D;

const setupCanvas = () => {
    const canvas = document.createElement('canvas');
    const brush = document.createElement('div');
    brush.id = "Canvas-brush";
    canvas.id = "Canvas";
    canvas.width = 800;
    canvas.height = 600;
    document.body.appendChild(canvas);
    document.body.appendChild(brush);
    ctx = canvas.getContext('2d')!;
    if (!ctx) throw new Error('Could not get 2d context');
}

const setup = async () => {
    const lvl = new LevelEditor(ctx, {});
    await lvl.init();
    render(<LevelEditorComp editor={lvl}/>);
}

beforeAll(() => {
    setupCanvas();
})

beforeEach(() => {
    //eslint-disable-next-line
    setup();
    jest.useFakeTimers();
})

afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
})

describe ('LevelEditor user interactions', () => {

    test('Open/Close panel', async () => {
        // Verify panel closed initially
        expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
        // Verify panel opens on click on title name
        await userEvent.click(screen.getByRole('heading', {name: 'LEVEL EDITOR'}));
        expect(screen.getByRole('combobox')).toBeInTheDocument();
        // Verify panel closes on click on title name
        await userEvent.click(screen.getByRole('heading', {name: 'LEVEL EDITOR'}));
        expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    });

    test('Turn on/off clipping mode', async () => {
        // Open panel and select any option
        await userEvent.click(screen.getByRole('heading', {name: 'LEVEL EDITOR'}));
        userEvent.selectOptions(screen.getByRole('combobox'), 'grassland');
        // Turn on clipping
        const button = screen.getByRole('button', {name: 'toggle clipping mode'});
        const status = screen.getByRole('checkbox', {name: 'toggle clipping mode'});
        userEvent.click(button);
        // Verify accessible title shows it can be turned off and
        // status shows it is on by becoming green
        expect(button).toHaveAccessibleDescription('Turn clipping mode off');
        expect(status).toHaveStyle('background-color: green');
        expect(status.ariaChecked).toBe('true');
        // Turn off clipping
        userEvent.click(button);
        // Verify accessible title shows it can be turned on and
        // status shows it is off by becoming not green
        expect(button).toHaveAccessibleDescription('Turn clipping mode on');
        expect(status).not.toHaveStyle('background-color: green');
        expect(status.ariaChecked).toBe('false');

    });

    test('Turn on/off drag mode', async () => {
        // Open panel and select any option
        await userEvent.click(screen.getByRole('heading', {name: 'LEVEL EDITOR'}));
        userEvent.selectOptions(screen.getByRole('combobox'), 'grassland');
        // Turn on drag
        const button = screen.getByRole('button', {name: 'toggle drag mode'});
        const status = screen.getByRole('checkbox', {name: 'toggle drag mode'});
        userEvent.click(button);
        // Verify accessible title shows it can be turned off and
        // status shows it is on by becoming green
        expect(button).toHaveAccessibleDescription('Turn drag mode off');
        expect(status).toHaveStyle('background-color: green');
        expect(status.ariaChecked).toBe('true');
        // Turn off drag
        userEvent.click(button);
        // Verify accessible title shows it can be turned on and
        // status shows it is off by becoming not green
        expect(button).toHaveAccessibleDescription('Turn drag mode on');
        expect(status).not.toHaveStyle('background-color: green');
        expect(status.ariaChecked).toBe('false');

    });

    test('Turn on/off trash mode', async () => {
        // Open panel and select any option
        await userEvent.click(screen.getByRole('heading', {name: 'LEVEL EDITOR'}));
        userEvent.selectOptions(screen.getByRole('combobox'), 'grassland');
        // Turn on trash
        const button = screen.getByRole('button', {name: 'toggle trash mode'});
        const status = screen.getByRole('checkbox', {name: 'toggle trash mode'});
        userEvent.click(button);
        // Verify accessible title shows it can be turned off and
        // status shows it is on by becoming green
        expect(button).toHaveAccessibleDescription('Turn trash mode off');
        expect(status).toHaveStyle('background-color: green');
        expect(status.ariaChecked).toBe('true');
        // Turn off trash
        userEvent.click(button);
        // Verify accessible title shows it can be turned on and
        // status shows it is off by becoming not green
        expect(button).toHaveAccessibleDescription('Turn trash mode on');
        expect(status).not.toHaveStyle('background-color: green');
        expect(status.ariaChecked).toBe('false');

    });

    test('Show trash delete all button and trigger confirmation dialog', async () => {
        // Open panel and select any option
        await userEvent.click(screen.getByRole('heading', {name: 'LEVEL EDITOR'}));
        userEvent.selectOptions(screen.getByRole('combobox'), 'grassland');
        // Turn on trash
        const button = screen.getByRole('button', {name: 'toggle trash mode'});
        await userEvent.click(button);
        // Click delete all
        const deleteButton = screen.getByRole('button', {name: 'delete all'});
        await userEvent.click(deleteButton);
        // Verify confirmation dialog
        const dialog = screen.queryByText("Are you sure? Action can't be UNDONE!");
        const confirmButton = screen.getByRole('button', {name: 'delete all confirm'});
        expect(dialog).toBeInTheDocument();
        expect(confirmButton).toBeInTheDocument();
        // Advance time and verify dialog automatically closes
        jest.advanceTimersByTime(3000);
        await waitFor(() => expect(confirmButton).not.toBeInTheDocument());

    });

    test('Turn on/off edit mode', async () => {
        // Open panel and select any option
        await userEvent.click(screen.getByRole('heading', {name: 'LEVEL EDITOR'}));
        userEvent.selectOptions(screen.getByRole('combobox'), 'grassland');
        // Turn on edit
        const button = screen.getByRole('button', {name: 'toggle editing mode'});
        const status = screen.getByRole('checkbox', {name: 'toggle editing mode'});
        userEvent.click(button);
        // Verify accessible title shows it can be turned off and
        // status shows it is on by becoming green
        expect(button).toHaveAccessibleDescription('Turn edit mode off');
        expect(status).toHaveStyle('background-color: green');
        expect(status.ariaChecked).toBe('true');
        // Turn off edit
        userEvent.click(button);
        // Verify accessible title shows it can be turned on and
        // status shows it is off by becoming not green
        expect(button).toHaveAccessibleDescription('Turn edit mode on');
        expect(status).not.toHaveStyle('background-color: green');
        expect(status.ariaChecked).toBe('false');

    });

    test('Select brush tile', async () => {
        // Open panel
        await userEvent.click(screen.getByRole('heading', {name: 'LEVEL EDITOR'}));
        // Select new tileset option
        userEvent.selectOptions(screen.getByRole('combobox'), 'dungeon');
        // Set example tiles
        const tileExampleOne = screen.getByRole('checkbox', {name: 'tile 1-1'});
        const tileExampleTwo = screen.getByRole('checkbox', {name: 'tile 1-2'});
        // Select new tile
        userEvent.click(tileExampleOne);
        // Verify visual style is added
        expect(tileExampleOne.style.opacity).toBe("1");
        expect(tileExampleOne.ariaChecked).toBe("true");
        // Select another new tile
        userEvent.click(tileExampleTwo);
        // Verify visual style is removed from previous tile
        expect(tileExampleOne.style.opacity).toBe("");
        expect(tileExampleOne.ariaChecked).toBe("false");
        // Verify visual style is added to new tile
        expect(tileExampleTwo.style.opacity).toBe("1");
        expect(tileExampleTwo.ariaChecked).toBe("true");
    });

    test('Mouse brush shadow effect', async () => {
        // Open panel
        await userEvent.click(screen.getByRole('heading', {name: 'LEVEL EDITOR'}));
        // Select new tileset option
        userEvent.selectOptions(screen.getByRole('combobox'), 'dungeon');
        // Set example tile
        const tileExampleOne = screen.getByRole('checkbox', {name: 'tile 1-1'});
        // Select new tile
        userEvent.click(tileExampleOne);
        // Verify brush is not shown yet
        expect(document.getElementById("Canvas-brush")!).toHaveStyle("");
        // Hover on canvas
        await userEvent.hover(document.getElementById("Canvas")!);
        // Verify brush is shown
        await waitFor(() => {
            expect(document.getElementById("Canvas-brush")!).toHaveStyle("display: flex; left: 0px; top: 0px; width: 16px; height: 32px;");
        });
        
    })

})

// Additional test
// - Verify hover effect on tile to see tooltip [VISUAL]