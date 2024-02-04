/// <reference types="cypress" />
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
Cypress.Commands.add('openTilemapEditor', (value?: string) => {
    cy.get('[id="TilemapEditor"]').click();
    if (!value) return;
    cy.get('.dropdown > select:nth-child(1)').select(value);
});
Cypress.Commands.add('openAnimationPlayer', () => {
    cy.get('[id="AnimationPlayer"]').click();
});
Cypress.Commands.add('clearScene', () => {
    cy.get('[id="SceneTrash"]').click();
    cy.get('.button').click();
    cy.get('.button').click();
    cy.get('[id="SceneTrash"]').click();
});
declare namespace Cypress {
    interface Chainable<Subject = any> {
        openTilemapEditor(value?: string): Chainable<void>;
        openAnimationPlayer(): Chainable<void>;
        clearScene(): Chainable<void>;
    }
}