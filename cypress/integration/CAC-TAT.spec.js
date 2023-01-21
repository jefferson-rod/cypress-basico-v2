/// <reference types="Cypress" />


describe('Central de Atendimento ao Cliente TAT', function () {

    //beforeEach(function () {
        cy.visit('src/index.html')
    })

    it('verifica o título da aplicação', function () {

        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })

    it('preenche os campos obrigatórios e envia o formulário', function () {
        const longText = 'teste,teste,teste,teste,teste,teste,teste,teste,teste,teste,teste,teste,teste,teste,teste,teste,teste,teste'
        cy.get('#firstName').type('jefferson')
        cy.get('#lastName').type('rodrigues')
        cy.get('#email').type('jeffersonteste@gmail.com')
        cy.get('#open-text-area').type(longText, { delay: 0 })
        cy.get('button[type="submit"]').click()

        cy.get('.success').should('be.visible')

    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function () {
        cy.get('#firstName').type('jefferson')
        cy.get('#lastName').type('rodrigues')
        cy.get('#email').type('jeffersonteste@gmail,com')
        cy.get('#open-text-area').type('teste')
        cy.get('button[type="submit"]').click()

        cy.get('.error').should('be.visible')

    })

    it('campo telefone continua vazio quando preenchido com campo não-numérico', function () {

        cy.get('#phone')
            .type('abcdefghij')
            .should('have.value', '')
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function () {

        cy.get('#firstName').type('jefferson')
        cy.get('#lastName').type('rodrigues')
        cy.get('#email').type('jeffersonteste@gmail.com')
        cy.get('#phone-checkbox').check()
        cy.get('#open-text-area').type('teste')
        cy.get('button[type="submit"]').click()

        cy.get('.error').should('be.visible')

    })

    it('preenche e limpa os campos nome, sobrenome, email e telefone', function () {
        cy.get('#firstName')
            .type('jefferson')
            .should('have.value', 'jefferson')
            .clear()
            .should('have.value', '')
        cy.get('#lastName')
            .type('rodrigues')
            .should('have.value', 'rodrigues')
            .clear()
            .should('have.value', '')
        cy.get('#email')
            .type('jeffersonteste@gmail.com')
            .should('have.value', 'jeffersonteste@gmail.com')
            .clear()
            .should('have.value', '')
        cy.get('#phone')
            .type('1234567890')
            .should('have.value', '1234567890')
            .clear()
            .should('have.value', '')

    })

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function () {

        cy.get('button[type="submit"]').click()
        cy.get('.error').should('be.visible')
    })

    it('envia o formuário com sucesso usando um comando customizado', function () {
        //Na pasta support/commands.js foi criado um comando customizado a qual executa os campos 
        //obrigatórios sendo executado pelo primeiro comando abaixo.
        //Também na mesma pasta existe o exemplo do comando cy.contains() que substitui o cy.get()
        //podendo receber o identificador e como segundo argumento um texto que contenha no mesmo.
        cy.fillMandatoryFieldsAndSubmit()

        cy.get('.success').should('be.visible')

    })

    it('seleciona um produto (YouTube) por seu texto', function () {

        cy.get('#product')
            .select('YouTube') // o comando select seleciona um campo de seleção suspensa, no exemplo o seletor foi selecionado pelo texto
            .should('have.value', 'youtube')// Foi dada uma assertiva se o valor do campo marcado era o valor do seletor

    })

    it('seleciona um produto (Mentoria) por seu valor (value)', function () {

        cy.get('#product')
            .select('mentoria')//neste exemplo o seletor foi selecionado pelo seu valor obtido inspecionando o campo de seleção suspensa
            .should('have.value', 'mentoria')


    })


    it('seleciona um produto (Blog) por seu índice', function () {

        cy.get('#product')
            .select(1) // neste exemplo o campo blog foi selecionado pelo indice 1 , no caso sempre começa a contagem no 0.
            .should('have.value', 'blog')

    })

    it('marca o tipo de atendimento "Feedback"', function () {
        cy.get('input[type="radio"][value="feedback"]')
            .check() // neste exemplo marcamos um campo tipo radio com a opção check, poderiamos usar o comando .click mais o correto é dizer que estamos checando o radio e não clicando.
            .should('have.value', 'feedback')

    })


    it('marca cada tipo de atendimento', function () {

        cy.get('input[type="radio"]')
            .should('have.length', 3)//nessa função eu estou pedindo para verificar o comprimento(quantidade) dos campos, no caso são 3. 
            .each(function ($radio) {// o comando each serve para armazenar os radios para receber uma função de callback.
                cy.wrap($radio).check()//o comando .wrap empacota os elementos vindos da função para se poder passar comandos, nesse caso o .check .
                cy.wrap($radio).should('be.checked')//aqui estou dizendo para o sistema confirmar se os radios foram checados.
            })

    })


    it('marca ambos checkboxes, depois desmarca o último', function () {

        cy.get('input[type="checkbox"]')//quando eu dou um get nos checkbox ele seleciona os dois sem precisar dar um .get pata cada um.
            .check()
            .should('be.checked')
            .last()// o comando .last simplesmente seleciona o último elemento
            .uncheck()// o comando .uncheck pede para o elemento 'no caso o selecionado pelo last' ser desmarcado
            .should('not.be.checked')// aqui eu verifico se realmente o elemento selecionado foi desmarcado

    })


    it('seleciona um arquivo da pasta fixtures', function () {

        cy.get('input[type="file"]')
            .should('not.have.value')
            .selectFile('./cypress/fixtures/example.json')
            .should(function ($input) {
                expect($input[0].files[0].name).to.equal('example.json')
            })


    })


    it('seleciona um arquivo simulando um drag-and-drop', function () {
        cy.get('input[type="file"]')
            .should('not.have.value')
            .selectFile('./cypress/fixtures/example.json', { action: 'drag-drop' })//o teste foi copiado do anterior com uma unica diferença, na função select.file foi adicionada uma ação chamada drag-drop que em vez de selecionar o arquivo ele simula arrastar e soltar no campo.
            .should(function ($input) {
                expect($input[0].files[0].name).to.equal('example.json')
            })


    })

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function () {
        cy.fixture("example.json").as('samplefile')
        cy.get('input[type="file"]')
            .selectFile('@samplefile')
            .should(function ($input) {
                expect($input[0].files[0].name).to.equal('example.json')
            })

    })

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function () {

        cy.get('#privacy a')
            .should('have.attr', 'target', '_blank')

    })


    it('acessa a página da política de privacidade removendo o target e então clicando no link', function () {
        cy.get('#privacy a')
            .invoke('removeAttr', 'target')//o cypress não sabe reconhecer páginas que abrem em outra aba então, o argumento .invoke remove o atributo que faz a pagina abrir em outra aba no caso 'target' assim fazendo a página de politica de privacidade abrir na mesma aba do navegador.
            .click()
        cy.contains('Talking About Testing').should('be.visible')


    })


})
