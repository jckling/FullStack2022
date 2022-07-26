import React from 'react'
import { connect } from 'react-redux'
import { createBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'

const BlogForm = (props) => {
  const addBlog = async (event) => {
    event.preventDefault()
    const title = event.target.title.value
    const author = event.target.author.value
    const url = event.target.url.value
    props.createBlog({
      title: title,
      author: author,
      url: url,
    })
    props.setNotification(
      `A new blog "${title}" by ${author} added.`,
      'success',
      5
    )
  }

  return (
    <form onSubmit={addBlog}>
      <div>
        title:
        <input name="title" />
      </div>
      <div>
        author:
        <input name="author" />
      </div>
      <div>
        url:
        <input name="url" />
      </div>
      <button type="submit">create</button>
    </form>
  )
}

const mapDispatchToProps = {
  createBlog,
  setNotification,
}

export default connect(null, mapDispatchToProps)(BlogForm)
