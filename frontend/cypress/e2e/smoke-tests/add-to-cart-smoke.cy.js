describe('add to cart smoke tests', () => {

    it('not logged in : add to cart redirects to login', () => {
        cy.visit('http://localhost:4200');
        cy.get('[data-cy="nav-link-products"]').should('exist').click().wait(1000);
        cy.get('[data-cy="product"] > [data-cy="product-name"]').first().contains('Sentiments printaniers')
        .get('.add-to-cart')
        .get('[data-cy="product-link"]').should('exist');
        cy.get('[data-cy="product-link"]').contains('Consulter').click();
        cy.get('[data-cy="detail-product-add"]').click();
        cy.url().should('include', '/login');
    })

    it('logged in : add to cart should exist and redirects to cart', () => {
        // logs in to proceed test 
        cy.visit('http://localhost:4200');
        cy.get('[data-cy="nav-link-login"]').should('exist').click();
        cy.get('[data-cy="login-input-username"]').type('test2@test.fr');
        cy.get('[data-cy="login-input-password"]').type('testtest');
        cy.get('[data-cy="login-submit"]').click().wait(1000);
         cy.get('[data-cy="nav-link-products"]').should('exist').click();

        cy.get('[data-cy="product"] > [data-cy="product-name"]').first().contains('Sentiments printaniers')
        .get('.add-to-cart')
        .get('[data-cy="product-link"]').should('exist');
        cy.get('[data-cy="product-link"]').contains('Consulter').click();
        cy.get('[data-cy="detail-product-add"]').click();
        cy.url().should('include', '/cart');
    })
})
