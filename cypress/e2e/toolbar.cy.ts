/// <reference types='cypress' />
context('Toolbar controls', () => {
    beforeEach(() => {
      cy.visit('localhost:3000');
    })
    it('open tilemap editor', () => {
      // Select tilemap tab
      cy.openTilemapEditor();
      cy.getBySel('tilemap-editor')
        .should('exist');
    })
    it('open animation player', () => {
      // Select player tab
      cy.openAnimationPlayer();
      cy.getBySel('animation-player')
        .should('exist');
    })
    it('close toolbar', () => {
      // Select player tab
      cy.openAnimationPlayer();
      cy.getBySel('animation-player')
        .should('exist');
      // Select player tab again to close
      cy.openAnimationPlayer();
      cy.getBySel('animation-player')
      .should('not.exist');
    })
})
context('Toolbar controls w/ keyshortcuts', () => {
    beforeEach(() => {
      cy.visit('localhost:3000');
    })
    it('open tilemap editor', () => {
      // Press 'm' to open the tilemap
      cy.get('body')
        .type('{m}');
      cy.getBySel('tilemap-editor')
        .should('exist');
    })
    it('open animation player', () => {
      // Press 'a' to open the player
      cy.get('body')
        .type('{a}');
      cy.getBySel('animation-player')
        .should('exist');
    })
    it('close toolbar', () => {
      // Press 'a' to open the player
      cy.get('body')
        .type('{a}');
      cy.getBySel('animation-player')
        .should('exist');
      // Press 't' to close the toolbar
      cy.get('body')
        .type('{t}');
      cy.getBySel('animation-player')
        .should('not.exist');
    })
    it('drag toolbar', () => {
      // Get toolbar initial height
      cy.getCSS('toolbar', 'height')
        .should('be.equal', '39px');
      // Drag toolbar from handle NOTE - must include the document to picks up the on mouse move
      cy.getBySel('toolbar-handle')
        .trigger('mousedown' , { button: 0 })
        .document()
        .trigger('mousemove', { clientY: 500 });
      // Get toolbar final height
      cy.getCSS('toolbar', 'height')
        .should('be.equal', '161px');
    })
})