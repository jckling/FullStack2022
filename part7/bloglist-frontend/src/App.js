import { useEffect, useRef } from 'react'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs } from './reducers/blogReducer'
import { initializeUser, login, logout } from './reducers/userReducer'
import UserList from './components/UserList'
import BlogForm from './components/BlogForm'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
  useMatch
} from "react-router-dom"

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogin = async (event) => {
    event.preventDefault()
    const username = event.target.username.value
    const password = event.target.password.value
    dispatch(login(username, password))
    navigate('/')
  }

  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input name="username" />
        </div>
        <div>
          password
          <input type="password" name="password" />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

const Blog = ({ blog }) => {
  const dispatch = useDispatch()

  const like = (blog) => {
    dispatch(voteBlog(blog))
    dispatch(
      setNotification(`Like ${blog.title} by ${blog.author}.`, 'success', 5)
    )
  }

  return (
    <div>
      <h2>{blog.title}</h2>
      <div>{blog.url}</div>
      <div>added by {blog.user}</div>
      <div>
        {blog.likes} likes
        <button onClick={like}>like</button>
      </div>
      <h3>comments</h3>
    </div>
  )
}

const Blogs = ({ blogs }) => {
  const blogFormRef = useRef()

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div>
      <h2>Blogs</h2>
        <Togglable buttonLabel="create new blog" ref={blogFormRef}>
          <BlogForm />
        </Togglable>
        {blogs.map(blog => (
          <div key={blog.id} style={blogStyle}>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </div>
        ))}
    </div>
  )
}

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUser())
  }, [dispatch])

  const handleLogout = async (event) => {
    event.preventDefault()
    dispatch(logout())
  }

  const user = useSelector(state => state.user)
  const blogs = useSelector(state => state.blogs)
  const filteredBlogs = blogs.filter(blog => blog.user.username === user.username)
  const matchBlog = useMatch('/blogs/:id')
  const blog = matchBlog
    ? blogs.find(blog => blog.id === Number(matchBlog.params.id))
    : null

  const padding = {
    padding: 5
  }

  return (
    <div>
      <div>
        <Link style={padding} to="/">home</Link>
        <Link style={padding} to="/blogs">blogs</Link>
        <Link style={padding} to="/users">users</Link>
        {user
          ? <div><em>{user.name} logged in</em><button onClick={handleLogout}>logout</button></div>
          : <Link style={padding} to="/login">login</Link>
        }
        <Notification />
      </div>

      <Routes>
        <Route path="/blogs/:id" element={user ? <Blog blog={blog}/> : <Navigate replace to="/login" />} />
        <Route path="/blogs" element={user ? <Blogs blogs={blogs} /> : <Navigate replace to="/login" />} />
        <Route path="/users" element={user ? <UserList /> : <Navigate replace to="/login" />} />
        {/* <Route path="/users/:id" element={user ? <UserList /> : <Navigate replace to="/login" />} /> */}
        <Route path="/login" element={user ? <Navigate replace to="/" /> : <Login />} />
        <Route path="/" element={user ? <Blogs blogs={filteredBlogs}/> : <Navigate replace to="/login" />} />
      </Routes>
    </div>
  )
}

const AppWrapper = () => {
  return (
    <Router>
      <App />
    </Router>
  )
}

export default AppWrapper
