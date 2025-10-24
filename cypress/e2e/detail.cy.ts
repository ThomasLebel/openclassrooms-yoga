/// <reference types="cypress" />

import { mockSessions } from '../mocks/mockSessions';
import { mockTeacher } from '../mocks/mockTeacher';

describe('Detail', () => {
  beforeEach(() => {
    // Mocks des requêtes
    cy.intercept('GET', '/api/session', {
      body: [mockSessions[0]],
    }).as('session');

    cy.intercept('GET', '/api/session/1', {
      body: mockSessions[0],
    }).as('session');

    cy.intercept('GET', 'api/teacher/1', {
      body: mockTeacher,
    }).as('teacher');

    cy.intercept('DELETE', '/api/session/1', {
      body: {},
    }).as('deleteSession');
  });

  it('should display session information', () => {
    cy.login();
    cy.get("[data-cy='detail-button']").click();
    cy.wait('@session');

    // Vérif présence titre session
    cy.get("[data-cy='session-name']")
      .invoke('text')
      .should('match', new RegExp(`^${mockSessions[0].name}$`, 'i'));

    // Vérif présence nom et prénom teacher
    cy.get("[data-cy='teacher-infos']").should(
      'contain.text',
      mockTeacher.firstName
    );
    cy.get("[data-cy='teacher-infos']").should(
      'contain.text',
      mockTeacher.lastName.toUpperCase()
    );

    //Vérif présence description
    cy.get("[data-cy='session-description']").should(
      'contain.text',
      mockSessions[0].description
    );

    //Vérif présence date de session
    const expectedDate = mockSessions[0].date.toLocaleDateString('en-EN', {
      dateStyle: 'long',
    });
    cy.get("[data-cy='session-date']").should('have.text', expectedDate);

    //Vérif présence date création session
    const expecteCreatedDate = mockSessions[0].createdAt!.toLocaleDateString(
      'en-EN',
      { dateStyle: 'long' }
    );
    cy.get("[data-cy='created-date']").should(
      'contain.text',
      expecteCreatedDate
    );

    //Vérif présence date mise à jour session
    const expecteUpdatedDate = mockSessions[0].updatedAt!.toLocaleDateString(
      'en-EN',
      { dateStyle: 'long' }
    );
    cy.get("[data-cy='updated-date']").should(
      'contain.text',
      expecteUpdatedDate
    );
  });

  it('should display delete button if user is admin', () => {
    // Login en tant qu'admin
    cy.login(true);
    cy.get("[data-cy='detail-button']").click();
    cy.wait('@session');

    // Vérification présence du bouton delete
    cy.get("[data-cy='delete-button']").should('be.visible');
  });

  it('should display a confirmation message when session is deleted', () => {
    // Connexion en tant qu'admin
    cy.login(true);
    cy.get("[data-cy='detail-button']").click();
    cy.wait('@session');

    // Clic sur le bouton de suppression
    cy.get("[data-cy='delete-button']").click();
    cy.wait('@deleteSession');
    cy.get('simple-snack-bar')
      .should('be.visible')
      .and('contain.text', 'Session deleted !');
  });

  it('should not display delete button if user is not admin', () => {
    // Connexion en tant que non admin
    cy.login(false);
    cy.get("[data-cy='detail-button']").click();
    cy.wait('@session');

    // Vérification non présence du bouton delete
    cy.get("[data-cy='delete-button']").should('not.exist');
  });

  it('should display unparticipate button if user is register to the session', () => {
    cy.login(false);
    cy.get("[data-cy='detail-button']").click();
    cy.wait('@session');

    // Vérification présence du bouton unparticipate
    cy.get("[data-cy='unparticipate-button']").should('be.visible');
  });

  it('should display participate button when user click on unparticipate', () => {
    // Mock requête delete
    cy.intercept('DELETE', '/api/session/1/participate/1', {
      body: {},
    }).as('unparticipate');

    cy.login(false);
    cy.get("[data-cy='detail-button']").click();
    cy.wait('@session');

    // Mock requête infos sessions avec suppression du participant
    cy.intercept('GET', '/api/session/1', {
      body: { ...mockSessions[0], users: [2, 3, 4] },
    }).as('sessionUpdated');

    // Clic sur le bouton unparticipate
    cy.get("[data-cy='unparticipate-button']").click();
    cy.wait('@sessionUpdated');

    // Vérification présence bouton participate
    cy.get("[data-cy='participate-button']").should('be.visible');
  });

  it('should display participate button if user is not register to the session', () => {
    cy.intercept('GET', '/api/session/1', {
      body: mockSessions[1],
    }).as('session');
    cy.login(false);
    cy.get("[data-cy='detail-button']").click();
    cy.wait('@session');
    cy.get("[data-cy='participate-button']").should('be.visible');
  });

  it('should display unparticipate button if user click on participate', () => {
    // Mock requête participate
    cy.intercept('POST', '/api/session/1/participate/1', {
      body: {},
    }).as('participate');

    cy.intercept('GET', '/api/session/1', {
      body: mockSessions[1],
    }).as('session');

    cy.login(false);
    cy.get("[data-cy='detail-button']").click();
    cy.wait('@session');

    // Mock requête recup infos session avec ajout du participant
    cy.intercept('GET', '/api/session/1', {
      body: { ...mockSessions[1], users: [1] },
    }).as('sessionUpdated');

    // Clic sur le bouton participate
    cy.get("[data-cy='participate-button']").click();
    cy.wait('@participate');

    // Vérification présence du bouton unparticipate
    cy.get("[data-cy='unparticipate-button']").should('be.visible');
  });
});
