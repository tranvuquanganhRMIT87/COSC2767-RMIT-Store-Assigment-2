Cypress.Commands.add('login', (email, password) => {
    cy.request({
      method: 'POST',
      url: '/api/auth/login',
      body: { email, password }
    }).then((response) => {
      window.localStorage.setItem('token', response.body.token)
    })
  })
  
  Cypress.Commands.add('loginAsMerchant', (email, password) => {
    cy.login(email, password)
    cy.visit('/merchant/dashboard')
  })
  
  Cypress.Commands.add('loginAsAdmin', (email, password) => {
    cy.login(email, password)
    cy.visit('/admin/dashboard')
  })