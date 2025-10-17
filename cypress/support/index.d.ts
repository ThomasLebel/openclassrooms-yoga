declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command pour se connecter en tant qu'admin (par défaut)
     * @param admin true si admin, false sinon
     */
    login(admin?: boolean): Chainable<void>;
  }
}
