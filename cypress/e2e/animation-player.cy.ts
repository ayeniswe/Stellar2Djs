/// <reference types="cypress" />
context('Playback controls', () => {
    beforeEach(() => {
      cy.visit('localhost:3000');
      cy.openAnimationPlayer();
    })
    it('play/pause animation player', () => {
        // Timeline slider is at 0
        cy.getCSS("animation-timeline-slider", "left")
         .should("be.equal", "0px");
        // Press timeline play button
        cy.getBySel("animation-play")
          .click();
        // Timeline player is playing and at correct precision
        cy.getCSS("animation-timeline-slider", "left")
          .should("be.equal", "30.6667px");
        // Press timeline stop button
        cy.getBySel("animation-stop")
          .click();
        // Timeline player is stopped and close to 32
        // Note: Can be off by 1 since its delayed when stopped
        cy.getCSS<string>("animation-timeline-slider", "left")
        .then((leftValue) => {
          expect(parseFloat(leftValue)).to.be.closeTo(32, 1);
        });
    })
    it('change display slider animation player', () => {
        // Timeline slider is at 0 position
        cy.getCSS("animation-timeline-slider", "left")
          .should("be.equal", "0px");
        // Change timeline display slider
        cy.getBySel("animation-timeline-display")
          .click()
          // Based on precision default being 0.00
          .type("{backspace}")
          .type("{backspace}")
          .type("{backspace}")
          .type("{backspace}")
          .type("10");
        // Timeline slider is stopped
        cy.getCSS("animation-timeline-slider", "left")
          .should("be.equal", "200px");
    })
    it('play forward/backward animation player', () => {
        // Timeline slider is at 0
        cy.getCSS("animation-timeline-slider", "left")
          .should("be.equal", "0px");
        // Push timeline slider forward a little
        cy.getBySel("animation-play-forward")
          .click()
        // Timeline slider is moved by 1 increment
        cy.getCSS("animation-timeline-slider", "left")
          .should("be.equal", "0.333333px");
        // Push timeline slider backward a little
        cy.getBySel("animation-play-backward")
          .click()
        // Timeline slider is moved back by 1 increment
        cy.getCSS("animation-timeline-slider", "left")
          .should("be.equal", "0px");
    })
    it('seek next/previous frame', () => {
      // Load animation frames
      cy.loadFiles("sprites");
      // View animation current frame
      cy.getBySel("animation-display")
        .invoke("attr", "src")
        .then((intialSrc) => {
          // Move to next frame
          cy.getBySel("animation-play-next-frame").click();
          // Check new frame display is different
          cy.getBySel("animation-display").invoke("attr", "src").should("not.equal", intialSrc);
          // Move back to previous frame
          cy.getBySel("animation-play-previous-frame").click();
          // Check new frame display is as original
          cy.getBySel("animation-display").invoke("attr", "src").should("equal", intialSrc);
      });

    })
  //   it('repeat animation player', () => {
  //     // Slider is at 0
  //     cy.getCSS("animation-timeline-slider", "left")
  //      .should("be.equal", "0px");
  //     // Press repeat
  //     cy.getBySel("animation-repeat")
  //       .click();
  //     // Press play
  //     cy.getBySel("animation-play")
  //       .click();
  //     // Player is playing and at corect precision
  //     cy.getCSS("animation-timeline-slider", "left")
  //       .should("be.equal", "0px");
  // })

})
context('Sprite creation controls', () => {
  beforeEach(() => {
    cy.visit('localhost:3000');
    cy.openAnimationPlayer();
  })
  it('add/delete frame', () => {
      // Add mock image from fixtures folder
      cy.fixture('sprites/1.jpg', null).as('1');
      // Select mock image from fixtures folder
      cy.getBySel('add-animation-frame-file')
        .selectFile('@1', {force: true});
      // Timeline should have 1 frame in its collection
      cy.getBySel('timeline-frame')
        .should('have.length', 1);
      // Delete frame from timeline collection
      cy.getBySel('delete-animation-frame')
        .click();
      // Timeline should have 0 frames in its collection
      cy.getBySel('timeline-frame')
        .should('have.length', 0);
  })
  it('create/save sprite', () => {
    // Save blank sprite with no frames
    cy.getBySel('save-animation')
      .click();
    // Create new sprite
    cy.getBySel('create-animation')
      .click();

  })
})