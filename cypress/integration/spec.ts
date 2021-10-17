it('loads examples', () => {
  cy.visit('/');
  cy.contains('test1 works');
});
