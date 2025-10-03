describe('add to cart smoke tests', () => {

    it('not logged in : add to cart redirects to login', () => {
        cy.visit('/');
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
        cy.visit('/');
        cy.login(Cypress.env('test_user_email'), Cypress.env('test_user_password'));
         cy.get('[data-cy="nav-link-products"]').should('exist').click();

        cy.get('[data-cy="product"] > [data-cy="product-name"]').first().contains('Sentiments printaniers')
        .get('.add-to-cart')
        .get('[data-cy="product-link"]').should('exist');
        cy.get('[data-cy="product-link"]').contains('Consulter').click();
        cy.get('[data-cy="detail-product-add"]').contains('Ajouter au panier').click();
        cy.url().should('include', '/cart');
    })
})
