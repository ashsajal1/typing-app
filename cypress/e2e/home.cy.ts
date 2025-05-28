describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should load the home page', () => {
    cy.get('body').should('be.visible')
  })

  // Add more tests based on your application's functionality
}) 