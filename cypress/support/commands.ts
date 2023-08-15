// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Typedefs for new commands
declare global {
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    interface Chainable<Subject = any> {
      /**
       * @memberOf Cypress.Chainable
       * @param {Partial<LoginOptions>} options
       */
      login(options?: Credentials): Chainable<Subject>;
      manualLogin(options?: Credentials): Chainable<Subject>;

      // /**
      //  * @memberOf Cypress.Chainable
      //  */
      // logout(): Chainable<Subject>;
    }
  }
}

/**
 * Interface for credentials that have username and password
 */
interface Credentials {
  username: string;
  password: string;
}

/**
 * Parse a JWT token and return the payload.
 * This only parses the token, it does not verify the token to see if it's been tampered with.
 * @param {string} token
 * @returns {Record<string, unknown>}
 */
function parseJwt(token: string): Record<string, unknown> {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(window.atob(base64));
};

Cypress.Commands.add('login', (credentials: Partial<Credentials> = {}) => {
  const credentialsToUse: Credentials = {
    username: credentials.username ?? (Cypress.env('users').default_user.username as string),
    password: credentials.password ?? (Cypress.env('users').default_user.password as string),
  };

  const formData = new FormData();
  formData.append('username', credentialsToUse.username);
  formData.append('password', credentialsToUse.password);

  cy.session(
    [credentialsToUse.username, credentialsToUse.password],
    () => {
      cy.request({
        method: 'POST',
        url: '/swampfoxServiceLayer/login',
        body: formData,
      })
        .then(res => {
          debugger;
          window.localStorage.setItem('user-manager.refresh-token', (res.headers['refresh-token'] as string).replace('Bearer ', ''));
        });
    },
    {
      validate: () => {
        let token = parseJwt(window.localStorage.getItem('user-manager.refresh-token') as string);
        // If token is expired (past the current time), then invalidate the session
        expect(token.exp as number).to.be.greaterThan(Date.now() / 1000);

        cy.getCookie('JSESSIONID').should('exist');
      },
    }
  );
});


Cypress.Commands.add('manualLogin', (credentials: Partial<Credentials> = {}) => {
  const credentialsToUse: Credentials = {
    username: credentials.username ?? (Cypress.env('users').default_user.username as string),
    password: credentials.password ?? (Cypress.env('users').default_user.password as string),
  };

  const formData = new FormData();
  formData.append('username', credentialsToUse.username);
  formData.append('password', credentialsToUse.password);

  cy.session(
    ['manualLogin', credentialsToUse.username, credentialsToUse.password],
    () => {
      cy.visit('/swampfox/first-in-line/dashboard');

      cy.get('#username').type(credentialsToUse.username);
      cy.get('#password').type(credentialsToUse.password);
      cy.get('#loginBtn').click();
      // Check the URL to make sure it contains /first-in-line/dashboard
      cy.url().should('include', '/first-in-line/dashboard');
    },
    {
      validate: () => {
        let token = parseJwt(window.localStorage.getItem('user-manager.refresh-token') as string);
        // If token is expired (past the current time), then invalidate the session (Note, JWT is in seconds, Date.now() is in milliseconds)
        expect(token.exp as number).to.be.greaterThan(Date.now() / 1000);

        cy.getCookie('JSESSIONID').should('exist');
      },
    }
  );

});

// Cypress.Commands.add('logout', () => {
//   LoginPageObject.logoutBtn().click();
//   cy.url().should('match', LoginPageObject.URL_MATCHES);
// });

export { };