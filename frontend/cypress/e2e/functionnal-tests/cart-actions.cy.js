// CAUTION : for all this tests, we are using PUT and not POST
// because there is currently an issue with the POST /orders/add endpoint
// which is on a PUT request in the backend. 

describe ('user interactions with cart', () => {

    before (() => {
       cy.cartClear();
       cy.logout();
    });

    it ('clears cart if products remain from previous tests', () => {
        cy.visit('/');
        cy.login(Cypress.env('test_user_email'), Cypress.env('test_user_password'));
        cy.get('[data-cy="nav-link-cart"]').should('exist').click();

    });
    it('not logged in : add to cart redirects to login', () => {
        cy.visit('/');
        cy.get('[data-cy="nav-link-products"]').should('exist').click().wait(1000);
        cy.visitSpecificProduct('Poussière de lune', 2);
        cy.get('[data-cy="detail-product-add"]').click();
        cy.url().should('include', '/login');
    })
    it('logged in : add to cart should exist, redirects user to cart and product should be added to cart', () => {
        // logs in to proceed test
        cy.visit('/');
        cy.login(Cypress.env('test_user_email'), Cypress.env('test_user_password'));
        cy.get('[data-cy="nav-link-products"]').should('exist').click();
        cy.url().should('include', '/products');
        cy.visitSpecificProduct('Poussière de lune', 2);
        cy.addToCartAndChecksNetwork();
        cy.url().should('include', '/cart');
        cy.get('[data-cy="cart-line-name"]').eq('0').should('have.length', 1);
        cy.get('[data-cy="cart-line-quantity"]').should('have.value', Number('1'));
        cy.deleteFromCartAndChecksNetwork(0);
        cy.logout();
        });

    it('can add to cart if stock is superior to 1', () => {
        cy.fixture('product-with-stock.json').then((data) => {
            
            cy.visit('/');
            cy.intercept('POST', `${Cypress.env('api_url')}/login`).as('loginRequest');
            cy.login(Cypress.env('test_user_email'), Cypress.env('test_user_password'));
            
            cy.wait('@loginRequest').then((response) => {
                const token = response.response.body.token;
                
                cy.request({
                    failOnStatusCode: false,
                    method: 'PUT',
                    url: `${Cypress.env('api_url')}/orders/add`,
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: {
                        product: data.productWithStock.id,
                        quantity: 2
                    }
                }).then((response) => {
                    console.log('Request body:', {
                        product: data.productWithStock.id,
                        quantity: 2
                    });
                    console.log('Response:', response.body);
                    expect(response.status).to.eq(200);
                    expect(response.body).to.have.property('id');
                });
                cy.get('[data-cy="nav-link-cart"]').should('exist').click();
                cy.url().should('include', '/cart');
                cy.get('[data-cy="cart-line-name"]').eq('0').should('have.length', 1);
                cy.get('[data-cy="cart-line-quantity"]').should('have.value', Number('2'));
            });
        });
        cy.goToCart();
        cy.deleteFromCartAndChecksNetwork(0);
        cy.logout();
    });

    it('cannot add to cart if stock is 0', () => {
        cy.fixture('product-out-of-stock.json').then((data) => {
            cy.visit('/');
            cy.intercept('POST', `${Cypress.env('api_url')}/login`).as('loginRequest');
            cy.login(Cypress.env('test_user_email'), Cypress.env('test_user_password'));
            cy.wait('@loginRequest').then((response) => {
                const token = response.response.body.token;
                cy.request({
                    failOnStatusCode: false,
                    method: 'PUT',
                    url: `${Cypress.env('api_url')}/orders/add`,
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: {
                        product: data.productOutOfStock.id,
                        quantity: 1
                    }
                }).then((response) => {
                    expect(response.status).to.eq(400);
                    expect(response.body).to.have.property('error');
                });
            });
        });
        cy.goToCart();
        cy.deleteFromCartAndChecksNetwork(0);
        cy.logout();
    });

    it('cannot add to cart if stock is negative', () => {
        cy.fixture('product-in-negative-stock.json').then((data) => {
            cy.visit('/');
            cy.intercept('POST', `${Cypress.env('api_url')}/login`).as('loginRequest');
            cy.login(Cypress.env('test_user_email'), Cypress.env('test_user_password'));
            cy.wait('@loginRequest').then((response) => {
                const token = response.response.body.token;
                cy.request({
                    failOnStatusCode: false,
                    method: 'PUT',
                    url: `${Cypress.env('api_url')}/orders/add`,
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: {
                        product: data.productInNegativeStock.id,
                        quantity: 1
                    }
                }).then((response) => {
                    expect(response.status).to.eq(400);
                    expect(response.body).to.have.property('error');
                });
            });
        });
        cy.goToCart();
        cy.deleteFromCartAndChecksNetwork(0);
        cy.logout();
    });

    it('stock correctly decreases when adding to cart', () => {
        cy.visit('/');
        cy.login(Cypress.env('test_user_email'), Cypress.env('test_user_password'));
        cy.get('[data-cy="nav-link-products"]').should('exist').click();
        cy.url().should('include', '/products');
        cy.visitSpecificProduct('Poussière de lune', 2);
        cy.get('[data-cy="detail-product-stock"]').should('have.length', 1);
        cy.checkStockDecreaseOnAddToCart('Poussière de lune', 2);
        cy.goToCart();
        cy.deleteFromCartAndChecksNetwork(0);
        cy.logout();
    });

    it('stock correctly increases when removing from cart', () => {
         cy.visit('/');
        cy.login(Cypress.env('test_user_email'), Cypress.env('test_user_password'));
        cy.get('[data-cy="nav-link-products"]').should('exist').click();
        cy.url().should('include', '/products');
        cy.visitSpecificProduct('Poussière de lune', 2);
        cy.get('[data-cy="detail-product-stock"]').should('have.length', 1);
        cy.checkStockIncreaseOnRemoveFromCart('Poussière de lune', 2);
        cy.logout();
    });

    it('can change quantity of a product in the cart', () => {
        cy.visit('/');
        cy.login(Cypress.env('test_user_email'), Cypress.env('test_user_password'));
        cy.get('[data-cy="nav-link-products"]').should('exist').click();
        cy.url().should('include', '/products');
        cy.visitSpecificProduct('Poussière de lune', 2);
        cy.get('[data-cy="detail-product-add"]').click();
        cy.url().should('include', '/cart');
        cy.get('[data-cy="cart-line-quantity"]').eq(0).should('have.value', Number('1'));
        cy.get('[data-cy="cart-line-quantity"]').eq(0).then($input => {
            // Clear the input field
            $input.val('');
        });
        cy.get('[data-cy="cart-line-quantity"]').eq(0).type('3');
        cy.get('[data-cy="cart-line-quantity"]').eq(0).should('have.value', Number('3'));
        cy.deleteFromCartAndChecksNetwork(0);
        cy.logout();
    });

    // Corrective test - only runs if there are products left in cart
    it('cleanup: clear cart if products remain from previous tests', () => {
        cy.cartClear();
        cy.logout();
    });

    
});