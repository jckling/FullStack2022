import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import Blog from './Blog'

test('renders content', () => {
  const user = {
    id: '62cabd834ad856755f2b1e56',
    username: 'root',
    name: 'root'
  }

  const blog = {
    id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    user: user
  }

  const mockHandler = jest.fn()
  const { container } = render(<Blog blog={blog} updateBlog={mockHandler} removeBlog={mockHandler} user={user}/>)
  const div = container.querySelector('.blog')

  expect(div).toHaveTextContent('Type wars')
  expect(div).toHaveTextContent('Robert C. Martin')
  expect(div).not.toHaveTextContent('http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html')
  expect(div).not.toHaveTextContent('2')
})
