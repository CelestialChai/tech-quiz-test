describe('Tech Quiz E2E Tests', () => {
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
      // Intercept API call to mock questions
      cy.intercept('GET', '/api/questions', {
        statusCode: 200,
        body: mockQuestions,
      }).as('getQuestions');

      cy.visit('/'); // Adjust the path if the app runs on a specific route
    });

    it('starts the quiz and navigates through questions', () => {
      // Verify initial UI
      cy.contains('Start Quiz').should('exist');

      // Start the quiz
      cy.contains('Start Quiz').click();
      cy.wait('@getQuestions'); // Wait for API response

      // Verify the first question
      cy.contains('What is 2 + 2?').should('exist');

      // Answer the first question correctly
      cy.contains('button', '2').click();

      // Verify the second question
      cy.contains('What is the capital of France?').should('exist');

      // Answer the second question correctly
      cy.contains('button', '2').click();

      // Verify the quiz completion screen
      cy.contains('Quiz Completed').should('exist');
      cy.contains('Your score: 2/2').should('exist');
    });

    it('allows restarting the quiz', () => {
      // Start and complete the quiz
      cy.contains('Start Quiz').click();
      cy.contains('button', '2').click(); // First question
      cy.contains('button', '2').click(); // Second question

      // Restart the quiz
      cy.contains('Take New Quiz').click();

      // Verify the quiz restarts
      cy.contains('Start Quiz').should('exist');
    });

    it('displays a spinner during loading', () => {
      // Mock a delayed response
      cy.intercept('GET', '/api/questions', (req) => {
        req.on('response', (res) => {
          res.setDelay(2000); // Add delay to simulate loading
        });
      }).as('getQuestionsDelayed');

      // Start the quiz
      cy.contains('Start Quiz').click();

      // Verify the spinner appears
      cy.get('.spinner-border').should('exist');

      // Wait for the spinner to disappear
      cy.wait('@getQuestionsDelayed');
      cy.contains('What is 2 + 2?').should('exist');
    });
  });