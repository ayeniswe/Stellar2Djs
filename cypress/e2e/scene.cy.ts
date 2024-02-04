/// <reference types="cypress" />
context('Scene controls w/ keyshortcuts', () => {
  beforeEach(() => {
    cy.visit('localhost:3000');
    cy.openTilemapEditor('1');
  })
  it('toggles trash mode', () => {
    // Toggle on
    cy.get('body')
      .type('{del}');
    cy.get('circle[id="SceneTrashStatus"]')
      .should('have.attr', 'style', 'fill: green;');
    // Toggle off
    cy.get('body')
      .type('{del}');
    cy.get('circle[id="SceneTrashStatus"]')
      .should('have.attr', 'style', 'fill: white;');
  })
  it('toggles drag mode', () => {
    // Toggle on
    cy.get('body')
      .type('{d}');
    cy.get('circle[id="SceneDragStatus"]')
      .should('have.attr', 'style', 'fill: green;');
    // Toggle off
    cy.get('body')
      .type('{d}');
    cy.get('circle[id="SceneDragStatus"]')
      .should('have.attr', 'style', 'fill: white;');
  })
  it('toggles edit mode', () => {
    // Toggle on
    cy.get('body')
      .type('{e}');
    cy.get('circle[id="SceneEditStatus"]')
      .should('have.attr', 'style', 'fill: green;');
    // Toggle off
    cy.get('body')
      .type('{e}');
    cy.get('circle[id="SceneEditStatus"]')
      .should('have.attr', 'style', 'fill: white;');
  })
  it('toggles clip mode', () => {
    // Toggle on
    cy.get('body')
      .type('{c}');
    cy.get('circle[id="SceneClipStatus"]')
      .should('have.attr', 'style', 'fill: green;');
    // Toggle off
    cy.get('body')
      .type('{c}');
    cy.get('circle[id="SceneClipStatus"]')
      .should('have.attr', 'style', 'fill: white;');
  })
})
context('Scene controls', () => {
  beforeEach(() => {
    cy.visit('localhost:3000');
  })
  it('toggles trash mode', () => {
    // Toggle on
    cy.get('[id="SceneTrash"]')
      .click();
    cy.get('circle[id="SceneTrashStatus"]')
      .should('have.attr', 'style', 'fill: green;');
    // Toggle off
    cy.get('[id="SceneTrash"]')
      .click();
    cy.get('circle[id="SceneTrashStatus"]')
      .should('have.attr', 'style', 'fill: white;');
  })
  it('toggles drag mode', () => {
    // Toggle on
    cy.get('[id="SceneDrag"]')
      .click();
    cy.get('circle[id="SceneDragStatus"]')
      .should('have.attr', 'style', 'fill: green;');
    // Toggle off
    cy.get('[id="SceneDrag"]')
      .click();
    cy.get('circle[id="SceneDragStatus"]')
      .should('have.attr', 'style', 'fill: white;');
  })
  it('toggles edit mode', () => {
    // Toggle on
    cy.get('[id="SceneEdit"]')
      .click();
    cy.get('circle[id="SceneEditStatus"]')
      .should('have.attr', 'style', 'fill: green;');
    // Toggle off
    cy.get('[id="SceneEdit"]')
      .click();
    cy.get('circle[id="SceneEditStatus"]')
      .should('have.attr', 'style', 'fill: white;');
  })
  it('toggles clip mode', () => {
    // Toggle on
    cy.get('[id="SceneClip"]')
      .click();
    cy.get('circle[id="SceneClipStatus"]')
      .should('have.attr', 'style', 'fill: green;');
    // Toggle off
    cy.get('[id="SceneClip"]')
      .click();
    cy.get('circle[id="SceneClipStatus"]')
      .should('have.attr', 'style', 'fill: white;');
  })
})
context('Drawing on Scene', () => {
  beforeEach(() => {
    cy.visit('localhost:3000');
    cy.openTilemapEditor('1');
  })
  it ('draw on canvas', () => {
      cy.get('[id="Canvas"]').as('canvas');
      // Click on tile
      cy.get('[id="1-1"]')
        .click();
      // Turn on edit mode
      cy.get('[id="SceneEdit"]')
        .click();
      // Get blank canvas
      cy.get('@canvas').then((canvas) => {
        const element = canvas[0] as HTMLCanvasElement;
        cy.wrap(element.toDataURL())
          .as('beforeCanvas');
      })
      // Draw on canvas
      cy.get('@canvas')
        .click(100, 100);
      // Check canvas is updated
      cy.get('@canvas').then((canvas) => {
        const element = canvas[0] as HTMLCanvasElement;
        const afterCanvas = element.toDataURL();
        cy.get("@beforeCanvas").then((beforeCanvas) => {
          expect(afterCanvas).to.not.equal(beforeCanvas);
        })
      })
  })
  it ('undo draw on canvas', () => {
    cy.get('[id="Canvas"]').as('canvas');
    // Click on tile
    cy.get('[id="1-1"]')
      .click();
    // Turn on edit mode
    cy.get('[id="SceneEdit"]')
      .click();
    // Get blank canvas
    cy.get('@canvas').then((canvas) => {
      const element = canvas[0] as HTMLCanvasElement;
      cy.wrap(element.toDataURL())
        .as('beforeCanvas');
    })
    // Draw on canvas
    cy.get('@canvas')
      .click(100, 100);
    // Check canvas is updated
    cy.get('@canvas').then((canvas) => {
      const element = canvas[0] as HTMLCanvasElement;
      const afterCanvas = element.toDataURL();
      cy.get("@beforeCanvas").then((beforeCanvas) => {
        expect(afterCanvas).to.not.equal(beforeCanvas);
      })
    })
    // Undo canvas with keyshortcut 'Ctrl+z'
    cy.get('body').type('{ctrl+z}');
    // Check canvas is back to original state
    cy.get('@canvas').then((canvas) => {
      const element = canvas[0] as HTMLCanvasElement;
      const afterCanvas = element.toDataURL();
      cy.get("@beforeCanvas").then((beforeCanvas) => {
        expect(afterCanvas).to.equal(beforeCanvas);
      })
    })
  })
  it ('draw on canvas with clipping', () => {
      cy.get('[id="Canvas"]').as('canvas');
      // Click on tile
      cy.get('[id="1-1"]')
        .click();
      // Turn on edit mode
      cy.get('[id="SceneEdit"]')
        .click();
      // Draw on canvas without clipping
      cy.get('@canvas')
        .click(100, 100);
      cy.get('@canvas')
        .click(100, 140);
      // Save state of canvas
      cy.get('@canvas').then((canvas) => {
        const element = canvas[0] as HTMLCanvasElement;
        cy.wrap(element.toDataURL())
          .as('beforeCanvas');
      })
      // Wipe scene
      cy.clearScene();
      // Turn on clip mode
      cy.get('[id="SceneClip"]')
        .click();
      // Draw on canvas
      cy.get('@canvas')
        .click(100, 100);
      cy.get('@canvas')
        .click(100, 140);
      // Compare canvas without clipping to current state with clipping
      cy.get('@canvas').then((canvas) => {
        const element = canvas[0] as HTMLCanvasElement;
        const afterCanvas = element.toDataURL();
        cy.get("@beforeCanvas").then((beforeCanvas) => {
          expect(afterCanvas).to.not.equal(beforeCanvas);
        })
      })
  })
  it ('clear canvas w/ keyshortcut', () => {
    cy.get('[id="Canvas"]').as('canvas');
    // Click on tile
    cy.get('[id="1-1"]')
      .click();
    // Turn on edit mode
    cy.get('[id="SceneEdit"]')
      .click();
    // Get blank canvas
    cy.get('@canvas').then((canvas) => {
      const element = canvas[0] as HTMLCanvasElement;
      cy.wrap(element.toDataURL())
        .as('beforeCanvas');
    })
    // Draw on canvas
    cy.get('@canvas')
      .click(100, 100);
    // Clear canvas with keyshortcut 'Ctrl+a'
    cy.get('body').type('{ctrl+a}');
    cy.get('.button').click();
    // Check canvas is back to original state
    cy.get('@canvas').then((canvas) => {
      const element = canvas[0] as HTMLCanvasElement;
      const afterCanvas = element.toDataURL();
      cy.get("@beforeCanvas").then((beforeCanvas) => {
        expect(afterCanvas).to.equal(beforeCanvas);
      })
    })
  })
  // TODO: Find how to test dragging
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
    cy.get('.button').as('button');
    cy.get('@button').should('exist');
    // Fast forward 3 seconds
    cy.tick(3000);
    cy.get('@button').should('not.exist');
  })
})