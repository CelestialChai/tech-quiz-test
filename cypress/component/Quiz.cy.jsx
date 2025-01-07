import React from 'react';
import Quiz from '../../client/components/Quiz';
import { mount } from 'cypress/react'; // For Cypress component testing

describe('Quiz Component', () => {
  const mockQuestions = [
    {
      question: 'What is 2 + 2?',
      answers: [
        { text: '3', isCorrect: false },
        { text: '4', isCorrect: true },
      ],
    },
    {
      question: 'What is the capital of France?',
      answers: [
        { text: 'Berlin', isCorrect: false },
        { text: 'Paris', isCorrect: true },
      ],
    },
  ];

  beforeEach(() => {
    cy.stub(global, 'fetch')
      .resolves({
        json: () => Promise.resolve(mockQuestions),
      })
      .as('getQuestions');
  });

  it('renders the start button initially', () => {
    mount(<Quiz />);
    cy.contains('button', 'Start Quiz').should('exist');
  });

  it('starts the quiz and displays the first question', () => {
    mount(<Quiz />);
    cy.contains('button', 'Start Quiz').click();
    cy.contains('What is 2 + 2?').should('exist');
  });

  it('progresses through questions and calculates the score', () => {
    mount(<Quiz />);
    cy.contains('button', 'Start Quiz').click();

    // Answer first question correctly
    cy.contains('button', '2').click();

    // Verify second question appears
    cy.contains('What is the capital of France?').should('exist');

    // Answer second question incorrectly
    cy.contains('button', '1').click();

    // Verify quiz completion
    cy.contains('Quiz Completed').should('exist');
    cy.contains('Your score: 1/2').should('exist');
  });

  it('restarts the quiz after completion', () => {
    mount(<Quiz />);
    cy.contains('button', 'Start Quiz').click();
    cy.contains('button', '2').click(); // First question
    cy.contains('button', '1').click(); // Second question

    // Restart the quiz
    cy.contains('Take New Quiz').click();
    cy.contains('button', 'Start Quiz').should('exist');
  });
});
