import '@testing-library/jest-dom/extend-expect';
import { render, screen, act, fireEvent, waitFor, waitForElementToBeRemoved, cleanup } from '@testing-library/react';
import LevelEditorComp from '..';
import { LevelEditor } from '../../../main/LevelEditor';
import userEvent from '@testing-library/user-event';

/*
* Setup a canvas element for the Level Editor to use
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

/*
* Render the Level Editor with a global context
*/
const setup = async () => {
    const editor = new LevelEditor(context, {});
    await editor.init();
    render(<LevelEditorComp editor={editor}/>);
}

describe ('LevelEditor keyboard shortcuts', () => {
    /*
    * Unable to use jest advanceTimersByTime. This would decrease test speed.
    * See https://github.com/testing-library/jest-dom/issues/111
    */
    test('Display "Delete All" confirmation prompt w/ keyboard', async () => {
        await setup();
        // Click tab "Level Editor"
        userEvent.click(screen.getByRole('heading'));
        // Select any dropdown options from "Select Tileset"
        const options = await screen.findByRole('combobox');
        userEvent.selectOptions(options, "grassland")
        // Press [Control + a]
        userEvent.keyboard('{Control>}a');
        // Wait for prompt then verify the prompt is displayed
        expect(await screen.findByRole('dialog', { name: 'confirmation message to delete all placed tiles in canvas'})).toBeInTheDocument();
        // Wait for prompt to close after 3 seconds then verify the prompt is no longer displayed
        await waitFor(() => expect(screen.queryByRole('dialog', { name: 'confirmation message to delete all placed tiles in canvas'})).not.toBeInTheDocument(), { timeout: 3000 });
    });

    test('Turn on/off editing mode w/ keyboard', async () => {
        await setup();
        // Click tab "Level Editor"
        userEvent.click(screen.getByRole('heading'));
        // Wait for options to load and select any dropdown options from "Select Tileset"
        const options = await screen.findByRole('combobox');
        userEvent.selectOptions(options, "grassland")
        // Get status icon
        const status = await screen.findByRole('status', { name: "editing status"});
        // Press e
        userEvent.keyboard('e');
        // Verify that editing mode status is green
        await waitFor(() => expect(status).toHaveAttribute("style", "background-color: green;"))
        // Press e
        userEvent.keyboard('e');
        // Verify that editing mode status is no longer green
        await waitFor(() => expect(status).toHaveAttribute("style",""))
    });

    test('Turn on/off clipping mode w/ keyboard', async () => {
        await setup();
        // Click tab "Level Editor"
        userEvent.click(screen.getByRole('heading'));
        // Wait for options to load and select any dropdown options from "Select Tileset"
        const options = await screen.findByRole('combobox');
        userEvent.selectOptions(options, "grassland")
        // Get status icon
        const status = await screen.findByRole('status', { name: "clipping status"});
        // Press c
        userEvent.keyboard('c');
        // Verify that clipping mode status is green
        await waitFor(() => expect(status).toHaveAttribute("style", "background-color: green;"))
        // Press c
        userEvent.keyboard('c');
        // Verify that clipping mode status is no longer green
        await waitFor(() => expect(status).toHaveAttribute("style",""))
    });

    test('Turn on/off drag mode w/ keyboard', async () => {
        await setup();
        // Click tab "Level Editor"
        userEvent.click(screen.getByRole('heading'));
        // Wait for options to load and select any dropdown options from "Select Tileset"
        const options = await screen.findByRole('combobox');
        userEvent.selectOptions(options, "grassland")
        // Get status icon
        const status = await screen.findByRole('status', { name: "drag status"});
        // Press d
        userEvent.keyboard('d');
        // Verify that drag mode status is green
        await waitFor(() => expect(status).toHaveAttribute("style", "background-color: green;"))
        // Press d
        userEvent.keyboard('d');
        // Verify that drag mode status is no longer green
        await waitFor(() => expect(status).toHaveAttribute("style",""))
    });

    test('Turn on/off trash mode w/ keyboard', async () => {
        await setup();
        // Click tab "Level Editor"
        userEvent.click(screen.getByRole('heading'));
        // Wait for options to load and select any dropdown options from "Select Tileset"
        const options = await screen.findByRole('combobox');
        userEvent.selectOptions(options, "grassland")
        // Get status icon
        const status = await screen.findByRole('status', { name: "trash status"});
        // Press [Delete]
        userEvent.keyboard('[Delete]');
        // Verify that trash mode status is green
        await waitFor(() => expect(status).toHaveAttribute("style", "background-color: green;"))
        // Press [Delete]
        userEvent.keyboard('[Delete]');
        // Verify that trash mode status is no longer green
        await waitFor(() => expect(status).toHaveAttribute("style",""))
    });
})

describe ('LevelEditor user interactions', () => {

    test('Display "Delete All" confirmation prompt', async () => {
        await setup();
        // Click tab "Level Editor"
        userEvent.click(screen.getByRole('heading'));
        // Select any dropdown options from "Select Tileset"
        const options = await screen.findByRole('combobox');
        userEvent.selectOptions(options, "grassland")
        // Click trash icon
        userEvent.click(await screen.findByRole('button', {name: 'trash off'}));
        // Click delete all button
        userEvent.click(await screen.findByRole('button', {name: 'delete all placed tiles in canvas'}));
        // Wait for prompt then verify the prompt is displayed
        expect(await screen.findByRole('dialog', { name: 'confirmation message to delete all placed tiles in canvas'})).toBeInTheDocument();
        // Wait for prompt to close after 3 seconds then verify the prompt is no longer displayed
        await waitFor(() => expect(screen.queryByRole('dialog', { name: 'confirmation message to delete all placed tiles in canvas'})).not.toBeInTheDocument(), { timeout: 3000 });

    });

    test('Open/Close panel', async () => {
        await setup();
        // Click tab "Level Editor"
        userEvent.click(screen.getByRole('heading'));
        // Verify options are available
        expect(await screen.findByRole('combobox')).toBeInTheDocument();
        // Click tab "Level Editor"
        userEvent.click(screen.getByRole('heading' , {name: 'LEVEL EDITOR'}));
        // Verify options are no longer available
        await waitForElementToBeRemoved(screen.queryByRole('combobox'));
    });

    test('Turn on/off clipping mode', async () => {
        await setup();
        // Click tab "Level Editor"
        userEvent.click(screen.getByRole('heading'));
        // Select any dropdown options from "Select Tileset"
        userEvent.selectOptions(await screen.findByRole('combobox'), "grassland");
        // Get status icon and clipping icon button
        const button = await screen.findByRole('button', {name: 'clipping off'});
        const status = await screen.findByRole('status', {name: 'clipping status'});
        // Click clipping icon
        userEvent.click(button);
        // Verify status is showing green and is asscessible
        await waitFor(() => {
            expect(status).toHaveAttribute("style", "background-color: green;")
        })
        expect(button).toHaveAccessibleDescription('clipping mode');
        expect(button.ariaLabel).toBe('clipping on');
        // Click clipping icon
        userEvent.click(button);
        // Verify status is not showing green and is still asscessible
        await waitFor(() => {
            expect(status).toHaveAttribute("style", "")
        })
        expect(button).toHaveAccessibleDescription('clipping mode');
        expect(button.ariaLabel).toBe('clipping off');
    });

    test('Turn on/off drag mode', async () => {
        await setup();
        // Click tab "Level Editor"
        userEvent.click(screen.getByRole('heading'));
        // Select any dropdown options from "Select Tileset"
        userEvent.selectOptions(await screen.findByRole('combobox'), "grassland");
        // Get status icon and drag icon button
        const button = await screen.findByRole('button', {name: 'drag off'});
        const status = await screen.findByRole('status', {name: 'drag status'});
        // Click drag icon
        userEvent.click(button);
        // Verify status is showing green and is asscessible
        await waitFor(() => {
            expect(status).toHaveAttribute("style", "background-color: green;")
        })
        expect(button).toHaveAccessibleDescription('drag mode');
        expect(button.ariaLabel).toBe('drag on');
        // Click drag icon
        userEvent.click(button);
        // Verify status is not showing green and is still asscessible
        await waitFor(() => {
            expect(status).toHaveAttribute("style", "")
        })
        expect(button).toHaveAccessibleDescription('drag mode');
        expect(button.ariaLabel).toBe('drag off');
    });

    test('Turn on/off trash mode', async () => {
        await setup();
        // Click tab "Level Editor"
        userEvent.click(screen.getByRole('heading'));
        // Select any dropdown options from "Select Tileset"
        userEvent.selectOptions(await screen.findByRole('combobox'), "grassland");
        // Get status icon and trash icon button
        const button = await screen.findByRole('button', {name: 'trash off'});
        const status = await screen.findByRole('status', {name: 'trash status'});
        // Click trash icon
        userEvent.click(button);
        // Verify status is showing green and is asscessible
        await waitFor(() => {
            expect(status).toHaveAttribute("style", "background-color: green;")
        })
        expect(button).toHaveAccessibleDescription('trash mode');
        expect(button.ariaLabel).toBe('trash on');
        // Click trash icon
        userEvent.click(button);
        // Verify status is not showing green and is still asscessible
        await waitFor(() => {
            expect(status).toHaveAttribute("style", "")
        })
        expect(button).toHaveAccessibleDescription('trash mode');
        expect(button.ariaLabel).toBe('trash off');
    });


    test('Turn on/off edit mode', async () => {
        await setup();
        // Click tab "Level Editor"
        userEvent.click(screen.getByRole('heading'));
        // Select any dropdown options from "Select Tileset"
        userEvent.selectOptions(await screen.findByRole('combobox'), "grassland");
        // Get status icon and editing icon button
        const button = await screen.findByRole('button', {name: 'editing off'});
        const status = await screen.findByRole('status', {name: 'editing status'});
        // Click editing icon
        userEvent.click(button);
        // Verify status is showing green and is asscessible
        await waitFor(() => {
            expect(status).toHaveAttribute("style", "background-color: green;")
        })
        expect(button).toHaveAccessibleDescription('editing mode');
        expect(button.ariaLabel).toBe('editing on');
        // Click editing icon
        userEvent.click(button);
        // Verify status is not showing green and is still asscessible
        await waitFor(() => {
            expect(status).toHaveAttribute("style", "")
        })
        expect(button).toHaveAccessibleDescription('editing mode');
        expect(button.ariaLabel).toBe('editing off');
    });

    test('Show tooltip on brush tile', async () => {
        await setup();
        // Click tab "Level Editor"
        userEvent.click(screen.getByRole('heading'));
        // Select 'dungeon' (will fail if not chosen) dropdown options from "Select Tileset"
        userEvent.selectOptions(await screen.findByRole('combobox'), "dungeon");
        // Get an example tile
        const tileExampleOne = await screen.findByRole('button', {name: 'tile: barwindow_wall'});
        // Click the example tile
        userEvent.click(tileExampleOne);
        // Verify tooltip shows
        expect(tileExampleOne.title).toMatch("16 x 32\n16 , 48");
    });

    test('Select brush tile', async () => {
        await setup();
        // Click tab "Level Editor"
        userEvent.click(screen.getByRole('heading'));
        // Select 'dungeon' (will fail if not chosen) dropdown options from "Select Tileset"
        userEvent.selectOptions(await screen.findByRole('combobox'), "dungeon");
        // Get example tiles
        const tileExampleOne = await screen.findByRole('button', {name: 'tile: barwindow_wall'});
        const tileExampleTwo = await screen.findByRole('button', {name: 'tile: damaged_wall'});
        // Click the example tile
        userEvent.click(tileExampleOne);
        // Verify visual style is added to tile and is asscessible
        await waitFor(() => {
            expect(tileExampleOne.style.opacity).toBe("1");
        })
        expect(tileExampleOne.ariaPressed).toBe("true");
        // Click a different example tile
        userEvent.click(tileExampleTwo);
        // Verify visual style is removed from previous tile
        await waitFor(() => {
            expect(tileExampleOne.style.opacity).toBe("");
        })
        expect(tileExampleOne.ariaPressed).toBe("false");
        // Verify visual style is added to new tile and is asscessible
        expect(tileExampleTwo.style.opacity).toBe("1");
        expect(tileExampleTwo.ariaPressed).toBe("true");
    });

    test('Mouse brush shadow effect', async () => {
        cleanup();
        await setup();
        // Click tab "Level Editor"
        userEvent.click(screen.getByRole('heading'));
        // Select 'dungeon' (will fail if not chosen) dropdown options from "Select Tileset"
        userEvent.selectOptions(await screen.findByRole('combobox'), "dungeon");
        // Get example tiles
        const tileExampleOne = await screen.findByRole('button', {name: 'tile: barwindow_wall'});
        // Select the example tile
        userEvent.click(tileExampleOne);
        // Verify brush is not shown yet
        const style = "display: flex; left: 0px; top: 0px; width: 16px; height: 32px;"
        expect(screen.getByTitle("drawing brush")).not.toHaveStyle(style);
        // Hover over the canvas
        userEvent.hover(screen.getByTitle("canvas for drawing"));
        // Verify brush is shown
        await waitFor(() => {
            expect(screen.getByTitle("drawing brush")).toHaveStyle(style);
        })
        
    })
})

// Notes
// - test undo