describe('connexion smoke tests', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.get('[data-cy="nav-link-login"]').should('exist').click();

})
    it ('email input exists', () => {
    cy.get('[data-cy="login-input-username"]').should('exist').click().type('testuser');
    cy.get('[data-cy="login-input-username"]').should('have.value', 'testuser');
    cy.get('[data-cy="login-input-username"]').click().clear();
    cy.get('[data-cy="login-input-username"]').should('have.value', '');
    })

    it ('password input exists', () => {
    cy.get('[data-cy="login-input-password"]').should('exist').click().type('testpassword');
    cy.get('[data-cy="login-input-password"]').should('have.value', 'testpassword');
    cy.get('[data-cy="login-input-password"]').click().clear();
    cy.get('[data-cy="login-input-password"]').should('have.value', '');
    })
})
