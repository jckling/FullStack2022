import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      blogs.sort((a, b) => b.likes - a.likes)
      setBlogs(blogs)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password,
      })

      setUser(user)
      blogService.setToken(user.token)
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    setUser(null)
    window.localStorage.removeItem('loggedBlogAppUser')
    setTimeout(() => {
      setErrorMessage('log out timeout')
    }, 5000)
  }

  const addBlog = (blogObject) => {
    blogService.create(blogObject).then((returnedBlog) => {
      setBlogs(blogs.concat(returnedBlog).sort((a, b) => b.likes - a.likes))
    })

    setSuccessMessage(
      `A new blog "${blogObject.title}" by ${blogObject.author} added.`
    )
    setTimeout(() => {
      setSuccessMessage(null)
    }, 5000)
  }

  const addBlogLike = (blogObject) => {
    blogService.update(blogObject).then((returnedBlog) => {
      setBlogs(
        blogs
          .map((blog) => (blog.id !== returnedBlog.id ? blog : returnedBlog))
          .sort((a, b) => b.likes - a.likes)
      )
    })

    setSuccessMessage(`Like ${blogObject.title} by ${blogObject.author}.`)
    setTimeout(() => {
      setSuccessMessage(null)
    }, 5000)
  }

  const removeBlog = (blogObject) => {
    setBlogs(
      blogs
        .filter((blog) => blog.id !== blogObject.id)
        .sort((a, b) => b.likes - a.likes)
    )
    setSuccessMessage(`Removed ${blogObject.title} by ${blogObject.author}.`)
    setTimeout(() => {
      setSuccessMessage(null)
    }, 5000)
  }

  const loginForm = () => (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            id="username"
            type="text"
            value={username}
            name="username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            id="password"
            type="password"
            value={password}
            name="password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button id="login-button" type="submit">
          login
        </button>
      </form>
    </div>
  )

  const blogFormRef = useRef()

  if (user === null) {
    return (
      <div>
        <Notification
          message={errorMessage ? errorMessage : successMessage}
          type={errorMessage ? 'error' : 'success'}
        />
        {loginForm()}
      </div>
    )
  }
  return (
    <div>
      <h2>blogs</h2>
      <Notification
        message={errorMessage ? errorMessage : successMessage}
        type={errorMessage ? 'error' : 'success'}
      />
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>
      <h2>create new</h2>

      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>

      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          updateBlog={addBlogLike}
          removeBlog={removeBlog}
          user={user}
        />
      ))}
    </div>
  )
}

export default App
