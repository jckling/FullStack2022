const listHelper = require('../utils/list_helper')
const testHelper = require('./test_helper')

test('dummy returns one', () => {
  const blogs = []
  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  test('when list has no blog, equals zero', () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })

  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0,
    },
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  const blogs = testHelper.initialBlogs

  test('total likes', () => {
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(36)
  })
})

describe('favorite blog', () => {
  const blogs = testHelper.initialBlogs

  const favorite = {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    likes: 12,
  }

  test('when list has no blog, equals undefined', () => {
    const result = listHelper.favoriteBlog([])
    expect(result).toBeUndefined()
  })

  test('favorite blog', () => {
    const result = listHelper.favoriteBlog(blogs)
    expect(result).toEqual(favorite)
  })
})

describe('most blogs', () => {
  const blogs = testHelper.initialBlogs

  const most = {
    author: 'Robert C. Martin',
    blogs: 3,
  }

  test('when list has no blog, equals undefined', () => {
    const result = listHelper.mostBlogs([])
    expect(result).toBeUndefined()
  })

  test('most blogs', () => {
    const result = listHelper.mostBlogs(blogs)
    expect(result).toEqual(most)
  })
})

describe('most likes', () => {
  const blogs = testHelper.initialBlogs

  const most = {
    author: 'Edsger W. Dijkstra',
    likes: 17,
  }

  test('when list has no blog, equals undefined', () => {
    const result = listHelper.mostLikes([])
    expect(result).toBeUndefined()
  })

  test('most likes', () => {
    const result = listHelper.mostLikes(blogs)
    expect(result).toEqual(most)
  })
})
