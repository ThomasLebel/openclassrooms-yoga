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
});
