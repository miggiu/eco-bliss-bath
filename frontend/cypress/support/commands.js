// / <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

// Cypress.Commands.add('login', (email, password) => {
//   cy.visit(Cypress.env('url'));
//   cy.get('#email').clear().invoke('select').type(email);
//   cy.get('#password').clear().invoke('select').type(password);
// });

//Command to log in
Cypress.Commands.add('login', (username, password) => {
  cy.visit('/');
  cy.get('[data-cy="nav-link-login"]').should('exist').click();
  cy.get('[data-cy="login-input-username"]').type(username);
  cy.get('[data-cy="login-input-password"]').type(password);
  cy.get('[data-cy="login-submit"]').click().wait(1000);
  cy.url().should('not.include', '/login');
});

//Command to directly go to product page
Cypress.Commands.add('visitProducts', () => {
  cy.visit('/');
  cy.get('[data-cy="nav-link-products"]').should('exist').click();
  cy.url().should('include', '/products');
});

// Command to directly go to the review page
Cypress.Commands.add('visitReviews', () => {
  cy.visit('/');
  cy.get('[data-cy="nav-link-reviews"]').should('exist').click();
  cy.url().should('include', '/reviews');
});

//Command to click on specific product 
Cypress.Commands.add('visitSpecificProduct', (productName, productIndex) => {
  cy.get('[data-cy="product-name"]').contains(productName).should('exist').and('be.visible');
  cy.get('[data-cy="product-link"]').eq(productIndex).contains('Consulter').click();
});

//Command that checks that product name, description and consultation button are displayed
Cypress.Commands.add('checkProductDisplay', (productName, productIndex) => {
    cy.get('[data-cy="product"]').eq(productIndex).should('exist').and('be.visible');
  cy.get('[data-cy="product-name"]').eq(productIndex).should('not.be.empty').and('be.visible');
  cy.get('[data-cy="product-name"]').eq(productIndex).should('contain', productName);
  cy.get('[data-cy="product-ingredients"]').eq(productIndex).should('not.be.empty').and('be.visible');
  cy.get('[data-cy="product-link"]').eq(productIndex).should('not.be.empty').and('be.visible');
});


//Commands that clicks on product and checks that product detail page is loaded with correct information
Cypress.Commands.add('checkSingularProductDisplay', (productName, productIndex) => {
//image description prix stock
    // goes to the product detail page 
    cy.get('[data-cy="product-link"]').eq(productIndex).contains('Consulter').click();
   
    cy.request('GET', `${Cypress.env('api_url')}/products`).then((response) => {
        expect(response.status).to.eq(200);
        const productsFromApiId = response.body.map(product => product.id);

        // gets all information about the product from API to compare
    cy.request('GET', `${Cypress.env('api_url')}/products/${productsFromApiId[productIndex]}`).then((response) => {
        expect(response.status).to.eq(200);
        const productFromApiName = response.body.name;
        const productFromApiDescription = response.body.description;
        const productFromApiPrice = response.body.price;
        const productFromApiStock = response.body.availableStock;
        const productFromApiImage = response.body.picture;

            cy.url().should('include', `/products/${productsFromApiId[productIndex]}`);

            // checks the name
    cy.get('[data-cy="detail-product-name"]').as('detailProductName').should('exist').and('be.visible').and('not.be.empty');
    cy.get('@detailProductName').should('contain', productName);
    cy.get('@detailProductName').should('contain', productFromApiName);

            // checks the description
    cy.get('[data-cy="detail-product-description"]').as('detailProductDescription').should('exist').and('be.visible').and('not.be.empty');
    cy.get('@detailProductDescription').should('contain', productFromApiDescription);

            // checks the price
    cy.get('[data-cy="detail-product-price"]').as('detailProductPrice')
        .should('exist').and('be.visible').and('not.be.empty')
        .invoke('text')
        .then((text) => {
            // Remove spaces and euro sign, replace comma with dot for comparison
        const displayedPrice = text.replace(/\s|€/g, '').replace(',', '.');
        const apiPrice = String(productFromApiPrice).replace(',', '.');
        console.log('Displayed price:', displayedPrice, 'API price:', apiPrice);
        expect(Number(displayedPrice)).to.eq(Number(apiPrice));
    });

            // checks the stock
    cy.get('[data-cy="detail-product-stock"]').as('detailProductStock').should('exist').and('be.visible').and('not.be.empty');
    cy.get('@detailProductStock').should('contain', productFromApiStock);

            // checks the image
    cy.get('[data-cy="detail-product-img"]').as('detailProductImage').should('exist').and('be.visible');
    cy.get('@detailProductImage').should('have.attr', 'src').and('eq', productFromApiImage);
    })

    // goes back to products page
    cy.get('[data-cy="nav-link-products"]').should('exist').click();
    cy.url().should('include', '/products');
})
});

    // Command that adds to cart and checks that network call is successful for add to cart
    Cypress.Commands.add('addToCartAndChecksNetwork', () => {
      cy.intercept('PUT', `${Cypress.env('api_url')}/orders/add`).as('addedToCart').then(() => {
             cy.get('[data-cy="detail-product-add"]').contains('Ajouter au panier').click();
            cy.wait('@addedToCart').its('response.statusCode').should('eq', 200);
        });
      });

      //Command that checks that product stock is lowering in product detail page when adding to cart
      Cypress.Commands.add('checkStockDecreaseOnAddToCart', (productName,productIndex) => {
         cy.get('[data-cy="nav-link-products"]').should('exist').click();
         cy.visitSpecificProduct(productName,productIndex);
         cy.wait(500);
          cy.get('[data-cy="detail-product-stock"]').should('exist').and('be.visible').and('not.be.empty');
          cy.get('[data-cy="detail-product-stock"]').invoke('text').then((text) => {
            const displayedStock = parseInt(text.match(/-?\d+/)?.[0] || '0', 10);
            cy.wrap(displayedStock).as('stockBeforeAdd'); 
          });
          cy.addToCartAndChecksNetwork();
         // checks that stock has decreased by 1
        cy.get('@stockBeforeAdd').then((beforeAddCart) => { 
          const expectedStock = beforeAddCart - 1;
          cy.get('[data-cy="nav-link-products"]').should('exist').click();
          cy.visitSpecificProduct(productName,productIndex);
          cy.wait(500);
          cy.get('[data-cy="detail-product-stock"]').should('exist').and('be.visible').and('not.be.empty');
            cy.get('[data-cy="detail-product-stock"]').invoke('text').then((text) => {
              const displayedStock = parseInt(text.match(/-?\d+/)?.[0] || '0', 10);
              expect(displayedStock).to.eq(expectedStock);
              cy.get('[data-cy="nav-link-cart"]').contains('Mon panier').click();
              cy.url().should('include', '/cart');
            });
        });
      });

      //Command that checks that product stock is increasing in product detail page when removing from cart
      Cypress.Commands.add('checkStockIncreaseOnRemoveFromCart', (productName, productIndex) => {
        // logs initial stock
         cy.get('[data-cy="nav-link-products"]').should('exist').click();
         cy.visitSpecificProduct(productName, productIndex);
         cy.wait(500);
         cy.get('[data-cy="detail-product-stock"]').should('exist').and('be.visible').and('not.be.empty');
         cy.get('[data-cy="detail-product-stock"]').invoke('text').then((text) => {
           const initialStock = parseInt(text.match(/-?\d+/)?.[0] || '0', 10);
           cy.wrap(initialStock).as('initialStock'); 
         });
         
         // add to cart 
         cy.addToCartAndChecksNetwork();

         // check that stock has decreased by 1
         cy.get('[data-cy="nav-link-products"]').should('exist').click();
         cy.visitSpecificProduct(productName, productIndex);
         cy.get('@initialStock').then((initialStock) => {
           const expectedStockAfterAdd = initialStock - 1;
           cy.get('[data-cy="detail-product-stock"]').should('exist').and('be.visible').and('not.be.empty');
           // Wait for the stock to update to the expected value
           cy.get('[data-cy="detail-product-stock"]').should('contain', expectedStockAfterAdd.toString());
           cy.get('[data-cy="detail-product-stock"]').invoke('text').then((text) => {
             const displayedStock = parseInt(text.match(/-?\d+/)?.[0] || '0', 10);
             expect(displayedStock).to.eq(expectedStockAfterAdd);
           });
         });
         // remove product from cart
         cy.get('[data-cy="nav-link-cart"]').contains('Mon panier').click();
         cy.url().should('include', '/cart');
         cy.deleteFromCartAndChecksNetwork(0);
         
         // check that stock has returned to initial level
         cy.get('@initialStock').then((initialStock) => {
           cy.get('[data-cy="nav-link-products"]').should('exist').click();
           cy.visitSpecificProduct(productName, productIndex);
           cy.wait(500);
           cy.get('[data-cy="detail-product-stock"]').should('exist').and('be.visible').and('not.be.empty');
           cy.get('[data-cy="detail-product-stock"]').invoke('text').then((text) => {
             const finalStock = parseInt(text.match(/-?\d+/)?.[0] || '0', 10);
             expect(finalStock).to.eq(initialStock); 
           });
         });
      });

      Cypress.Commands.add('goToCart', () => {
        cy.get('[data-cy="nav-link-cart"]').should('exist').click();
        cy.url().should('include', '/cart');
      });

      Cypress.Commands.add('cartClear', () => {
             cy.visit('/');
        cy.login(Cypress.env('test_user_email'), Cypress.env('test_user_password'));

        cy.goToCart();

        cy.get('body').then($body => {
            if ($body.find('[data-cy="cart-line-name"]').length > 0) {
                cy.log('Found products in cart - cleaning up...');
                // loop to delete all items in the cart
                cy.get('[data-cy="cart-line-name"]').then($items => {
                    const itemCount = $items.length;
                    cy.log(`Found ${itemCount} items to delete`);
                    
                    for (let i = 0; i < itemCount; i++) {
                        cy.get('[data-cy="cart-line-name"]').then($currentItems => {
                            if ($currentItems.length > 0) {
                                cy.deleteFromCartAndChecksNetwork(0);
                            }
                        });
                    }
                });
                
                // Verify cart is empty
                cy.get('[data-cy="cart-empty-message"]').should('be.visible');
                cy.log('Cart successfully cleared');
            } else {
                cy.log('Cart is already empty - no cleanup needed');
            }
        });
      });

      // Command that deletes from cart and checks that network call is successful for delete from cart
      // for one element in cart only
      Cypress.Commands.add('deleteFromCartAndChecksNetwork', (productIndex) => {
           cy.intercept('DELETE', `${Cypress.env('api_url')}/orders/*/delete`).as('removedFromCart').then(() => {
            cy.get('[data-cy="cart-line-delete"]').eq(productIndex).should('exist').click();
            cy.wait('@removedFromCart').its('response.statusCode').should('eq', 200);
            cy.get('[data-cy="cart-line-name"]').should('not.exist');
            cy.get('[data-cy="cart-empty"]').should('exist').and('be.visible');
        });
      });

      // Command that logs user out 
      Cypress.Commands.add('logout', () => {
        cy.get('[data-cy="nav-link-logout"]').should('exist').contains('Déconnexion').click();
        cy.get('[data-cy="nav-link-logout"]').should('not.exist');
        cy.get('[data-cy="nav-link-login"]').should('exist').contains('Connexion').and('be.visible');
      });

//Command that mocks products with stock > 1

// Command that checks specific product page in API
Cypress.Commands.add('checkSpecificProductPageAPI', (productId) => {
  cy.request('GET', `${Cypress.env('api_url')}/products/${productId}`).then((response) => {
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('id', productId);
    expect(response.body).to.have.property('name').and.to.be.a('string').and.to.not.be.empty;
    expect(response.body).to.have.property('availableStock').and.to.be.a('number');
    expect(response.body).to.have.property('skin').and.to.be.a('string').and.to.not.be.empty;
    expect(response.body).to.have.property('aromas').and.to.be.a('string').and.to.not.be.empty;
    expect(response.body).to.have.property('ingredients').and.to.be.a('string').and.to.not.be.empty;
    expect(response.body).to.have.property('description').and.to.be.a('string').and.to.not.be.empty;
    expect(response.body).to.have.property('price').and.to.be.a('number');
    expect(response.body).to.have.property('picture').and.to.be.a('string').and.to.not.be.empty;
    expect(response.body).to.have.property('varieties').and.to.be.a('number');
  });
});