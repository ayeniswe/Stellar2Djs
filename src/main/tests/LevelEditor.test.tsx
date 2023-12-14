import '@testing-library/jest-dom/extend-expect';
import { LevelEditor } from '../LevelEditor';
import userEvent from '@testing-library/user-event'
import { MESSAGE } from '../../libs/logging';
import { LevelEditorDesign } from '../../libs/design/level';

let warn: jest.SpyInstance, log: jest.SpyInstance;
warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
log = jest.spyOn(console, 'log').mockImplementation(() => {});

test('textures are loaded and initial keyboard/mouse buttons are detected', async () => {

    // Create mock canvas and add to body
    const canvas = document.createElement('canvas');
    canvas.id = "Canvas";
    canvas.width = 800;
    canvas.height = 600;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d')!;
    if (!ctx) throw new Error('Could not get 2d context');

    // Setup an intial bindings for the entire document
    await new LevelEditor(ctx, {}).init();

    // ASSERTION: check textures and assets loaded
    // =============================================

    // Verify textures are loaded
    expect(log).toHaveBeenCalledWith(`${MESSAGE.ADDING_TEXTURE} Tiles`);
    expect(log).toHaveBeenLastCalledWith(`${MESSAGE.ADDING_TEXTURE} Frames`);

    // ASSERTION: check key/button bindings
    // =============================================

    // Left mouse button click does not work on document
    userEvent.click(document.body, { button: 0 });
    expect(warn).not.toHaveBeenLastCalledWith();

    // Left mouse button click does not work on canvas when edit is off
    userEvent.click(canvas, { button: 0 });
    expect(warn).toHaveBeenLastCalledWith(`${MESSAGE.EDITING} off`);

    // Left mouse button click does not work on canvas when brush is not set
    userEvent.keyboard('{e}');
    expect(warn).toHaveBeenLastCalledWith(`${MESSAGE.EDITING} on`);
    userEvent.click(canvas, { button: 0 });
    expect(warn).toHaveBeenLastCalledWith(MESSAGE.BRUSH_NOT_SET + " "); // jest adds a space
    LevelEditorDesign.brush = {id: "1-1", name: "plain_wall", group: "wall"}; // a static setting from json configs
    userEvent.click(canvas, { button: 0, clientX: 0, clientY: 0 });
    expect(log).toHaveBeenLastCalledWith(`${MESSAGE.RENDER_POSITION} X: NaN, Y: NaN`);

    // Can not remove objects if trash mode is off
    userEvent.click(canvas, { button: 0, clientX: 0, clientY: 0 });
    expect(log).not.toHaveBeenLastCalledWith(`${MESSAGE.REMOVE_POSITION} X: NaN, Y: NaN`);

    // Can remove objects if trash mode is on
    userEvent.keyboard('{Delete}');
    userEvent.click(canvas, { button: 0, clientX: 0, clientY: 0 });
    expect(log).toHaveBeenLastCalledWith(`${MESSAGE.REMOVE_POSITION} X: NaN, Y: NaN`);

    // // Toggle editing mode
    userEvent.keyboard('{e}');
    expect(warn).toHaveBeenLastCalledWith(`${MESSAGE.EDITING} off`);
    userEvent.keyboard('{e}');
    expect(warn).toHaveBeenLastCalledWith(`${MESSAGE.EDITING} on`);

    // // Toggle clipping mode
    userEvent.keyboard('{c}');
    expect(warn).toHaveBeenLastCalledWith(`${MESSAGE.CLIPPING} off`);
    userEvent.keyboard('{c}');
    expect(warn).toHaveBeenLastCalledWith(`${MESSAGE.CLIPPING} on`);

    // // Toggle drag mode
    userEvent.keyboard('{d}');
    expect(warn).toHaveBeenLastCalledWith(`${MESSAGE.DRAG} on`);
    userEvent.keyboard('{d}');
    expect(warn).toHaveBeenLastCalledWith(`${MESSAGE.DRAG} off`);

    // Toggle trash mode
    userEvent.keyboard('{Delete}');
    expect(warn).toHaveBeenLastCalledWith(`${MESSAGE.TRASH} off`);
    userEvent.keyboard('{Delete}');
    expect(warn).toHaveBeenLastCalledWith(`${MESSAGE.TRASH} on`);
    
    // Attempt to clear all from canvas but prevent
    userEvent.keyboard('{Control>}a');
    expect(warn).toHaveBeenLastCalledWith(MESSAGE.SERIOUS_ACTION + " "); // jest adds a space
    userEvent.keyboard('{/Control}');

    // Verify total mock calls
    expect(warn).toBeCalledTimes(14);
    expect(log).toBeCalledTimes(4);
});


// Remaining test
// - Verify the canvas is actually cleared
// - Verify mouseover works for drag mode
// - [OPTIONAL] Create a test config to always get values from