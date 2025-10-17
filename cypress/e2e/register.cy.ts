/// <reference types="cypress" />

describe('Register', () => {
  it('should redirect to /login if register is successful', () => {
    cy.visit('/register');

    // Mock requête register
    cy.intercept('POST', '/api/auth/register', {
      body: {},
    }).as('registerSuccess');

    // Saisie des valeurs dans le formulaire
    cy.get('input[formControlName=firstName]').type('John');
    cy.get('input[formControlName=lastName]').type('Doe');
    cy.get('input[formControlName=email]').type('john@gmail.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );
    cy.wait('@registerSuccess');

    // Vérif redirection vers login
    cy.url().should('include', '/login');
  });

  it('should display an error message if register fails', () => {
    cy.visit('/register');

    // Mock erreur requête register
    cy.intercept('POST', '/api/auth/register', {
      statusCode: 401,
      body: { message: 'Email already exist' },
    }).as('registerError');

    // Saisie des valeurs dans le formulaire
    cy.get('input[formControlName=firstName]').type('John');
    cy.get('input[formControlName=lastName]').type('Doe');
    cy.get('input[formControlName=email]').type('john@gmail.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );
    cy.wait('@registerError');

    // Vérification présence message d'erreur
    cy.get("[data-cy='error-message']").should('be.visible');
    cy.get("[data-cy='error-message']").should(
      'contain.text',
      'An error occurred'
    );
  });

  it('should disable submit button if form is invalid', () => {
    cy.visit('/register');

    // Saisie des valeurs incorrectes dans le formulaire
    cy.get('input[formControlName=firstName]').type('John');
    cy.get('input[formControlName=lastName]').type('Doe');
    cy.get('input[formControlName=email]').type('wrongEmail');
    cy.get('input[formControlName=password]').type(`1`);

    // Vérification de la désactivation du bouton submit
    cy.get("[data-cy='submit-button']").should('be.disabled');
  });
});
