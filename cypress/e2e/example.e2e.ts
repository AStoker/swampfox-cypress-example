
describe('example.spec.ts', () => {
  it('should visit the page', () => {
    cy.visit('https://example.cypress.io');
  });

  it('should contain "Kitchen Sink"', () => {
    cy.visit('https://example.cypress.io');
    cy.contains('Kitchen Sink');
  });

  it('Gets, types and asserts', () => {
    cy.visit('https://example.cypress.io');

    cy.contains('type').click();

    // Should be on a new URL which
    // includes '/commands/actions'
    cy.url().should('include', '/commands/actions');

    // Get an input, type into it
    cy.get('.action-email').type('fake@email.com');

    //  Verify that the value has been updated
    cy.get('.action-email').should('have.value', 'fake@email.com');
  });

});