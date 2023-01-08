Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function() {
    cy.get('#firstName').type('jefferson')
    cy.get('#lastName').type('rodrigues')
    cy.get('#email').type('jeffersonteste@gmail.com')
    cy.get('#open-text-area').type('teste')
    cy.contains('button', 'Enviar').click()

})