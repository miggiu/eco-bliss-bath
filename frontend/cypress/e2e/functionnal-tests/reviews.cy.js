describe('Reviews user action', () => {
  it('user should be able to access reviews section', () => {
    cy.visit('/');
    cy.get('[data-cy="nav-link-reviews"]').should('exist').click();
   cy.url().should('include', '/reviews');
  });

  it('should not allow disconnected user to add a comment', () => {
    cy.visitReviews();
    cy.get('[data-cy="review-form"]').should('not.exist');
    cy.get('.review-section > p').should('contain', 'Connectez-vous pour ajouter un avis.');
  });

 it('should allow logged in user to add a comment', () => {
    cy.visit('/');
    cy.login(Cypress.env('test_user_email'), Cypress.env('test_user_password'));
    cy.visitReviews();
    cy.get('[data-cy="review-form"]').should('exist');
    cy.get('[data-cy="review-input-rating-images"] > img').eq(3).click(); 
    cy.get('[data-cy="review-input-title"]').type('This is a test title');
    cy.get('[data-cy="review-input-comment"]').type('This is a test comment');
    cy.intercept('POST', `${Cypress.env('api_url')}/reviews`).as('postedReview');
    cy.get('[data-cy="review-submit"]').click();
    cy.wait('@postedReview').its('response.statusCode').should('eq', 200);
    cy.get('@postedReview').then(({ response }) => {
      expect(response.statusCode).to.eq(200);
      const body = response.body;
      expect(body).to.have.property('id');
      expect(body).to.have.property('rating', 4);
      expect(body).to.have.property('title', 'This is a test title');
      expect(body).to.have.property('comment', 'This is a test comment');
      
      cy.request('GET', `${Cypress.env('api_url')}/reviews`).then((getResponse) => {
        expect(getResponse.status).to.eq(200);
        const reviews = getResponse.body;
        const addedReview = reviews.find(review => review.title === 'This is a test title' && review.comment === 'This is a test comment' && review.id === body.id);
        expect(addedReview).to.exist;
      });
    });
    cy.get('[data-cy="review-detail"]').should('contain', 'This is a test title');
    cy.logout();
  });

  it('should not allow submit of empty form', () => {
    cy.visit('/');
    cy.login(Cypress.env('test_user_email'), Cypress.env('test_user_password'));
    cy.visitReviews();
    cy.get('[data-cy="review-form"]').should('exist');
    cy.intercept('POST', `${Cypress.env('api_url')}/reviews`).as('postedReview');
    cy.get('[data-cy="review-submit"]').click();
    cy.get('[data-cy="review-form"] > div > label[for="rating"]').should('have.class', 'error');
    cy.get('[data-cy="review-form"] > div > label[for="title"]').should('have.class', 'error');
    cy.get('[data-cy="review-form"] > div > label[for="comment"]').should('have.class', 'error');
    cy.get('@postedReview').should('not.exist');
  });

    it('should not allow submit of incomplete form', () => {
    cy.visit('/');
    cy.login(Cypress.env('test_user_email'), Cypress.env('test_user_password'));
    cy.visitReviews();
    cy.get('[data-cy="review-form"]').should('exist');
    cy.get('[data-cy="review-input-title"]').type('This is a test title');
    cy.intercept('POST', `${Cypress.env('api_url')}/reviews`).as('postedReview');
    cy.get('[data-cy="review-submit"]').click();
    cy.get('[data-cy="review-form"] > div > label[for="rating"]').should('have.class', 'error');
    cy.get('[data-cy="review-form"] > div > label[for="comment"]').should('have.class', 'error');
    cy.get('@postedReview').should('not.exist');
    });

    it ('no XSS vulnerability in review submission', () => {
    cy.visit('/');
    cy.login(Cypress.env('test_user_email'), Cypress.env('test_user_password'));
    cy.visitReviews();
    cy.get('[data-cy="review-form"]').should('exist');
    cy.get('[data-cy="review-input-rating-images"] > img').eq(3).click();
    cy.get('[data-cy="review-input-title"]').type('<script>alert("hi")</script>');
    cy.get('[data-cy="review-input-comment"]').type('<script>alert("hi")</script>');
    cy.intercept('POST', `${Cypress.env('api_url')}/reviews`).as('postedReview');
    cy.get('[data-cy="review-submit"]').click();
    cy.wait('@postedReview').its('response.statusCode').should('eq', 200);
    cy.get('[data-cy="review-detail"]').should('not.contain', '<script>').and('not.contain', 'alert("hi")');

    })

    it('comment should have a maximum of x characters', () => {
    cy.visit('/');
    cy.login(Cypress.env('test_user_email'), Cypress.env('test_user_password'));
    cy.visitReviews();
    cy.get('[data-cy="review-form"]').should('exist');
    cy.get('[data-cy="review-input-title"]').type('This is a test title');
    const longComment = 'a'.repeat(1001);
    cy.get('[data-cy="review-input-rating-images"] > img').eq(3).click(); 
    cy.get('[data-cy="review-input-comment"]').type(longComment);
    cy.intercept('POST', `${Cypress.env('api_url')}/reviews`).as('postedReview');
    cy.get('[data-cy="review-submit"]').click();
    cy.wait('@postedReview').then(({ response }) => {
      expect(response.statusCode).to.eq(400);
    });
  });
});