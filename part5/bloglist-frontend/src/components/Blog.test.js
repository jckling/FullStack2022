import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

let component

beforeEach(() => {
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
  component = render(<Blog blog={blog} updateBlog={mockHandler} removeBlog={mockHandler} user={user}/>)
})

test('renders content', () => {
  const div = component.container.querySelector('.blog')
  expect(div).toHaveTextContent('Type wars')
  expect(div).toHaveTextContent('Robert C. Martin')
  
  const detail = component.container.querySelector('.detail')
  expect(detail).toHaveStyle({ display: 'none' })
})

test('clicking the button shows the url and likes', async () => {
  const eventUser = userEvent.setup()
  const button = component.getByText('view')
  await eventUser.click(button)

  const detail = component.container.querySelector('.detail')
  expect(detail).not.toHaveStyle({ display: 'none' })
  expect(detail).toHaveTextContent('http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html')
  expect(detail).toHaveTextContent('2')
})