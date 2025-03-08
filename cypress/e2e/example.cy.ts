// https://on.cypress.io/api

describe('AI Chat Application', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should show chat interface', () => {
    cy.get('.ai-chat').should('exist')
    cy.get('.input-area').should('exist')
    cy.get('.input-area input').should('have.attr', 'placeholder', '请输入您的问题...')
    cy.get('.input-area button').should('contain', '发送')
  })

  it('should handle user input', () => {
    const testMessage = '测试消息'
    cy.get('.input-area input').type(testMessage)
    cy.get('.input-area button').click()
    cy.get('.user-message').should('contain', testMessage)
  })

  it('should show loading state', () => {
    const testMessage = '测试消息'
    cy.get('.input-area input').type(testMessage)
    cy.get('.input-area button').click()
    cy.get('.thinking').should('exist')
    cy.get('.thinking-process').should('contain', '正在思考您的问题...')
  })
})
