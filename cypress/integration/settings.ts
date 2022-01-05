describe('Home page tests', () => {
  beforeEach(() => {
    cy.fixture('user').then((user) => {
      let token: string;
      cy.request('POST', 'http://localhost:5000/login', user)
        .then((resp) => {
          token = resp.body.token;
        })
        .then(() => {
          cy.intercept('/**', (req) => {
            req.headers['Authorization'] = `Bearer ${token}`;
          });
        });
    });

    cy.visit('/settings');
  });

  it('Save should be disabled before editing settings', () => {
    cy.get('.settings-save').should('be.disabled');
  });

  it('Save should be enabled after editing settings and lead to home if basePath not edited', () => {
    cy.get('input#rabbitPath').type('abc');

    cy.get('.settings-save').should('not.be.disabled').click();

    cy.url().should('include', '/home');
  });

  it('Save should be enabled after editing settings and lead to home if basePath not edited', () => {
    cy.get('input#basePath').type('abc');
    cy.get('input#rabbitPath').type('abc');

    cy.get('.settings-save').should('not.be.disabled').click();

    cy.get('body').should('have.class', 'modal-open');
  });
});
