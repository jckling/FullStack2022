import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

let component
const updateBlog = jest.fn()
const removeBlog = jest.fn()

beforeEach(() => {
  const user = {
    id: '62cabd834ad856755f2b1e56',
    username: 'root',
    name: 'root',
  }

  const blog = {
    id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    user: user,
  }

  component = render(
    <Blog
      blog={blog}
      updateBlog={updateBlog}
      removeBlog={removeBlog}
      user={user}
    />
  )
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
  expect(detail).toHaveTextContent(
    'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html'
  )
  expect(detail).toHaveTextContent('2')
})

test('clicking the button twice calls event handler twice', async () => {
  const eventUser = userEvent.setup()
  const button = component.getByText('like')
  await eventUser.click(button)
  await eventUser.click(button)
  expect(updateBlog.mock.calls).toHaveLength(2)
})
