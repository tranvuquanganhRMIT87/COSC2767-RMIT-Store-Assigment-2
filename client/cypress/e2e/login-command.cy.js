describe('Login Command with Mock', () => {
    beforeEach(() => {
      // Use the mock login command
      cy.mockLogin();
  
      // Navigate to a protected route
      cy.visit('/dashboard');
    });
  
    it('verifies successful login', () => {
      // Assert the token is in localStorage
      cy.wrap(localStorage.getItem('token')).should('eq', 'Bearer mock-token');
  
      // Verify the user can access the protected route
      cy.url().should('include', '/dashboard');
    });
  });
  