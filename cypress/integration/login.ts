describe('Login tests', () => {
  beforeEach(() => {
    cy.fixture('user').then((user) => (this.user = user));

    cy.visit('/login');
  });

  it('Should land on login', () => {
    cy.visit('/').url().should('include', '/login');
  });

  it('Shows logo, inputs and button', () => {
    cy.contains('One Click Desktop');
    cy.get('input#loginInput');
    cy.get('input#passwordInput');
    cy.get('button').should('contain', 'Login');
  });

  it('Disables button if login and password empty', () => {
    cy.get('button').should('be.disabled');
  });

  it('Disables button if login empty', () => {
    cy.get('input#passwordInput').type(this.user.password);

    cy.get('button').should('be.disabled');
  });

  it('Disables button if password empty', () => {
    cy.get('input#loginInput').type(this.user.login);

    cy.get('button').should('be.disabled');
  });

  it('Enables button if login and password filled', () => {
    cy.get('input#loginInput').type(this.user.login);
    cy.get('input#passwordInput').type(this.user.password);

    cy.get('button').should('be.not.disabled');
  });

  it('Navigates to home if credentials are correct', () => {
    cy.get('input#loginInput').type(this.user.login);
    cy.get('input#passwordInput').type(this.user.password);

    cy.get('button').click();

    cy.url().should('include', '/home');
  });

  it('Shows error if credentials are incorrect', () => {
    cy.get('input#loginInput').type(this.user.login);
    cy.get('input#passwordInput').type(this.user.password + '1');

    cy.get('button').click();

    cy.url().should('include', '/login');
    cy.contains('Login or password incorrect');
  });
});
