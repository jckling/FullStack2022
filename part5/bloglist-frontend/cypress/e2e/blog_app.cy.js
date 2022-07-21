describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'root',
      username: 'root',
      password: 'sekret'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user) 
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
    cy.get('button').contains('login')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('root')
      cy.get('#password').type('sekret')
      cy.get('#login-button').click()

      cy.contains('root logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('root')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.contains('wrong username or password')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'root', password: 'sekret' })
    })

    it('A blog can be created', function() {
      cy.contains('create new blog').click()
      cy.get('#title').type("Jckling's Blog")
      cy.get('#author').type('Jckling')
      cy.get('#url').type('https://jckling.github.io/')

      cy.get('#create-button').click()
      cy.contains(`A new blog "Jckling's Blog" by Jckling added.`)
    })

    describe('and some blogs exists', function () {
      beforeEach(function () {
        cy.createBlog({ title: 'first blog', author: "Jckling", url: "https://jckling.github.io/" })
        cy.createBlog({ title: 'second blog', author: "Jckling", url: "https://jckling.github.io/" })
        cy.createBlog({ title: 'third blog', author: "Jckling", url: "https://jckling.github.io/" })
      })

      it('blog can be liked', function () {
        cy.contains('second blog')
          .contains('view')
          .click()

        cy.contains('second blog').parent().contains('0')
        cy.contains('second blog').parent().contains('like').click()
        cy.contains('second blog').parent().contains('1')
      })

      it('blog can be deleted by creator', function () {
        const user = {
          name: 'root',
          username: 'root',
          password: 'sekret'
        }
        cy.login(user)

        cy.contains('second blog')
          .contains('view')
          .click()
        
        cy.contains('second blog').parent().contains('remove').click()
        cy.contains('Removed second blog by Jckling.')
      })

      it('blog can not be deleted by other users', function () {
        const user = {
          name: 'user',
          username: 'user',
          password: 'password'
        }
        cy.login(user)

        cy.contains('second blog')
          .contains('view')
          .click()
        
        cy.contains('second blog').parent().contains('remove').should('be.not.visible')
        cy.contains('second blog').parent().contains('remove').click()
        cy.contains('401')
      })
    })
  })
})