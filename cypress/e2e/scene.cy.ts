/// <reference types='cypress' />
context('Scene controls w/ keyshortcuts', () => {
  beforeEach(() => {
    cy.visit('localhost:3000');
    cy.openTilemapEditor('1');
  })
  it('toggles trash mode w/ keyshortcut', () => {
    // Toggle on
    cy.get('body')
      .type('{del}');
    cy.getBySel('scene-trash-status')
      .should('have.attr', 'style', 'fill: green;');
    // Toggle off
    cy.get('body')
      .type('{del}');
    cy.getBySel('scene-trash-status')
      .should('have.attr', 'style', 'fill: white;');
  })
  it('toggles drag mode w/ keyshortcut', () => {
    // Toggle on
    cy.get('body')
      .type('{d}');
    cy.getBySel('scene-drag-status')
      .should('have.attr', 'style', 'fill: green;');
    // Toggle off
    cy.get('body')
      .type('{d}');
    cy.getBySel('scene-drag-status')
      .should('have.attr', 'style', 'fill: white;');
  })
  it('toggles edit mode w/ keyshortcut', () => {
    // Toggle on
    cy.get('body')
      .type('{e}');
    cy.getBySel('scene-edit-status')
      .should('have.attr', 'style', 'fill: green;');
    // Toggle off
    cy.get('body')
      .type('{e}');
    cy.getBySel('scene-edit-status')
      .should('have.attr', 'style', 'fill: white;');
  })
  it('toggles clip mode w/ keyshortcut', () => {
    // Toggle on
    cy.get('body')
      .type('{c}');
    cy.getBySel('scene-clip-status')
      .should('have.attr', 'style', 'fill: green;');
    // Toggle off
    cy.get('body')
      .type('{c}');
    cy.getBySel('scene-clip-status')
      .should('have.attr', 'style', 'fill: white;');
  })
  it ('clear canvas w/ keyshortcut', () => {
    cy.getBySel('canvas').as('canvas');
    // Click on tile
    cy.getBySel('1-1')
      .click();
    // Turn on edit mode
    cy.getBySel('scene-edit')
      .click();
    // Get blank canvas
    cy.get('@canvas')
      .invoke('get', 0)
      .invoke('toDataURL')
      .as('beforeCanvas');
    // Draw on canvas
    cy.get('@canvas')
      .click(100, 100);
    // Clear canvas with keyshortcut 'Ctrl+a'
    cy.get('body').type('{ctrl+a}');
    // Check canvas is back to original state
    cy.get<HTMLCanvasElement>('@canvas')
      .then((canvas) => {
        const afterCanvas = canvas[0].toDataURL();
        cy.get('@beforeCanvas')
          .should('equal', afterCanvas);
    })
  })
})
context('Scene controls', () => {
  beforeEach(() => {
    cy.visit('localhost:3000');
  })
  it('toggles trash mode', () => {
    // Toggle on
    cy.getBySel('scene-trash')
      .click();
    cy.getBySel('scene-trash-status')
      .should('have.attr', 'style', 'fill: green;');
    // Toggle off
    cy.getBySel('scene-trash')
      .click();
    cy.getBySel('scene-trash-status')
      .should('have.attr', 'style', 'fill: white;');
  })
  it('toggles drag mode', () => {
    // Toggle on
    cy.getBySel('scene-drag')
      .click();
    cy.getBySel('scene-drag-status')
      .should('have.attr', 'style', 'fill: green;');
    // Toggle off
    cy.getBySel('scene-drag')
      .click();
    cy.getBySel('scene-drag-status')
      .should('have.attr', 'style', 'fill: white;');
  })
  it('toggles edit mode', () => {
    // Toggle on
    cy.getBySel('scene-edit')
      .click();
    cy.getBySel('scene-edit-status')
      .should('have.attr', 'style', 'fill: green;');
    // Toggle off
    cy.getBySel('scene-edit')
      .click();
    cy.getBySel('scene-edit-status')
      .should('have.attr', 'style', 'fill: white;');
  })
  it('toggles clip mode', () => {
    // Toggle on
    cy.getBySel('scene-clip')
      .click();
    cy.getBySel('scene-clip-status')
      .should('have.attr', 'style', 'fill: green;');
    // Toggle off
    cy.getBySel('scene-clip')
      .click();
    cy.getBySel('scene-clip-status')
      .should('have.attr', 'style', 'fill: white;');
  })
})
context('Drawing on Scene', () => {
  beforeEach(() => {
    cy.visit('localhost:3000');
    cy.openTilemapEditor('1');
  })
  it ('remove drawing on canvas', () => {
      cy.get('canvas').as('canvas');
      // Click on tile
      cy.getBySel('1-1')
        .click();
      // Turn on edit mode
      cy.getBySel('scene-edit')
        .click();
      // Draw on canvas
      cy.get('@canvas')
        .click(100, 100);
      // Get canvas metadata
      cy.get('@canvas')
        .invoke('get', 0)
        .invoke('toDataURL').as('beforeCanvas');
      // Turn on trash mode
      cy.getBySel('scene-trash')
        .click();
      // Remove drawing on canvas
      cy.get('@canvas')
        .click(100, 100);
      // Check canvas is in original state
      cy.get('@canvas')
        .invoke('get', 0)
        .invoke('toDataURL')
        .should('not.equal', '@beforeCanvas');
  })
  it ('undo drawing on canvas', () => {
    cy.getBySel('canvas').as('canvas');
    // Click on tile
    cy.getBySel('1-1')
      .click();
    // Turn on edit mode
    cy.getBySel('scene-edit')
      .click();
    // Draw on canvas
    cy.get('@canvas')
      .click(100, 100);
    // Get canvas metadata
    cy.get('@canvas')
      .invoke('get', 0)
      .invoke('toDataURL').as('beforeCanvas');
    // Undo canvas with keyshortcut 'Ctrl+z'
    cy.get('body').type('{ctrl+z}');
    // Check canvas is in original state
    cy.get('@canvas')
      .invoke('get', 0)
      .invoke('toDataURL')
      .should('not.equal', '@beforeCanvas');
  })
  it ('draw on canvas with clipping', () => {
      cy.getBySel('canvas').as('canvas');
      // Click on tile
      cy.getBySel('1-1')
        .click();
      // Turn on edit mode
      cy.getBySel('scene-edit')
        .click();
      // Draw on canvas without clipping
      cy.get('@canvas')
        .click(100, 100);
      cy.get('@canvas')
        .click(100, 140);
      // Get canvas metadata
      cy.get('@canvas')
        .invoke('get', 0)
        .invoke('toDataURL').as('beforeCanvas');
      // Wipe scene
      cy.clearScene();
      // Turn on clip mode
      cy.getBySel('scene-clip')
        .click();
      // Draw on canvas
      cy.get('@canvas')
        .click(100, 100);
      cy.get('@canvas')
        .click(100, 140);
      // Check canvas is in original state
      cy.get('@canvas')
        .invoke('get', 0)
        .invoke('toDataURL')
        .should('not.equal', '@beforeCanvas');
  })
  it('draw on canvas while dragging', () => {
    cy.getBySel('canvas').as('canvas');
    // Click on tile
    cy.getBySel('1-1')
      .click();
    // Turn on edit mode
    cy.getBySel('scene-edit')
      .click();
    // Turn on drag mode
    cy.getBySel('scene-drag')
      .click();
    // Draw on canvas with dragging
    cy.get('@canvas')
      .trigger('mousedown', { button: 0, clientX: 100 })
      .trigger('mousemove', { clientX: 110 })
      .invoke('get', 0)
      .invoke('toDataURL')
      .as('beforeCanvas');
    // Turn off drag mode
    cy.getBySel('scene-drag')
      .click();
    // Clear canvas
    cy.clearScene();
    // Draw on canvas without dragging
    cy.get('@canvas')
      .trigger('mousedown', { button: 0, clientX: 100 })
      .trigger('mousemove', { clientX: 110 })
      .invoke('get', 0)
      .invoke('toDataURL')
      .should('not.equal', '@beforeCanvas');
  })
})
context('Scene dialogs', () => {
  beforeEach(() => {
    cy.visit('localhost:3000');
    cy.openTilemapEditor('1');
  })
  it('delete dialog stays open for 3 seconds w/ keyshortcut', () => {
    cy.clock();
    // Open straight to delete dialog Note: skips the delete button
    cy.get('body')
      .type('{ctrl+a}');
    cy.getBySel('scene-clear').as('button');
    cy.get('@button').should('exist');
    // Fast forward 3 seconds
    cy.tick(3000);
    cy.get('@button').should('not.exist');
  })
})