describe('Integration Tests', () => {
  it('Should show the start button on initial page load and successfully start the quiz', () => {
    // Visit the homepage
    cy.visit('/');

    cy.get('.btn-primary').should('contain.text', 'Start Quiz');

    cy.get('.btn-primary').click();

    cy.get('.question', { timeout: 10000 })
      .should('be.visible')
      .then(($question) => {
        cy.log(`First question: ${$question.text()}`);
      });
  });

  it('Should display the correct questions and show the score at the end', () => {
    cy.fixture('questions.json').then((mockQuestions) => {
      cy.intercept('GET', '/api/questions/random', {
        statusCode: 200,
        body: mockQuestions,
      }).as('getQuestions');

      // Visit the page
      cy.visit('/');

      cy.get('.btn-primary').should('contain.text', 'Start Quiz').click();

      cy.wait('@getQuestions');

      mockQuestions.forEach((question, index) => {
        cy.get('.question')
          .should('be.visible')
          .and('contain.text', question.question);

        cy.get('.btn-primary').eq(index).click();
      });

      cy.get('.quizCompleted', { timeout: 5000 }).should('be.visible');

      cy.get('.alert-success').should('be.visible').then(($score) => {
        cy.log(`Final score: ${$score.text()}`);
      });

      cy.get('button').contains('Take New Quiz').click();
    });
  });
});
