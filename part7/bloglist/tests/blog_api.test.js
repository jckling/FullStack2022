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
  })

  describe('addition of a new blog', () => {
    test('succeeds with valid data', async () => {
      const newBlog = {
        title: 'Fullstack 2022',
        author: 'Helsinki',
        url: 'https://fullstackopen.com/',
        likes: 2022,
      }

      const token = await helper.loginUser()
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

      const addedBlog = blogsAtEnd.find((blog) => blog.title === newBlog.title)
      expect(addedBlog).toBeDefined()
    })

    test('succeeds without likes', async () => {
      const newBlog = {
        title: 'Fullstack 2022',
        author: 'Helsinki',
        url: 'https://fullstackopen.com/',
      }

      const token = await helper.loginUser()
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

      const addedBlog = blogsAtEnd.find((blog) => blog.title === newBlog.title)
      expect(addedBlog).toBeDefined()
      if (addedBlog !== undefined) {
        expect(addedBlog).toEqual({
          id: addedBlog.id,
          ...newBlog,
          likes: 0,
          user: mongoose.Types.ObjectId('62cabd834ad856755f2b1e56'),
        })
      }
    })

    test('fails without title and url', async () => {
      const newBlog = {
        author: 'Helsinki',
        likes: 2022,
      }

      const token = await helper.loginUser()
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      const token = await helper.loginUser()
      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)
      expect(blogsAtEnd).not.toContainEqual(blogToDelete)
    })
  })

  describe('update of a blog', () => {
    test('succeeds with valid data', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const newBlog = {
        ...blogToUpdate,
        likes: 2222,
      }

      const token = await helper.loginUser()
      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(200)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
      expect(blogsAtEnd).toContainEqual({ ...blogToUpdate, ...newBlog })
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})
