describe('API GET Tests', () => {
  it('should return a 401 or 403 status when a non-logged user tries to access orders', () => {
    cy.request({
      method: 'GET',
      url: 'http://localhost:8081/orders',
      failOnStatusCode: false
    }).then(response => {
      expect(response.status).to.eq(401);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.be.a('string');
      expect(response.body.message).to.include('Token not found');
    });
  });

  it('should return a 200 status when a logged-in user accesses orders', () => {
    // First, log in to get the token
    cy.request('POST', 'http://localhost:8081/login', {
      username: 'test2@test.fr',
      password: 'testtest'
    }).then((response) => {
      const token = response.body.token;

      // Now, use the token to access the orders
      cy.request({
        method: 'GET',
        url: 'http://localhost:8081/orders',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('id');
      });
    });
  });

    it('can access a specific product page', () => {  
      cy.checkSpecificProductPageAPI(3);
      cy.checkSpecificProductPageAPI(4);
      cy.checkSpecificProductPageAPI(5);
      cy.checkSpecificProductPageAPI(6);
      cy.checkSpecificProductPageAPI(7);
      cy.checkSpecificProductPageAPI(8);
      cy.checkSpecificProductPageAPI(9);
      cy.checkSpecificProductPageAPI(10);
    });
  });