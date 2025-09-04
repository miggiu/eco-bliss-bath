describe ('Singular Product Information Display', () => {
    it('checks singular product page loading and information display', () => {
        cy.visitProducts();
        cy.checkSingularProductDisplay('Sentiments printaniers', 0);
        cy.checkSingularProductDisplay('Chuchotements d\'été', 1);
        cy.checkSingularProductDisplay('Poussière de lune', 2);
        cy.checkSingularProductDisplay('Dans la forêt', 3);
        cy.checkSingularProductDisplay('Extrait de nature', 4);
        cy.checkSingularProductDisplay('Milkyway', 5);
        cy.checkSingularProductDisplay('Mousse de rêve', 6);
        cy.checkSingularProductDisplay('Aurore boréale', 7);
    });
});