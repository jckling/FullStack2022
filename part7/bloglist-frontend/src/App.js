import { useEffect, useRef } from 'react'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs, voteBlog, addComment } from './reducers/blogReducer'
import { initializeUser, login, logout } from './reducers/userReducer'
import { setNotification } from './reducers/notificationReducer'
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

const _ = require('lodash')

const Home = () => {
  const user = useSelector(state => state.user)
  const blogs = useSelector(state => state.blogs)

  const filteredBlogs = blogs.filter(blog => blog.user.username === user.username)
  return <Blogs blogs={filteredBlogs} />
}

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

const Blog = ({ blogs }) => {
  const match = useMatch('/blogs/:id')
  const blog = match
    ? blogs.find(blog => blog.id === match.params.id)
    : null

  if(blog === undefined || blog === null) return null

  const dispatch = useDispatch()

  const like = (event) => {
    event.preventDefault()
    dispatch(voteBlog(blog))
    dispatch(setNotification(`Like ${blog.title} by ${blog.author}.`, 'success', 5))
  }

  const comment = (event) => {
    event.preventDefault()
    const comment = event.target.comment.value
    dispatch(addComment({blog, comment}))
  }

  return (
    <div>
      <h2>{blog.title}</h2>
      <div>{blog.url}</div>
      <div>
        {blog.likes} likes
        <button onClick={like}>like</button>
      </div>
      <div>added by <Link to={`/users/${blog.user.id}`}>{blog.user.username}</Link></div>
      <h3>comments</h3>
      <form onSubmit={comment}>
        <input name="comment" />
        <button type="submit">add comment</button>
      </form>
      {blog.comments.map(comment => <li key={comment}>{comment}</li>)}
    </div>
  )
}

const Blogs = ({ blogs }) => {
  if(blogs === undefined || blogs === null) return null

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

const User = ({ blogs }) => {
  const match = useMatch('/users/:id')
  const userBlogs = match
    ? blogs.filter(blog => blog.user.id === match.params.id)
    : null

  if(userBlogs === null) return null
  
  return (
    <div>
      <h2>{userBlogs[0].user.username}</h2>
      <h3>added blogs</h3>
      <ul>
        {userBlogs.map(blog => 
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </li>
        )}
      </ul>
    </div>
  )
}

const Users = ({ blogs }) => {
  const groups = _.countBy(blogs.map(blog => blog.user.id))
  const users = _.uniqBy(blogs.map(blog => blog.user), 'id')

  return (
    <div>
      <h2>Users</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
          {users.map(user => 
            <tr key={user.id}>
              <td><Link to={`/users/${user.id}`}>{user.username}</Link></td>
              <td>{groups[user.id]}</td>
            </tr>
          )}
        </tbody>
      </table>
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
        <Route path="/blogs" element={user ? <Blogs blogs={blogs} /> : <Navigate replace to="/login" />} />
        <Route path="/blogs/:id" element={user ? <Blog blogs={blogs} /> : <Navigate replace to="/login" />} />
        <Route path="/users" element={user ? <Users blogs={blogs} /> : <Navigate replace to="/login" />} />
        <Route path="/users/:id" element={user ? <User blogs={blogs} /> : <Navigate replace to="/login" />} />
        <Route path="/login" element={user ? <Navigate replace to="/" /> : <Login />} />
        <Route path="/" element={user ? <Home /> : <Navigate replace to="/login" />} />
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
