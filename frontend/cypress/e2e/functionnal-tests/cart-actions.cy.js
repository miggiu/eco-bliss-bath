describe ('user interactions with cart', () => {
    it('not logged in : add to cart redirects to login', () => {
        cy.visit('http://localhost:4200');
        cy.get('[data-cy="nav-link-products"]').should('exist').click().wait(1000);
        cy.get('[data-cy="product"] > [data-cy="product-name"]').first().contains('Sentiments printaniers');
        cy.get('.add-to-cart')
        cy.get('[data-cy="product-link"]').should('exist');
        cy.get('[data-cy="product-link"]').contains('Consulter').click();
        cy.get('[data-cy="detail-product-add"]').click();
        cy.url().should('include', '/login');
    })
    it('logged in : add to cart should exist and redirects to cart', () => {
        // logs in to proceed test 
        cy.visit('http://localhost:4200');
        cy.login('test2@test.fr','testtest');
        cy.get('[data-cy="nav-link-products"]').should('exist').click();
        cy.url().should('include', '/products');
        cy.get('[data-cy="product"] > [data-cy="product-name"]').first().contains('Sentiments printaniers');
        cy.get('.add-to-cart')
        cy.get('[data-cy="product-link"]').should('exist');
        cy.get('[data-cy="product-link"]').contains('Consulter').click();
        cy.get('[data-cy="detail-product-add"]').click();
        cy.url().should('include', '/products');
    });

    it('can add to cart if stock is superior to 1', () => {
// TODO : use mock and not a real product 
        // cy.mockProductsWithStock();
        cy.visit('http://localhost:4200');
        cy.login('test2@test.fr','testtest');
        cy.get('[data-cy="nav-link-products"]').should('exist').click();
        cy.url().should('include', '/products');
        cy.visitSpecificProduct('Poussière de lune');
        cy.get('[data-cy="detail-product-stock"]').should('have.length', 1);
        cy.get('[data-cy="detail-product-add"]').click();
        cy.get('[data-cy="nav-link-cart"]').click();
        cy.url().should('include', '/cart');
        cy.get('[data-cy="cart-line-name"]').eq('0').should('have.length', 1);
        cy.get('[data-cy="cart-line-quantity"]').should('contain', '1');
    });
});