import React from 'react'
import { connect } from 'react-redux'
import { createBlog } from '../reducers/blogReducer'

const BlogForm = (props) => {
  const addBlog = async (event) => {
    event.preventDefault()
    const content = {
      title: event.target.title.value,
      author: event.target.author.value,
      url: event.target.url.value,
    }
    props.createBlog(content)
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
}

export default connect(null, mapDispatchToProps)(BlogForm)
