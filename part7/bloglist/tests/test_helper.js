const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
    user: '62cabd834ad856755f2b1e56',
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
    user: '62cabd834ad856755f2b1e56',
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
    user: '62cabd834ad856755f2b1e57',
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
    user: '62cabd834ad856755f2b1e57',
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
    user: '62cabd834ad856755f2b1e58',
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
    user: '62cabd834ad856755f2b1e58',
  },
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon', author: 'removed' })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

const initialUsers = async () => {
  const passwordHash = await bcrypt.hash('sekret', 10)
  const initialUsers = [
    {
      _id: '62cabd834ad856755f2b1e56',
      username: 'root',
      name: 'root',
      passwordHash: passwordHash,
      blogs: ['5a422a851b54a676234d17f7', '5a422aa71b54a676234d17f8'],
    },
    {
      _id: '62cabd834ad856755f2b1e57',
      username: 'abel',
      name: 'abel',
      passwordHash: passwordHash,
      blogs: ['5a422b3a1b54a676234d17f9', '5a422b891b54a676234d17fa'],
    },
    {
      _id: '62cabd834ad856755f2b1e58',
      username: 'cain',
      name: 'cain',
      passwordHash: passwordHash,
      blogs: ['5a422ba71b54a676234d17fb', '5a422bc61b54a676234d17fc'],
    },
  ]
  return initialUsers
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((u) => u.toJSON())
}

const loginUser = async () => {
  const result = await api
    .post('/api/login')
    .send({ username: 'root', password: 'sekret' })
    .expect(200)

  return result.body.token
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  initialUsers,
  usersInDb,
  loginUser,
}
