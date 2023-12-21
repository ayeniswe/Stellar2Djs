import '@testing-library/jest-dom/extend-expect';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LevelEditor } from '../../../main/LevelEditor';
import userEvent from '@testing-library/user-event';
import LevelEditorComp from '..';

const setup = async () => {
    // Create mock canvas and add to body
    const canvas = document.createElement('canvas');
    canvas.id = "Canvas";
    canvas.width = 800;
    canvas.height = 600;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d')!;
    if (!ctx) throw new Error('Could not get 2d context');

    // Setup an intial bindings for the entire document
    const lvl = new LevelEditor(ctx, {});
    await lvl.init();
    render(<LevelEditorComp editor={lvl}/>);
}

describe ('LevelEditor keyboard shortcuts', () => {

    // test('Turn on/off editing mode w/ keyboard', async () => {
    //     await setup();
    //     fireEvent.click(screen.getByRole('heading'));
    //     fireEvent.change(await screen.findByRole('combobox'), { target: { value: "grassland"}})
    //     userEvent.keyboard('e');
    //     await waitFor(() => expect(screen.getByRole('status', { name: "editing status"})).toHaveStyle("background-color: green"))
    //     userEvent.keyboard('e');
    //     await waitFor(() => expect(screen.getByRole('status', { name: "editing status"})).not.toHaveStyle("background-color: green"))
    // });

    // test('Turn on/off clipping mode w/ keyboard', async () => {
    //     await setup();
    //     fireEvent.click(screen.getByRole('heading'));
    //     fireEvent.change(await screen.findByRole('combobox'), { target: { value: "grassland"}})
    //     userEvent.keyboard('c');
    //     await waitFor(() => expect(screen.getByRole('status', { name: "clipping status"})).toHaveStyle("background-color: green"))
    //     userEvent.keyboard('c');
    //     await waitFor(() => expect(screen.getByRole('status', { name: "clipping status"})).not.toHaveStyle("background-color: green"))
    // });

    // test('Turn on/off drag mode w/ keyboard', async () => {
    //     await setup();
    //     fireEvent.click(screen.getByRole('heading'));
    //     fireEvent.change(await screen.findByRole('combobox'), { target: { value: "grassland"}})
    //     userEvent.keyboard('d');
    //     await waitFor(() => expect(screen.getByRole('status', { name: "drag status"})).toHaveStyle("background-color: green"))
    //     userEvent.keyboard('d');
    //     await waitFor(() => expect(screen.getByRole('status', { name: "drag status"})).not.toHaveStyle("background-color: green"))
    // });

    // test('Turn on/off trash mode w/ keyboard', async () => {
    //     await setup();
    //     fireEvent.click(screen.getByRole('heading'));
    //     fireEvent.change(await screen.findByRole('combobox'), { target: { value: "grassland"}})
    //     userEvent.keyboard('[Delete]');
    //     await waitFor(() => expect(screen.getByRole('status', { name: "trash status"})).toHaveStyle("background-color: green"))
    //     userEvent.keyboard('[Delete]');
    //     await waitFor(() => expect(screen.getByRole('status', { name: "trash status"})).not.toHaveStyle("background-color: green"))
    // });

    // Steps For User Interaction
    // 1. Click tab "Level Editor"
    // 2. Select any dropdown options from "Select Tileset"
    // 3. Hold Control+a
    test('Display prompt to delete all', async () => {
        await setup();
        //#1
        fireEvent.click(screen.getByRole('heading'));
        //#2
        fireEvent.change(await screen.findByRole('combobox'), { target: { value: "grassland"}})
        //#3
        userEvent.keyboard('{Control>}a');
        expect(await screen.findByRole('dialog', { name: "confirmation message to delete all placed tiles in canvas"})).toBeInTheDocument();
    });

})