/// <reference types="cypress" />
context('Toolbar controls', () => {
    beforeEach(() => {
      cy.visit('localhost:3000');
    })
    it('open tilemap editor', () => {
      // Select tilemap tab
      cy.openTilemapEditor();
      cy.get(".Tilemap")
        .should("exist");
    })
    it('open animation player', () => {
      // Select player tab
      cy.openAnimationPlayer();
      cy.get(".AnimationPlayer")
        .should("exist");
    })
    it('close toolbar', () => {
      // Select player tab
      cy.openAnimationPlayer();
      cy.get(".AnimationPlayer")
        .should("exist");
      // Select player tab again to close
      cy.openAnimationPlayer();
      cy.get(".AnimationPlayer")
      .should("not.exist");
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
      cy.get(".Tilemap")
        .should("exist");
    })
    it('open animation player', () => {
      // Press 'a' to open the player
      cy.get('body')
        .type('{a}');
      cy.get(".AnimationPlayer")
        .should("exist");
    })
    it('close toolbar', () => {
      // Press 'a' to open the player
      cy.get('body')
        .type('{a}');
      cy.get(".AnimationPlayer")
        .should("exist");
      // Press 't' to close the toolbar
      cy.get('body')
        .type('{t}');
      cy.get(".AnimationPlayer")
        .should("not.exist");
    })
  // TODO: Find how to test dragging toolbar height
})