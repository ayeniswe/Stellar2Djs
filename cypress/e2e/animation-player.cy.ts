/// <reference types='cypress' />
context('Playback controls', () => {
    beforeEach(() => {
      cy.visit('localhost:3000');
      cy.openAnimationPlayer();
    })
    it('play/pause animation player', () => {
        // Timeline slider is at 0
        cy.getCSS('animation-timeline-slider', 'left')
         .should('be.equal', '0px');
        // Press timeline play button
        cy.getBySel('animation-play')
          .click();
        // Timeline player is playing and at correct precision
        cy.getCSS('animation-timeline-slider', 'left')
          .should('be.equal', '30.6667px');
        // Press timeline stop button
        cy.getBySel('animation-stop')
          .click();
        // Timeline player is stopped and close to 32
        // Note: Can be off by 1 since its delayed when stopped
        cy.getCSS<string>('animation-timeline-slider', 'left')
        .then((leftValue) => {
          expect(parseFloat(leftValue)).to.be.closeTo(32, 1);
        });
    })
    it('play forward/backward animation player', () => {
        // Timeline slider is at 0
        cy.getCSS('animation-timeline-slider', 'left')
          .should('be.equal', '0px');
        // Push timeline slider forward a little
        cy.getBySel('animation-play-forward')
          .click();
        // Timeline slider is moved by 1 increment
        cy.getCSS('animation-timeline-slider', 'left')
          .should('be.equal', '0.333333px');
        // Push timeline slider backward a little
        cy.getBySel('animation-play-backward')
          .click();
        // Timeline slider is moved back by 1 increment
        cy.getCSS('animation-timeline-slider', 'left')
          .should('be.equal', '0px');
    })
    it('seek next/previous frame', () => {
      // Load animation frames
      cy.loadFiles('sprites');
      // View animation current frame
      cy.getBySel('animation-display')
        .invoke('attr', 'src')
        .then((intialSrc) => {
          // Move to next frame
          cy.getBySel('animation-play-next-frame').click();
          // Check new frame display is different
          cy.getBySel('animation-display')
            .invoke('attr', 'src')
            .should('not.equal', intialSrc);
          // Move back to previous frame
          cy.getBySel('animation-play-previous-frame')
            .click();
          // Check new frame display is as original
          cy.getBySel('animation-display')
            .invoke('attr', 'src')
            .should('equal', intialSrc);
      });
    })
    it('repeat animation player', () => {
      // Timeline slider is at 0 position
      cy.getCSS('animation-timeline-slider', 'left')
        .should('equal', '0px');
      // Turn on repeat
      cy.getBySel('animation-repeat')
        .click();
      // Move slider near end Note - prevent long running test
      cy.moveSlider('26');
      // Play timeline slider at 26 `near end` position
      cy.getBySel('animation-play')
        .click()
     // Check if roundtrip happened
      cy.getCSS('animation-timeline-slider', 'left')
        .should('equal', '0px');
    })
    it('initial frames per second ', () => {
      // Initial frames per second
      cy.getBySel('animation-fps')
        .should('have.value', '30');
      // Play animation
      cy.getBySel('animation-play')
        .click();
      // Timeline slider scling is exact to known calculation
      cy.getCSS<string>('animation-timeline-slider', 'left')
        .then((leftValue) => {
          expect(parseFloat(leftValue) / 0.6666667).to.be.closeTo(1, 0.1);
      });
    })
    it('increase/decrease frames per second ', () => {
      // Move fps up by 5 units
      for (let i = 0; i < 5; i++) {
        cy.getBySel('animation-fps-up')
          .click();
      }
      // Check fps value
      cy.getBySel('animation-fps')
        .should('have.value', '35');
      // Play animation
      cy.getBySel('animation-play')
        .click();
      // Timeline slider scling is exact to known calculation
      cy.getCSS<string>('animation-timeline-slider', 'left')
        .then((leftValue) => {
          expect(parseFloat(leftValue) / 0.6666667).to.be.closeTo(0.8571434571428271, 0.1);
      });
      // Move fps down by 5 units
      for (let i = 0; i < 5; i++) {
        cy.getBySel('animation-fps-down')
          .click();
      }
      // Check fps value
      cy.getBySel('animation-fps')
        .should('have.value', '30');
    })
    // TODO: Add for repeating timeline
})
context('Timeline controls', () => {
  beforeEach(() => {
    cy.visit('localhost:3000');
    cy.openAnimationPlayer();
  })
  it('drag slider', () => {
    // Timeline slider is at 0 position
    cy.getCSS('animation-timeline-slider', 'left')
      .should('be.equal', '0px');
    // Drag timeline slider
    cy.getBySel('animation-timeline-slider-thumb')
      .trigger('mousedown', { button: 0 })
      .trigger('mousemove', { clientX: 200 })
    // Timeline slider is stopped at specified position
    cy.getCSS('animation-timeline-slider', 'left')
      .should('be.equal', '19px');
  })
  it('change display slider in timeline', () => {
    // Timeline slider is at 0 position
    cy.getCSS('animation-timeline-slider', 'left')
      .should('be.equal', '0px');
    // Change timeline display slider
    cy.getBySel('animation-timeline-display')
      .clear()
      .type('10');
    // Timeline slider is stopped
    cy.getCSS('animation-timeline-slider', 'left')
      .should('be.equal', '200px');
  })
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
      .selectFile('@1', { force: true });
    // Timeline should have 1 frame in its collection
    cy.getBySel('animation-timeline-frame')
      .should('have.length', 1);
    // Delete frame from timeline collection
    cy.getBySel('delete-animation-frame')
      .click();
    // Timeline should have 0 frames in its collection
    cy.getBySel('animation-timeline-frame')
      .should('have.length', 0);
  })
  it('create/save sprite', () => {
    // Save a blank sprite with no frames
    cy.getBySel('save-animation')
      .click();
    // Create new test sprite
    cy.getBySel('create-animation')
      .click();
    // Add frame to test sprite
    cy.fixture('sprites/1.jpg', null).as('1');
    cy.getBySel('add-animation-frame-file')
      .selectFile('@1', {force: true });
    // Change name of test sprite
    cy.getBySel('animation-name')
    .clear()
    .type('test');
    // Note - have to wait for update otherwise test fails at this point
    cy.wait(100);
    cy.openAnimationPlayer();
    // Save test sprite
    cy.getBySel('save-animation')
      .click();
    // Select blank sprite
    cy.getBySel('animation-name')
      .select('SpriteAnimation-1');
    // Check that no frames are in the timeline
    cy.getBySel('animation-timeline-frame')
      .should('have.length', 0);
    // Select test sprite
    cy.getBySel('animation-name')
      .select('test');
    // Check that no frames are in the timeline
    cy.getBySel('animation-timeline-frame')
      .should('have.length', 1);
  })
})