describe('User Registration', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  describe('Signup Form', () => {
    // ... previous test case remains the same ...

    it('should register a new user successfully', () => {
            // Get the form and verify it exists
            cy.get('form[data-testid="register-form"]').should('exist').within(() => {
              // Fill out each form field
              cy.get('[name="email"]')
                .should('exist')
                .type('newuser@example.com');
      
              cy.get('[name="firstName"]')
                .should('exist')
                .type('John');
      
              cy.get('input[name="lastName"]')
                .should('exist')
                .type('Doe');
      
              cy.get('input[name="password"]')
                .should('exist')
                .type('Test123!');
      
              // Check newsletter subscription checkbox
              cy.get('label[for="subscribe"]')
                .should('exist')
                .click();
      
              // Submit form
              cy.get('button[type="submit"]')
                .should('contain', 'Join Now')
                .click();
            });
            
            // Verify successful registration
            cy.url().should('include', '/dashboard');
          });
    it('should display validation errors for empty fields', () => {
      cy.get('[data-testid="register-form"]').within(() => {
        // Submit empty form
        cy.get('button[type="submit"]').click();
      });

      // Check for error messages in the invalid-message spans
      cy.get('input[name="email"]')
        .parents('.input-box')
        .find('.invalid-message')
        .should('contain', 'Email is required.');

      cy.get('input[name="firstName"]')
        .parents('.input-box')
        .find('.invalid-message')
        .should('contain', 'First Name is required.');

      cy.get('input[name="lastName"]')
        .parents('.input-box')
        .find('.invalid-message')
        .should('contain', 'Last Name is required.');

      cy.get('input[name="password"]')
        .parents('.input-box')
        .find('.invalid-message')
        .should('contain', 'Password is required.');
    });

    // Let's also add the email format validation test
    it('should validate email format', () => {
      cy.get('[data-testid="register-form"]').within(() => {
        // Type invalid email and submit
        cy.get('input[name="email"]').type('invalid-email');
        cy.get('input[name="firstName"]').type('John'); // Fill other required fields
        cy.get('input[name="lastName"]').type('Doe');
        cy.get('input[name="password"]').type('Test123!');
        cy.get('button[type="submit"]').click();
      });

      // Check for email format error
      cy.get('input[name="email"]')
        .parents('.input-box')
        .find('.invalid-message')
        .should('contain', 'The email format is invalid.');
    });

    // Add loading state test (should consider again)

    // it('should show loading state during submission', () => {
    //   cy.get('[data-testid="register-form"]').within(() => {
    //     // Fill form with valid data
    //     cy.get('input[name="email"]').type('test@example.com');
    //     cy.get('input[name="firstName"]').type('John');
    //     cy.get('input[name="lastName"]').type('Doe');
    //     cy.get('input[name="password"]').type('Test123!');

    //     // Submit form
    //     cy.get('button[type="submit"]').click();

    //     // Check button is disabled during submission
    //     cy.get('button[type="submit"]').should('be.disabled');
    //   });

    //   // The LoadingIndicator component should be visible
    //   cy.get('[data-testid="loading-state"]').should('exist');
    // });
  });
});