import React from 'react'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { voteBlog, removeBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'

const Blog = ({ blog, like, remove }) => {
  const [visible, setVisible] = useState(false)
  const user = useSelector(state => state.user)

  const showWhenVisible = { display: visible ? '' : 'none' }
  const showRemove = {
    display: blog.user.username === user.username ? '' : 'none',
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div className="blog-container" style={blogStyle}>
      <div className="blog">
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>
      <div className="detail" style={showWhenVisible}>
        <p>{blog.url}</p>
        <p>
          {blog.likes}
          <button onClick={like}>like</button>
        </p>
        <p>{blog.user.name}</p>
        <button style={showRemove} onClick={remove}>
          remove
        </button>
      </div>
    </div>
  )
}

const BlogList = () => {
  const blogs = useSelector(state => state.blogs)
  const dispatch = useDispatch()

  const like = (blog) => {
    dispatch(voteBlog(blog))
    dispatch(
      setNotification(`Like ${blog.title} by ${blog.author}.`, 'success', 5)
    )
  }

  const remove = (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      dispatch(removeBlog(blog))
      dispatch(
        setNotification(`Remove ${blog.title} by ${blog.author}.`, 'success', 5)
      )
    }
  }

  return (
    <div>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          like={() => like(blog)}
          remove={() => remove(blog)}
        />
      ))}
    </div>
  )
}

export default BlogList
