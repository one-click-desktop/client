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

    cy.visit('/home');
  });

  it('Logout should navigate to login', () => {
    cy.contains('Log out').click();

    cy.url().should('include', '/login');
  });

  it('Connect should be disabled if no machines available', () => {
    cy.intercept('GET', '/machines', {
      statusCode: 201,
      body: {},
    });

    cy.contains('Connect').should('be.disabled');
  });

  it('Connect should open modal', () => {
    cy.contains('Connect').click();

    cy.contains('Select machine type');
  });

  describe('Modal: select type', () => {
    beforeEach(() => {
      cy.openModal();
    });

    it('Disable button if no option selected', () => {
      cy.get('.modal-content button.btn').should('be.disabled');
    });

    it('Enable button when option selected', () => {
      cy.get('label').click();

      cy.get('.modal-content button.btn').should('be.not.disabled');
    });

    it('Close modal when clicking close', () => {
      cy.get('.close').click();

      cy.checkNoModal();
    });

    it('Should go to next step when clicking connect', () => {
      cy.get('label').click();

      cy.get('.modal-content button.btn').click();

      cy.contains('Creating session...');
    });
  });

  describe('Modal: creating session', () => {
    beforeEach(() => {
      cy.openModalCreatingSession();
    });

    it('Clicking Cancel should close modal', () => {
      cy.contains('Cancel').click();

      cy.checkNoModal();
    });
  });
});
