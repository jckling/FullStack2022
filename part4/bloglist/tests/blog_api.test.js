const mongoose = require('mongoose')
const supertest = require('supertest')

const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('a blog has specific properties', async () => {
    const response = await api.get('/api/blogs')
    const blog = response.body[0]

    expect(blog.id).toBeDefined()
    expect(blog.title).toBeDefined()
    expect(blog.author).toBeDefined()
    expect(blog.url).toBeDefined()
    expect(blog.likes).toBeDefined()
    expect(blog._id).toBeUndefined()
    expect(blog.__v).toBeUndefined()
  });

  describe('addition of a new blog', () => {
    test('succeeds with valid data', async () => {
      const newBlog = {
        title: 'Fullstack 2022',
        author: 'Helsinki',
        url: 'https://fullstackopen.com/',
        likes: 2022,
      };

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

      const addedBlog = blogsAtEnd.find((blog) => blog.title === newBlog.title);
      expect(addedBlog).toBeDefined();

    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})
