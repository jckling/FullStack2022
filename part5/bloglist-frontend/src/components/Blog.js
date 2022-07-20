import { useState } from 'react'

const Blog = ({ blog, updateBlog, removeBlog, user }) => {
  const [visible, setVisible] = useState(false)

  const showWhenVisible = { display: visible ? '' : 'none' }
  const showRemove = { display: blog.user.username === user.username ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const addLike = (event) => {
    event.preventDefault()
    const blogObject = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id
    }

    updateBlog(blogObject)
  }

  const remove = (event) => {
    event.preventDefault()
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      removeBlog(blog)
    }
  }

  return (
    <div style={blogStyle}>
      <div className="blog">
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>{ visible ? 'hide' : 'view'}</button>
      </div>
      <div className="detail" style={showWhenVisible}>
        <p>{blog.url}</p>
        <p>{blog.likes}<button onClick={addLike}>like</button></p>
        <p>{blog.user.name}</p>
        <button style={showRemove} onClick={remove}>remove</button>
      </div>

    </div>
  )
}

export default Blog