describe('API POST Tests', () => {
    it('should return a status 401 and not give a token if the user does not exist', () => {
        cy.request({
            failOnStatusCode: false,
            method: 'POST',
            url: 'http://localhost:8081/login',
            body: {
                username: 'shouldnotwork@no.com',
                password: 'wrongpassword'
            },


        }).then((response) => {
            expect(response.status).to.eq(401);
            expect(response.body).to.not.have.property('token');
            expect(response.body).to.have.property('message');
            expect(response.body.message).to.be.a('string');
            expect(response.body.message).to.include('Invalid credentials.');
        });
    });

    it('should return a token if the user exists and is correctly logged in', () => {
        cy.request('POST', 'http://localhost:8081/login', {
            username: 'test2@test.fr',
            password: 'testtest'
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('token');
            expect(response.body.token).to.be.a('string');
            return response.body.token;
        })
    })

    it('connected user can add a product to the cart', () => {
        cy.request('POST', 'http://localhost:8081/login', {
            failOnStatusCode: false,
            username: 'test2@test.fr',
            password: 'testtest'
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('token');
            return response.body.token;
        }).then((token) => {
            try {
                cy.request({
                    failOnStatusCode: false,
                    method: 'POST',
                    url: 'http://localhost:8081/orders/add',
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: {
                        product: 5,
                        quantity: 2
                    }
                }).then((response) => {
                    expect(response.status).to.eq(200);
                });
            } catch (error) {
                throw new Error(`Request failed: ${error.message}`);
            }
        });
    });

    it('out of stock product cannot be added to the cart', () => {
        cy.request('POST', 'http://localhost:8081/login', {
            failOnStatusCode: false,
            username: 'test2@test.fr',
            password: 'testtest'
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('token');
            return response.body.token;
        }).then((token) => {
            try {
                cy.request({
                    failOnStatusCode: false,
                    method: 'POST',
                    url: 'http://localhost:8081/orders/add',
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: {
                        product: 3,
                        quantity: 1
                    }
                }).then((response) => {
                    expect(response.status).to.eq(400);
                    expect(response.body).to.have.property('message');
                    expect(response.body.message).to.include('Product is out of stock');
                });
            } catch (error) {
                throw new Error(`Request failed: ${error.message}`);
            }
        });
    });

    // test with method PUT that is currently implemented as a POST in the backend to check if an out of stock product can be added to the cart
    // CAUTION: this SHOULD NOT WORK both because of the PUT method and because the product is out of stock
    it('using PUT method, out of stock product should not be added to the cart', () => {
        cy.request('POST', 'http://localhost:8081/login', {
            failOnStatusCode: false,
            username: 'test2@test.fr',
            password: 'testtest'
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('token');
            return response.body.token;
        }).then((token) => {
            try {
                cy.request({
                    failOnStatusCode: false,
                    method: 'PUT',
                    url: 'http://localhost:8081/orders/add',
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: {
                        product: 3,
                        quantity: 2
                    }
                }).then((response) => {
                    expect(response.status).to.eq(400);
                    expect(response.body).to.have.property('message');
                    expect(response.body.message).to.include('Product is out of stock');

                    return cy.request('GET', 'http://localhost:8081/orders', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }).then((getResponse) => {
                        expect(getResponse.status).to.eq(200);
                        expect(getResponse.body).to.be.an('array');
                        expect(getResponse.body.length).to.eq(0);
                    });
                });
            } catch (error) {
                throw new Error(`Request failed: ${error.message}`);
            }
        });
    });

    it('connected user can post a review for a product', () => {
        cy.request('POST', 'http://localhost:8081/login', {
            failOnStatusCode: false,
            username: 'test2@test.fr',
            password: 'testtest'
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('token');
            return response.body.token;
        }).then((token) => {
            try {
                cy.request({
                    failOnStatusCode: false,
                    method: 'POST',
                    url: 'http://localhost:8081/reviews',
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: {
                        title: "What a nice product!",
                        comment: "Very soft and smells good.",
                        rating: 5
                    }
                }).then((response) => {
                    expect(response.status).to.be.oneOf([201, 200]);
                    expect(response.body).to.have.property('id');
                    expect(response.body).to.have.a.property('author');
                    expect(response.body.author).to.have.property('id');
                    return { reviewId: response.body.id, authorId: response.body.author.id };
                }).then(({ reviewId, authorId }) => {
                    return cy.request('GET', `http://localhost:8081/reviews`)
                        .then((getResponse) => {
                            expect(getResponse.status).to.eq(200);
                            expect(getResponse.body).to.be.an('array');
                            expect(getResponse.body.length).to.be.greaterThan(0);
                            const review = getResponse.body.find(r => r.id === reviewId);
                            expect(review).to.exist;
                            expect(review).to.have.property('author');
                            expect(review.author).to.have.property('id', authorId);
                        });
                });
            } catch (error) {
                throw new Error(`Request failed: ${error.message}`);
            }
        });
    });
});