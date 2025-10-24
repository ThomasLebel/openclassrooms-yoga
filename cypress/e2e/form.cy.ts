/// <reference types="cypress" />

import { mockSessions } from '../mocks/mockSessions';
import { mockTeacher } from '../mocks/mockTeacher';

describe('Form', () => {
  describe('Create', () => {
    beforeEach(() => {
      // Mocks des requêtes
      cy.intercept('GET', '/api/session', {
        body: mockSessions,
      }).as('sessions');

      cy.intercept('GET', 'api/teacher', {
        body: [mockTeacher],
      }).as('teacher');

      cy.intercept('POST', 'api/session', {
        body: {},
      }).as('createSession');
    });

    it('should display a snack bar with success message when session is created', () => {
      cy.login(true);
      cy.wait('@sessions');
      cy.get("[data-cy='create-button']").click();

      // Saisie des valeurs dans le formulaire
      cy.get('input[formControlName="name"]').type('Morning Yoga');
      cy.get('input[formControlName="date"]').type('2025-12-15');
      cy.get('textarea[formControlName="description"]').type(
        'A relaxing morning session'
      );
      cy.get('mat-select[formControlName="teacher_id"]').click();
      cy.get('mat-option').contains('John Doe').click();
      cy.get("[data-cy='submit-button']").click();

      cy.wait('@createSession');

      // Vérif présence snack bar avec message succès
      cy.get('simple-snack-bar')
        .should('be.visible')
        .and('contain.text', 'Session created !');
    });

    it('should disable submit button if form is invalid', () => {
      cy.login(true);
      cy.wait('@sessions');
      cy.get("[data-cy='create-button']").click();

      // Vérification de la désactivation du bouton submit lorsque le formulaire est vide
      cy.get("[data-cy='submit-button']").should('be.disabled');
    });
  });

  describe('Update', () => {
    beforeEach(() => {
      // Mocks des requêtes
      cy.intercept('GET', '/api/session', {
        body: mockSessions,
      }).as('sessions');

      cy.intercept('GET', '/api/session/1', {
        body: mockSessions[0],
      }).as('session');

      cy.intercept('GET', 'api/teacher', {
        body: [mockTeacher],
      }).as('teacher');

      cy.intercept('PUT', 'api/session/1', {
        body: {},
      }).as('updateSession');
    });

    it('should display session information on update session form', () => {
      cy.login(true);
      cy.wait('@sessions');
      cy.get("[data-cy='edit-button']").first().click();

      // Vérif que le nom de la session est renseigné
      cy.get('input[formControlName="name"]').should(
        'contain.value',
        mockSessions[0].name
      );
      // Vérif que la description de la session est renseigné
      cy.get('textarea[formControlName="description"]').should(
        'contain.value',
        mockSessions[0].description
      );
      // Vérif que la date de la session soit renseignée
      const expectedDate = mockSessions[0].date.toISOString().slice(0, 10);
      cy.get('input[formControlName="date"]').should(
        'have.value',
        expectedDate
      );
      // Vérif que les infos du teacher soient renseignées
      cy.get(
        'mat-select[formControlName="teacher_id"] .mat-select-value-text'
      ).should(
        'contain.text',
        `${mockTeacher.firstName} ${mockTeacher.lastName}`
      );
    });

    it('should display a confirmation message when session is updated', () => {
      cy.login(true);
      cy.wait('@sessions');
      cy.get("[data-cy='edit-button']").first().click();

      // Modification du nom de la sesion
      cy.get('input[formControlName="name"]').type(` updated`);
      cy.get("[data-cy='submit-button']").click();

      // Vérif présence snack bar avec message succès
      cy.get('simple-snack-bar')
        .should('be.visible')
        .and('contain.text', 'Session updated !');
    });
  });
});
