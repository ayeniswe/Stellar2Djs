import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitForElementToBeRemoved, waitFor, act, fireEvent } from '@testing-library/react';
import LevelEditorComp from '..';
import { LevelEditor } from '../../../main/LevelEditor';
import userEvent from '@testing-library/user-event';

// Setup canvas and brush
let ctx: CanvasRenderingContext2D;

const setupCanvas = () => {
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
        fireEvent.click(screen.getByRole('heading'));
        expect(screen.getByRole('combobox')).toBeInTheDocument();
        // Verify panel closes on click on title name
        fireEvent.click(screen.getByRole('heading' , {name: 'LEVEL EDITOR'}));
        expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    });

    test('Turn on/off clipping mode', async () => {
        // Open panel and select any option
        fireEvent.click(screen.getByRole('heading'));
        fireEvent.change(screen.getByRole('combobox'), { target: { value: "grassland" } });
        // Turn on clipping
        const button =  screen.getByRole('button', {name: 'toggle clipping mode'});
        const status = screen.getByRole('status', {name: 'toggle clipping mode'});
        fireEvent.click(button);
        // Verify status is showing green
        expect(status).toHaveStyle('background-color: green');
        // Verify WAI-ARIA
        expect(button).toHaveAccessibleDescription('Turn clipping mode off');
        expect(status.ariaPressed).toBe('true');
        // Turn off clipping
        fireEvent.click(button);
        // Verify status is not showing green
        expect(status).not.toHaveStyle('background-color: green');
        // Verify WAI-ARIA
        expect(button).toHaveAccessibleDescription('Turn clipping mode on');
        expect(status.ariaPressed).toBe('false');

    });

    test('Turn on/off drag mode', async () => {
        // Open panel and select any option
        fireEvent.click(screen.getByRole('heading'));
        fireEvent.change(screen.getByRole('combobox'), { target: { value: "grassland" } });
        // Turn on drag
        const button =  screen.getByRole('button', {name: 'toggle drag mode'});
        const status = screen.getByRole('status', {name: 'toggle drag mode'});
        fireEvent.click(button);
        // Verify status is showing green
        expect(status).toHaveStyle('background-color: green');
        // Verify WAI-ARIA
        expect(button).toHaveAccessibleDescription('Turn drag mode off');
        expect(status.ariaPressed).toBe('true');
        // Turn off drag
        fireEvent.click(button);
        // Verify status is not showing green
        expect(status).not.toHaveStyle('background-color: green');
        // Verify WAI-ARIA
        expect(button).toHaveAccessibleDescription('Turn drag mode on');
        expect(status.ariaPressed).toBe('false');
    });

    test('Turn on/off trash mode', async () => {
        // Open panel and select any option
        fireEvent.click(screen.getByRole('heading'));
        fireEvent.change(screen.getByRole('combobox'), { target: { value: "grassland" } });
        // Turn on trash
        const button =  screen.getByRole('button', {name: 'toggle trash mode'});
        const status = screen.getByRole('status', {name: 'toggle trash mode'});
        fireEvent.click(button);
        // Verify status is showing green
        expect(status).toHaveStyle('background-color: green');
        // Verify WAI-ARIA
        expect(button).toHaveAccessibleDescription('Turn trash mode off');
        expect(status.ariaPressed).toBe('true');
        // Turn off trash
        fireEvent.click(button);
        // Verify status is not showing green
        expect(status).not.toHaveStyle('background-color: green');
        // Verify WAI-ARIA
        expect(button).toHaveAccessibleDescription('Turn trash mode on');
        expect(status.ariaPressed).toBe('false');
    });

    test('Show trash delete all button and trigger confirmation dialog', async () => {
        // Open panel and select any option
        fireEvent.click(screen.getByRole('heading'));
        fireEvent.change(screen.getByRole('combobox'), { target: { value: "grassland" }});
        // Turn on trash
        fireEvent.click(screen.getByRole('button', {name: 'toggle trash mode'}));
        // Click delete all
        fireEvent.click(screen.getByRole('button', {name: 'delete all'}));
        // Verify confirmation dialog and confirm button shows
        const confirmButton = screen.getByRole('button', {name: 'yes to delete all confirmation message'});
        expect(screen.getByRole('dialog', { name: "delete all confirmation message"})).toBeInTheDocument();
        expect(confirmButton).toBeInTheDocument();
        // Advance time and verify dialog automatically closes
        act(() => jest.advanceTimersByTime(3000));
        expect(confirmButton).not.toBeInTheDocument();

    });

    test('Turn on/off edit mode', async () => {
        // Open panel and select any option
        fireEvent.click(screen.getByRole('heading'));
        fireEvent.change(screen.getByRole('combobox'), { target: { value: "grassland" } });
        // Turn on editing
        const button =  screen.getByRole('button', {name: 'toggle editing mode'});
        const status = screen.getByRole('status', {name: 'toggle editing mode'});
        fireEvent.click(button);
        // Verify status is showing green
        expect(status).toHaveStyle('background-color: green');
        // Verify WAI-ARIA
        expect(button).toHaveAccessibleDescription('Turn editing mode off');
        expect(status.ariaPressed).toBe('true');
        // Turn off editing
        fireEvent.click(button);
        // Verify status is not showing green
        expect(status).not.toHaveStyle('background-color: green');
        // Verify WAI-ARIA
        expect(button).toHaveAccessibleDescription('Turn editing mode on');
        expect(status.ariaPressed).toBe('false');
    });

    test('Show tooltip on brush tile', async () => {
        // Open panel
        fireEvent.click(screen.getByRole('heading'));
        // Select new tileset option
        fireEvent.change(screen.getByRole('combobox'), { target: { value: "dungeon" }});
        // Set example tile
        const tileExampleOne = screen.getByRole('button', {name: 'tile 1-1'});
        // Select new tile
        fireEvent.click(tileExampleOne);
        // Verify tooltip shows
        expect(screen.getAllByRole('tooltip')).not.toBeNull(); 
        
        // Comments:
        // could show multiple tooltips but easy to test since every tile is repeated with the same style and the first solution is `display:none` not enabled
    });

    test('Select brush tile', async () => {
        // Open panel
        fireEvent.click(screen.getByRole('heading'));
        // Select new tileset option
        fireEvent.change(await screen.findByRole('combobox'), { target: { value: "dungeon" }});
        // Set example tiles
        const tileExampleOne = screen.getByRole('button', {name: 'tile 1-1'});
        const tileExampleTwo = screen.getByRole('button', {name: 'tile 1-2'});
        // Select new tile
        await fireEvent.click(tileExampleOne);
        // Verify visual style is added
        expect(tileExampleOne.style.opacity).toBe("1");
        expect(tileExampleOne.ariaPressed).toBe("true");
        // Select another new tile
        await fireEvent.click(tileExampleTwo);
        // Verify visual style is removed from previous tile
        expect(tileExampleOne.style.opacity).toBe("");
        expect(tileExampleOne.ariaPressed).toBe("false");
        // Verify visual style is added to new tile
        expect(tileExampleTwo.style.opacity).toBe("1");
        expect(tileExampleTwo.ariaPressed).toBe("true");
    });

    test('Mouse brush shadow effect', async () => {
        // Open panel
        fireEvent.click(screen.getByRole('heading'));
        // Select new tileset option
        fireEvent.change(screen.getByRole('combobox'), { target: { value: "dungeon" }});
        // Set example tile
        const tileExampleOne = screen.getByRole('button', {name: 'tile 1-1'});
        // Select new tile
        fireEvent.click(tileExampleOne);
        // Verify brush is not shown yet
        const style = "display: flex; left: 0px; top: 0px; width: 16px; height: 32px;"
        expect(screen.getByTitle("drawing brush")).not.toHaveStyle(style);
        // Hover on canvas
        userEvent.hover(screen.getByTitle("canvas for drawing"));
        // Verify brush is shown
        expect(screen.getByTitle("drawing brush")).toHaveStyle(style);
        
    })

})
