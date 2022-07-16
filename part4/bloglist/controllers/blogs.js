const blogsRouter = require('express').Router()
const middleware = require('../utils/middleware')
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const user = request.user
  const body = request.body

  if (!body.title && !body.url) {
    return response.status(400).json({ error: 'title and url missing' })
  }

  const blog = new Blog({
    ...body,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if (!blog) return response.status(404).end()
  if (blog.user.toString() === user._id.toString()) {
    await blog.delete()
    return response.status(204).end()
  } else {
    return response.status(401).end()
  }
})

blogsRouter.put('/:id', middleware.userExtractor, async (request, response, next) => {
  Blog.findByIdAndUpdate(request.params.id, request.body, { new: true })
    .then(updatedBlog => {
      response.json(updatedBlog)
    })
    .catch(error => next(error))
})

module.exports = blogsRouter