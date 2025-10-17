/// <reference types="cypress" />

describe('Login', () => {
  it('should redirect to /session if login is successful', () => {
    cy.visit('/login');

    // Mocks requêtes
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true,
      },
    });

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      []
    ).as('session');

    // Saisie des valeurs dans le formulaire
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );
    // Vérif redirection
    cy.url().should('include', '/sessions');
  });

  it('should display an error message if login fails', () => {
    cy.visit('/login');

    // Mock requête
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401,
      body: {
        message: 'Invalid credentials',
      },
    }).as('loginError');

    // Saisie des valeurs dans le formulaire
    cy.get('input[formControlName=email]').type('wrongEmail@gmail.com');
    cy.get('input[formControlName=password]').type(
      `${'wrongPassword123'}{enter}{enter}`
    );

    cy.wait('@loginError');

    // Vérification présence message d'erreur
    cy.get("[data-cy='error-message']").should('be.visible');
    cy.get("[data-cy='error-message']").should(
      'contain.text',
      'An error occurred'
    );
  });

  it('should disable submit button if form is invalid', () => {
    cy.visit('/login');

    // Saisie des valeurs non conformes dans le formulaire
    cy.get('input[formControlName=email]').type('wrongEmail');
    cy.get('input[formControlName=password]').type(`1`);

    // Vérif désactivation du bouton submit
    cy.get("[data-cy='submit-button']").should('be.disabled');
  });

  it('should logout and show login/register buttons', () => {
    // Mock requête recup infos session
    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      []
    ).as('session');

    cy.login(true);
    cy.wait('@session');
    cy.get("[data-cy='logout-button']").click();

    // Vérif présence bouton login + register
    cy.get("[data-cy='login-button']").should('be.visible');
    cy.get("[data-cy='register-button']").should('be.visible');
  });
});
