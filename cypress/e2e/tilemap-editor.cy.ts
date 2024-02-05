/// <reference types="cypress" />
context('Tilemap editor', () => {
    beforeEach(() => {
      cy.visit('localhost:3000');
      cy.openTilemapEditor('1');
    })
    it('select multiple tiles', () => {
        // Store references to the tiles NOTE - doesn't matter which tile
        cy.getBySel('1-1').as('tileOne');
        cy.getBySel('1-2').as('tileTwo');
        // Select tile one
        cy.get('@tileOne')
          .click()
          .should('have.attr', 'aria-pressed', 'true');
        // Select tile two which should unhighlight tile one
        cy.get('@tileTwo')
          .click()
          .should('have.attr', 'aria-pressed', 'true');
        // Verify that tile one is unselected
        cy.get('@tileOne')
          .should('have.attr', 'aria-pressed', 'false');
    })
})