import questions from '../../fixtures/questions.json';

describe('Tech Quiz E2E Tests', () => {
  beforeEach(() => {
    // Intercept API call to return mock questions
    cy.intercept('GET', '/api/questions/random', {
      statusCode: 200,
      body: questions,
    }).as('getQuestions');

    // Visit the app's home page (adjust path if necessary)
    cy.visit('/');
  });

  it('should start the quiz when clicking Start Quiz', () => {
    cy.contains('Start Quiz').click();

    // Wait for questions to load
    cy.wait('@getQuestions');

    // Ensure the first question appears
    cy.get('.question').should('exist');
  });

  it('should navigate through all questions and complete the quiz', () => {
    cy.contains('Start Quiz').click();
    cy.wait('@getQuestions');

    // Loop through all questions
    questions.forEach(() => {
      cy.get('.answer').first().click(); // Select first answer
      cy.get('.next-button').click(); // Click "Next" button
    });

    // Verify that quiz is over and the score is displayed
    cy.contains('Your Score:').should('be.visible');
  });

  it('should allow restarting the quiz after completion', () => {
    cy.contains('Start Quiz').click();
    cy.wait('@getQuestions');

    // Answer all questions
    questions.forEach(() => {
      cy.get('.answer').first().click();
      cy.get('.next-button').click();
    });

    // Verify quiz completion
    cy.contains('Your Score:').should('be.visible');

    // Click "Start New Quiz"
    cy.contains('Start New Quiz').click();

    // Ensure a new quiz starts
    cy.get('.question').should('exist');
  });
});