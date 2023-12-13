
describe('Complicated selectors for EWT FIL', () => {
  before(() => {
    cy.login();
    // Navigate to the FIL settings page
    cy.visit('/swampfox/first-in-line/settings/global');
    // Select the ETW Configuration navigation
    cy.get('.sub-nav button[data-tabid="global_ewt"]').click();
  });

  it.skip('selects the input by searching for text', () => {
    // Goal: Find a <sf-toggle-switch> that doesn't have an id but contains the text "EWT Test Mode"
    // Contains documentation: https://docs.cypress.io/api/commands/contains
    // You can use check() and uncheck() to toggle the switch: https://docs.cypress.io/api/commands/check
    cy.get('sf-toggle-switch').contains('EWT Test Mode').nextAll('input[type="checkbox"]');
  });


  describe('selecting sf-toggle-switch', () => {
    /*
    The sf-toggle-switch is a... unique component. 

    The DOM looks like this:
    ```html
    <div class="form-group toggle-switch" [class.mb-0]="inline">
      <label [for]="checkboxId" class="form-check-label" *ngIf="!inline"> <ng-content></ng-content> </label>
      <ng-content select=".below-label"></ng-content>
      <input [formControl]="formControl" type="checkbox" class="form-check-input" [id]="checkboxId" />
      <label [for]="checkboxId"></label>
      <ng-content select=".text-muted"></ng-content>
    </div>
    ```

    The last <label> is the "checkbox" that is actually clicked when you toggle the switch. 
    The last <input> is what stores the value.
    */

    it('can toggle a switch', () => {
      // Get the parent div of the switch, and do some fun stuff in there
      // Since this kind of toggle switch is used in multiple places, it might make sense to create a custom command to interact with one.
      cy.get('sf-toggle-switch').contains('EWT Test Mode').parent().then(($toggleSwitch) => {
        // Get the last label, which is the checkbox
        cy.wrap($toggleSwitch.find('label').last()).as('checkbox');
        // Get the last input, which is the actual input
        cy.wrap($toggleSwitch.find('input').last()).as('input');
        // Check if the input is checked
        const isChecked = cy.get('@input').then(($input) => $input.prop('checked'));

        // If the input is checked, uncheck it
        cy.log('Checking if the input is checked, if so uncheck it');
        if (isChecked) {
          cy.get('@checkbox').click();
        }
        // Check if the "checked" attribute is unchecked
        // Cypress uses jQuery under the hood with its selectors. So if we were dealing with a regular DOM element, 
        //  we could just look at the property`checked` with the `its` method: https://docs.cypress.io/api/commands/its,
        //  but since we're dealing with a jQuery object, we need to use the jQuery method `.prop('checked')`: https://docs.cypress.io/api/commands/invoke#jQuery-method
        cy.get('@input').invoke('prop', 'checked').should('equal', false);

        cy.log('Check the checkbox to now check the input');
        // Now check it
        cy.get('@checkbox').click();
        // Check if the "checked" attribute is checked
        cy.get('@input').invoke('prop', 'checked').should('equal', true);
      });

    });
  });


});