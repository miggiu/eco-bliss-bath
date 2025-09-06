describe ('user interactions with cart', () => {
    afterEach(() => {
        // Clear cookies and local storage after each test to ensure test isolation
        cy.clearCookies();
        cy.clearLocalStorage();
    });
    it('not logged in : add to cart redirects to login', () => {
        cy.visit('http://localhost:4200');
        cy.get('[data-cy="nav-link-products"]').should('exist').click().wait(1000);
        cy.visitSpecificProduct('Poussière de lune', 2);
        cy.get('[data-cy="detail-product-add"]').click();
        cy.url().should('include', '/login');
    })
    it('logged in : add to cart should exist, redirects user to cart and product should be added to cart', () => {
        // logs in to proceed test
        cy.visit('http://localhost:4200');
        cy.login('test2@test.fr','testtest');
        cy.get('[data-cy="nav-link-products"]').should('exist').click();
        cy.url().should('include', '/products');
        cy.visitSpecificProduct('Poussière de lune', 2);
        cy.addToCartAndChecksNetwork();
        cy.url().should('include', '/cart');
        cy.get('[data-cy="cart-line-name"]').eq('0').should('have.length', 1);
        cy.get('[data-cy="cart-line-quantity"]').should('have.value', Number('1'));
        // url needs to be ordres/nb of deleted req/delete
        cy.deleteFromCartAndChecksNetwork(0);
        cy.logout();
        });

    it('can add to cart if stock is superior to 1', () => {
// TODO : use mock and not a real product 
        // cy.mockProductsWithStock();
        cy.visit('http://localhost:4200');
        cy.login('test2@test.fr','testtest');
        cy.get('[data-cy="nav-link-products"]').should('exist').click();
        cy.url().should('include', '/products');
        cy.visitSpecificProduct('Poussière de lune', 2);
        cy.get('[data-cy="detail-product-stock"]').should('have.length', 1);
       cy.addToCartAndChecksNetwork();
        cy.url().should('include', '/cart');
        cy.get('[data-cy="cart-line-name"]').eq('0').should('have.length', 1);
        cy.get('[data-cy="cart-line-quantity"]').should('have.value', Number('1'));
         cy.deleteFromCartAndChecksNetwork(0);
        cy.logout();
    });

    it('stock correctly decreases when adding to cart', () => {
        cy.visit('http://localhost:4200');
        cy.login('test2@test.fr','testtest');
        cy.get('[data-cy="nav-link-products"]').should('exist').click();
        cy.url().should('include', '/products');
        cy.visitSpecificProduct('Poussière de lune', 2);
        cy.get('[data-cy="detail-product-stock"]').should('have.length', 1);
        cy.checkStockDecreaseOnAddToCart('Poussière de lune', 2);
        cy.deleteFromCartAndChecksNetwork(0);
        cy.logout();
    });
});