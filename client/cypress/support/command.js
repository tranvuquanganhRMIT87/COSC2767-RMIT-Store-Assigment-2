Cypress.Commands.add('login', (email, password) => {
  // Perform a POST request to the login API
  cy.request({
    method: 'POST',
    url: 'http://localhost:3000/api/auth/login', 
    body: {
      email,
      password,
    },
  }).then((response) => {
    // Ensure the response is successful
    expect(response.status).to.eq(200);

    // Extract the token from the response
    const token = response.body.token;

    // Set the token in localStorage
    localStorage.setItem('token', token);

    // Call the setAuth action by directly updating Redux state if needed
    cy.window().then((win) => {
      win.store.dispatch({ type: 'src/Authentication/SET_AUTH' });
    });

    // Set the token globally for authenticated requests
    cy.wrap(token).as('authToken');
  });
});

Cypress.Commands.add('mockLogin', () => {
  // Mock the login API response
  cy.intercept('POST', 'http://localhost:3000/api/auth/login', {
    statusCode: 200,
    body: {
      token: 'Bearer mock-token', // Use the correct token format
      user: {
        email: 'trantung@gmail.com',
        firstName: 'Tran',
        lastName: 'Tung',
      },
    },
  }).as('mockLogin');

  // Simulate storing the token in localStorage
  localStorage.setItem('token', 'Bearer mock-token');

  // Optionally, mock user profile fetch (if used later in the app)
  cy.intercept('GET', 'http://localhost:3000/api/user/me', {
    statusCode: 200,
    body: {
      user: {
        email: 'trantung@gmail.com',
        firstName: 'Tran',
        lastName: 'Tung',
      },
    },
  }).as('mockGetUser');
});



  
  Cypress.Commands.add('loginAsMerchant', (email, password) => {
    cy.login(email, password)
    cy.visit('/merchant/dashboard')
  })
  
  Cypress.Commands.add('loginAsAdmin', (email, password) => {
    cy.login(email, password)
    cy.visit('/admin/dashboard')
  })