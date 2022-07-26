const mongoose = require('mongoose')
const supertest = require('supertest')

const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')

describe('when there is initially some users at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const initialUsers = await helper.initialUsers()
    await User.insertMany(initialUsers)
  })

  test('users are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all users are returned', async () => {
    const response = await api.get('/api/users')
    const initialUsers = await helper.initialUsers()
    expect(response.body).toHaveLength(initialUsers.length)
  })

  test('a user has specific properties', async () => {
    const response = await api.get('/api/users')
    const user = response.body[0]

    expect(user.id).toBeDefined()
    expect(user.name).toBeDefined()
    expect(user.username).toBeDefined()
    expect(user.passwordHash).toBeUndefined()
    expect(user._id).toBeUndefined()
    expect(user.__v).toBeUndefined()
  })

  describe('addition of a new user', () => {
    test('succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

      const usernames = usersAtEnd.map(u => u.username)
      expect(usernames).toContain(newUser.username)
    })

    test('fails with proper statuscode and message if username already taken', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 'salainen',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('username must be unique')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('fails with proper statuscode and message if username is less than three characters', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'ro',
        name: 'Superuser',
        password: 'salainen',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('both username and password must have at least 3 characters')

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})
