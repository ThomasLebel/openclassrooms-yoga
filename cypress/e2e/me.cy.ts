/// <reference types="cypress" />

import { mockUserInfos } from '../mocks/mockUserInfos';

describe('Me', () => {
  beforeEach(() => {
    // Mocks des requêtes
    cy.intercept('GET', '/api/session', {
      body: [],
    }).as('session');

    cy.intercept('GET', '/api/user/1', {
      body: mockUserInfos,
    }).as('userInfos');

    cy.intercept('DELETE', '/api/user/1', {
      body: {},
    }).as('userDelete');
  });

  it('should display user information', () => {
    cy.login(true);
    cy.wait('@session');

    cy.get("[data-cy='account-button']").click();
    cy.wait('@userInfos');

    //Vérif prénom
    cy.get("[data-cy='user-name']").should(
      'contain.text',
      mockUserInfos.firstName
    );

    //Vérif nom de famille
    cy.get("[data-cy='user-name']").should(
      'contain.text',
      mockUserInfos.lastName.toUpperCase()
    );

    //Verif date de création
    const expectedCreatedDate = mockUserInfos.createdAt.toLocaleDateString(
      'en-EN',
      { dateStyle: 'long' }
    );
    cy.get("[data-cy='created-date']").should(
      'contain.text',
      expectedCreatedDate
    );

    //Verif date de mise à jour
    const expectedUpdateddDate = mockUserInfos.updatedAt!.toLocaleDateString(
      'en-EN',
      { dateStyle: 'long' }
    );
    cy.get("[data-cy='updated-date']").should(
      'contain.text',
      expectedUpdateddDate
    );
  });

  it('should display delete button if user is not admin', () => {
    // Mock requête recup info user non admin
    cy.intercept('GET', '/api/user/1', {
      body: { ...mockUserInfos, admin: false },
    }).as('userInfos');

    cy.login(false);
    cy.wait('@session');
    cy.get("[data-cy='account-button']").click();
    cy.wait('@userInfos');

    // Vérif présence bouton delete + clic
    cy.get("[data-cy='delete-button']").should('be.visible');
    cy.get("[data-cy='delete-button']").click();
    cy.wait('@userDelete');

    // Vérif présence snack bar avec message confirmation suppression
    cy.get('simple-snack-bar')
      .should('be.visible')
      .and('contain.text', 'Your account has been deleted !');
  });
});
