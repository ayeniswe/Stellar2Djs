/// <reference types="cypress" />
Cypress.Commands.add('openTilemapEditor', (value?: string) => {
    cy.getBySel('tilemap').click();
    if (!value) return;
    cy.getBySel('tileset-select').select(value);
});
Cypress.Commands.add('openAnimationPlayer', () => {
    cy.getBySel('animation').click();
});
Cypress.Commands.add('clearScene', () => {
    cy.getBySel('scene-trash').click();
    cy.getBySel('scene-clear').click();
    cy.getBySel('scene-clear').click();
    cy.getBySel('scene-trash').click();
});
Cypress.Commands.add('getBySel', (selector, ...args) => {
    return cy.get(`[data-cy=${selector}]`, ...args)
})
Cypress.Commands.add('getCSS', (selector, property) => {
    return cy.getBySel(selector).invoke("css", property);
})
Cypress.Commands.add('loadFiles', (folder) => {
    const fullPath = `cypress/fixtures/${folder}`;
    cy.task<string[]>('readFolder', (fullPath))
      .then((folderFiles) => {
        folderFiles.forEach((file) => {
          cy.fixture(`${folder}/${file}`, null).as(file);
          cy.getBySel('add-animation-frame-file')
            .selectFile(`@${file}`, {force: true});
        })
      })
})
Cypress.Commands.add('moveSlider', (x: string) => {
    cy.getBySel('animation-timeline-display')
      .clear()
      .type(x);
})
declare namespace Cypress {
    interface Chainable<Subject = any> {
        openTilemapEditor(value?: string): Chainable<void>;
        openAnimationPlayer(): Chainable<void>;
        clearScene(): Chainable<void>;
        /**
         * Access by `data-cy` attribute
         */
        getBySel(selector: string, ...args: any[]): Chainable<Subject>;
        /**
         * Get a css property value
         */
        getCSS<Subject = any>(selector: string, property: string): Chainable<Subject>;
        /**
         * Load all the files in a folder
         * 
         * Note: The folder must be in `cypress/fixtures`
         */
        loadFiles(folder: string): Chainable<void>;
        /**
         * Move the timeline slider by changing the display value
         */
        moveSlider(x: string): Chainable<void>;
    }
}