
function VerifyDashboardLoaded() {
  cy.get('#main_content fil-dashboard h3').should('contain', 'First in Line Server Statistics');
}

describe('FIL Dashboard', () => {
  before(() => {
    // Clears all existing sessions. This is helpful here when we're specifically testing login. Other tests would likely not want this cleared.
    Cypress.session.clearAllSavedSessions();
  });
  it('should manually log in', () => {
    cy.manualLogin();
    cy.visit('/swampfox/first-in-line/dashboard');
    VerifyDashboardLoaded();
  });

  it('should reuse saved login session', () => {
    cy.login();
    cy.visit('/swampfox/first-in-line/dashboard');
    VerifyDashboardLoaded();
  });

  it('should log in with different users', () => {
    cy.login({ username: 'test1', password: 'Password1' });
    cy.visit('/swampfox/first-in-line/dashboard');
    VerifyDashboardLoaded();

    cy.login({ username: 'test2', password: 'Password1' });
    cy.visit('/swampfox/first-in-line/dashboard');
    VerifyDashboardLoaded();
  });

});