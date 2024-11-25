import React from 'react';
import { mount } from 'cypress/react18';
import Quiz from '../../src/components/Quiz';

describe('<Quiz />', () => {
  it('should display questions and handle answers correctly', () => {
    // Intercept the API call and return mockQuestions
    cy.fixture('questions.json').then((mockQuestions) => {
      // Intercept the API call and return mockQuestions
      cy.intercept('GET', '/api/questions/random', {
        statusCode: 200,
        body: mockQuestions,
      }).as('getQuestions');

      // Mount the Quiz component
      mount(<Quiz />);

      // Start the quiz

      cy.get('.btn-primary').should('contain.text', 'Start Quiz');
      cy.get('button').contains('Start Quiz').click();

      // Wait for the API call to complete
      cy.wait('@getQuestions');

      // TODO: Complete the test code to answer both mock questions and ensure the score is correct at the end of the quiz
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