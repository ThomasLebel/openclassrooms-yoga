/// <reference types="cypress" />

import { mockSessions } from '../mocks/mockSessions';

describe('Sessions', () => {
  beforeEach(() => {
    // Mock requête récupération des sessions
    cy.intercept('GET', '/api/session', {
      body: mockSessions,
    }).as('sessions');
  });

  it('should display list of sessions', () => {
    // Connexion en tant qu'admin
    cy.login(true);
    cy.wait('@sessions');

    // Vérification présence des sessions
    cy.get("[data-cy='session-item']").should(
      'have.length',
      mockSessions.length
    );
  });

  it('should display create and edit buttons if user is admin', () => {
    // Vérification présence des bouton create et edit
    cy.get("[data-cy='create-button']").should('be.visible');
    cy.get("[data-cy='edit-button']").should('be.visible');
  });

  it('should not display create and edit buttons if user is not admin', () => {
    // Connexion en tant que non admin
    cy.login(false);
    cy.wait('@sessions');

    // Vérification de la non présence des bouton create et edit
    cy.get("[data-cy='create-button']").should('not.exist');
    cy.get("[data-cy='edit-button']").should('not.exist');
  });
});
