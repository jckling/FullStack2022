import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const blog = {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
  }

  const createBlog = jest.fn()

  const component = render(<BlogForm createBlog={createBlog} />)

  const title = component.container.querySelector('input[name=title]')
  expect(title).not.toBeNull()

  const author = component.container.querySelector('input[name=author]')
  expect(author).not.toBeNull()

  const url = component.container.querySelector('input[name=url]')
  expect(url).not.toBeNull()

  const eventUser = userEvent.setup()
  await eventUser.type(title, blog.title)
  await eventUser.type(author, blog.author)
  await eventUser.type(url, blog.url)

  const button = component.getByText('create')
  await eventUser.click(button)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual(blog)
})