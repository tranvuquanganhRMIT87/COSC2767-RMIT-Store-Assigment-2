describe('Login Functionality', () => {
    beforeEach(() => {
      cy.visit('/login');
    });
  
    describe('Login Form', () => {
      it('should login successfully with valid credentials', () => {
        // Fill out login form
        cy.get('input[name="email"]')
          .should('exist')
          .type('newuser@example.com');
  
        cy.get('input[name="password"]')
          .should('exist')
          .type('Test123');
  
        // Submit form
        cy.get('button[type="submit"]')
          .should('contain', 'Sign In')
          .click();
  
        // Verify successful login
        cy.url().should('include', '/dashboard');
      });
  
      it('should display validation errors for empty fields', () => {
        // Submit empty form
        cy.get('button[type="submit"]').click();
  
        // Check for error messages
        cy.get('input[name="email"]')
          .parents('.input-box')
          .find('.invalid-message')
          .should('contain', 'Email is required.');
  
        cy.get('input[name="password"]')
          .parents('.input-box')
          .find('.invalid-message')
          .should('contain', 'Password is required.');
      });
  
      it('should validate email format', () => {
        // Type invalid email
        cy.get('input[name="email"]').type('invalid-email');
        cy.get('input[name="password"]').type('password123');
        cy.get('button[type="submit"]').click();
  
        // Check for email format error
        cy.get('input[name="email"]')
          .parents('.input-box')
          .find('.invalid-message')
          .should('contain', 'Email format is invalid.');
      });
  
      it('should validate minimum password length', () => {
        cy.get('input[name="email"]').type('test@example.com');
        cy.get('input[name="password"]').type('12345');
        cy.get('button[type="submit"]').click();
  
        // Check for password length error
        cy.get('input[name="password"]')
          .parents('.input-box')
          .find('.invalid-message')
          .should('contain', 'Password must be at least 6 characters.');
      });
  
      it('should show loading state during submission', () => {
        cy.get('input[name="email"]').type('test@example.com');
        cy.get('input[name="password"]').type('password123');
  
        cy.get('button[type="submit"]').click();
  
        // Check button is disabled during submission
        cy.get('button[type="submit"]').should('be.disabled');
  
        // Check loading indicator
        cy.get('.loading-indicator').should('exist');
      });
  
      it('should navigate to registration page', () => {
        cy.contains('button', 'Create an Account')
          .should('exist')
          .click();
  
        cy.url().should('include', '/register');
      });
  
      it('should navigate to forgot password page', () => {
        cy.contains('Forgot Your Password?')
          .should('exist')
          .click();
  
        cy.url().should('include', '/forgot-password');
      });
    });
  
    describe('Authentication State', () => {
      it('should redirect to dashboard if already authenticated', () => {
        // Simulate authenticated state
        window.localStorage.setItem('token', 'fake-token');
        cy.visit('/login');
        cy.url().should('include', '/dashboard');
      });
  
      it('should clear form after successful login', () => {
        cy.get('input[name="email"]').type('test@example.com');
        cy.get('input[name="password"]').type('password123');
        cy.get('button[type="submit"]').click();
  
        // After successful login, revisit login page
        cy.visit('/login');
  
        // Form should be empty
        cy.get('input[name="email"]').should('have.value', '');
        cy.get('input[name="password"]').should('have.value', '');
      });
  
      it('should handle failed login attempt', () => {
        // Intercept the login API call
        cy.intercept('POST', `${Cypress.env('apiUrl')}/auth/login`, {
          statusCode: 400,
          body: {
            error: 'Invalid credentials'
          }
        }).as('loginRequest');
  
        cy.get('input[name="email"]').type('wrong@example.com');
        cy.get('input[name="password"]').type('wrongpassword');
        cy.get('button[type="submit"]').click();
  
        // Wait for the API call
        cy.wait('@loginRequest');
  
        // Should stay on login page
        cy.url().should('include', '/login');
      });
    });
  });