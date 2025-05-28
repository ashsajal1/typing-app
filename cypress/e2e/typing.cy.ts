describe('Typing App', () => {
  beforeEach(() => {
    // Set viewport to desktop size
    cy.viewport(1280, 720)
    cy.visit('/')
  })

  describe('Basic Page Loading', () => {
    it('should load the home page with all essential elements', () => {
      cy.get('body').should('be.visible')
      cy.get('h1').should('contain', 'Typing Practice')
      cy.get('select').should('exist') // Topic selection
      cy.get('select').eq(1).should('exist') // Time selection
      cy.get('button').contains('Start Practice').should('exist')
    })
  })

  describe('Practice Session', () => {
    it('should start practice when clicking start button', () => {
      // Select topic and time
      cy.get('select').first().select('physics')
      cy.get('select').eq(1).select('60')
      
      // Click start practice button
      cy.get('button').contains('Start Practice').click()
      
      // Verify we're on the practice page
      cy.url().should('include', '/practice')
      
      // Verify practice elements are present
      cy.get('textarea').should('exist')
      cy.get('button').contains('Reset').should('exist')
      cy.get('button').contains('Finish').should('exist')
    })

    it('should show start typing message before typing begins', () => {
      // Navigate to practice page
      cy.get('select').first().select('physics')
      cy.get('select').eq(1).select('60')
      cy.get('button').contains('Start Practice').click()
      
      // Verify start message is shown
      cy.contains('Start typing to begin the test').should('be.visible')
      cy.contains('Press any key to start').should('be.visible')
    })

    it('should start timer when typing begins', () => {
      // Navigate to practice page
      cy.get('select').first().select('physics')
      cy.get('select').eq(1).select('60')
      cy.get('button').contains('Start Practice').click()
      
      // Start typing
      cy.get('textarea').type('a')
      
      // Verify timer has started
      cy.get('progress').should('exist')
    })
  })

  describe('Typing Functionality', () => {
    beforeEach(() => {
      // Navigate to practice page
      cy.get('select').first().select('physics')
      cy.get('select').eq(1).select('60')
      cy.get('button').contains('Start Practice').click()
      cy.get('textarea').type('a') // Start the test
    })

    it('should allow typing and show correct input', () => {
      const testText = 'Hello World'
      cy.get('textarea').type(testText)
      cy.get('textarea').should('have.value', testText)
    })

    it('should show typing stats', () => {
      cy.get('textarea').type('Hello World')
      cy.contains('WPM').should('exist')
      cy.contains('Accuracy').should('exist')
    })

    it('should handle keyboard shortcuts', () => {
      // Test Escape key for reset
      cy.get('textarea').type('Hello')
      cy.get('body').type('{esc}')
      cy.get('textarea').should('have.value', '')

      // Test Enter key for finish
      cy.get('textarea').type('Hello World')
      cy.get('body').type('{enter}')
      cy.contains('Your Results').should('be.visible')
    })
  })

  describe('Game Controls', () => {
    beforeEach(() => {
      // Navigate to practice page
      cy.get('select').first().select('physics')
      cy.get('select').eq(1).select('60')
      cy.get('button').contains('Start Practice').click()
      cy.get('textarea').type('a') // Start the test
    })

    it('should reset the game when clicking reset button', () => {
      cy.get('textarea').type('Hello')
      cy.get('button').contains('Reset').click()
      cy.get('textarea').should('have.value', '')
    })

    it('should finish the test when clicking finish button', () => {
      cy.get('textarea').type('Hello World')
      cy.get('button').contains('Finish').click()
      cy.contains('Your Results').should('be.visible')
    })
  })

  describe('UI Elements and Interactions', () => {
    it('should show different themes when theme toggle is clicked', () => {
      cy.get('[data-testid="theme-toggle"]').click()
      cy.get('body').should('have.class', 'dark-theme')
      
      cy.get('[data-testid="theme-toggle"]').click()
      cy.get('body').should('have.class', 'light-theme')
    })

    it('should show settings panel when settings button is clicked', () => {
      cy.get('[data-testid="settings-button"]').click()
      cy.get('[data-testid="settings-panel"]').should('be.visible')
      
      // Test settings options
      cy.get('[data-testid="difficulty-select"]').should('exist')
      cy.get('[data-testid="time-select"]').should('exist')
    })
  })

  describe('Error Handling', () => {
    it('should handle network errors gracefully', () => {
      cy.intercept('GET', '/api/text', {
        statusCode: 500,
        body: { error: 'Server error' }
      })
      
      cy.visit('/')
      cy.get('[data-testid="error-message"]').should('be.visible')
    })

    it('should show appropriate message when no text is available', () => {
      cy.intercept('GET', '/api/text', {
        statusCode: 404,
        body: { error: 'No text available' }
      })
      
      cy.visit('/')
      cy.get('[data-testid="no-text-message"]').should('be.visible')
    })
  })
}) 