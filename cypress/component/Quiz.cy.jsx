import React from 'react';
import { mount } from 'cypress/react';
import Quiz from '../../components/Quiz'; // Adjust the path if needed
import questions from '../../fixtures/questions.json';

// Mock API response
Cypress.Commands.add('mockQuestionsApi', () => {
  cy.intercept('GET', '/api/questions', {
    statusCode: 200,
    body: questions,
  }).as('getQuestions');
});

describe('Tech Quiz Component Tests', () => {
  beforeEach(() => {
    cy.mockQuestionsApi();
    mount(<Quiz />);
  });

  it('should load and display the first question', () => {
    cy.wait('@getQuestions');
    cy.contains(questions[0].question).should('be.visible');
  });

  it('should display answers and allow selecting one', () => {
    cy.wait('@getQuestions');

    // Ensure all answer options appear
    questions[0].answers.forEach((answer) => {
      cy.contains(answer.text).should('be.visible');
    });

    // Click on the second answer
    cy.contains(questions[0].answers[1].text).click();

    // Verify it's selected (adjust based on your component logic)
    cy.contains(questions[0].answers[1].text).should('have.class', 'selected');
  });

  it('should navigate to the next question when answered', () => {
    cy.wait('@getQuestions');

    // Answer the first question
    cy.contains(questions[0].answers[1].text).click();

    // Click "Next"
    cy.contains('Next').click();

    // Ensure the next question appears
    cy.contains(questions[1].question).should('be.visible');
  });

  it('should display the score after all questions are answered', () => {
    cy.wait('@getQuestions');

    // Answer all questions
    questions.forEach((_, index) => {
      cy.get('.answer-option').first().click();
      if (index < questions.length - 1) {
        cy.contains('Next').click();
      }
    });

    // Ensure the final score is displayed
    cy.contains('Your Score:').should('be.visible');
  });
});