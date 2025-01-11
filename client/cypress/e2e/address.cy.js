describe('Address List Tests', () => {
  beforeEach(() => {
    cy.mockLogin();

    cy.intercept('GET', 'http://localhost:3000/api/address', {
      statusCode: 200,
      body: {
        addresses: [
          {
            id: 1,
            address: '123 Main St',
            city: 'Hometown',
            state: 'CA',
            zipCode: '12345',
          },
        ],
      },
    }).as('fetchAddresses');

    cy.visit('/dashboard/address');
    cy.wait('@fetchAddresses');
  });

  it('displays the list of addresses', () => {
    cy.get('[data-cy=address-item]').should('have.length', 1);
    cy.get('[data-cy=address-item]').first().should('contain', '123 Main St');
  });
});
