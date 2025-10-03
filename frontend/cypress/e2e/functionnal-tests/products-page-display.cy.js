describe('Product Page Display', () => {

  it('checks page loading', () => {
     cy.visit('/');
        cy.intercept('GET', `${Cypress.env('api_url')}/products`).as('getProducts');
        cy.get('[data-cy="nav-link-products"]').should('exist').click();
        cy.wait('@getProducts');
        cy.url().should('include', '/products');
        cy.get('@getProducts').its('response.statusCode').should('eq', 200);
      })

      it('checks product display', () => {
        cy.visitProducts();
        cy.get('[data-cy="product-name"]').should('have.length.greaterThan', 0);
        cy.checkProductDisplay('Sentiments printaniers', 0);
        cy.checkProductDisplay('Chuchotements d\'été', 1);
        cy.checkProductDisplay('Poussière de lune', 2);
        cy.checkProductDisplay('Dans la forêt', 3);
        cy.checkProductDisplay('Extrait de nature', 4);
        cy.checkProductDisplay('Milkyway', 5);
        cy.checkProductDisplay('Mousse de rêve', 6);
        cy.checkProductDisplay('Aurore boréale', 7);
      });

      it ('checks get products API is equal to product array', () => {
       // request to get all products information from API
        cy.request('GET', `${Cypress.env('api_url')}/products`).then((response) => {
          expect(response.status).to.eq(200);
          const productsFromApi = response.body;
          const productsNamesFromApi = response.body.map(product => product.name);
          expect(productsFromApi).to.be.an('array').and.have.length.greaterThan(0);

        // compares to products displayed on page
            cy.visitProducts();
        // checks that array length is the same
            cy.get('[data-cy="product"]').should('have.length', productsFromApi.length);
        // checks that product names are the same
            cy.get('[data-cy="product-name"]').each(($el, index) => {
              expect($el.text()).to.eq(productsNamesFromApi[index]);
            });
        });
    });
});
