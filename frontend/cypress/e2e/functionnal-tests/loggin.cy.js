describe('logs in', () => {

    it('goes to login page', () => {
        cy.visit('/');
        cy.get('[data-cy="nav-link-login"]').should('exist').click();
        cy.url().should('include', '/login');
    })
    
    it('login form exists', () => {
        cy.visit('/');
        cy.get('[data-cy="nav-link-login"]').should('exist').click();
        cy.url().should('include', '/login');
        cy.get('[data-cy="login-form"]').should('exist');
        cy.get('[data-cy="login-input-username"]').should('exist');
        cy.get('[data-cy="login-input-password"]').should('exist');
        cy.get('[data-cy="login-submit"]').should('exist');
    })
    it('submits the login form', () => {
        cy.visit('/');
        cy.get('[data-cy="nav-link-login"]').should('exist').click();
        cy.get('[data-cy="login-input-username"]').type(Cypress.env('test_user_email'));
        cy.get('[data-cy="login-input-password"]').type(Cypress.env('test_user_password'));
        cy.get('[data-cy="login-submit"]').click();
        cy.url().should('include', '/#/');
        cy.get('[data-cy="nav-link-cart"]')
        .should('exist')
        .contains('Mon panier');
    })
}) 