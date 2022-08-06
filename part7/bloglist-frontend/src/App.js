import { useEffect, useRef } from 'react'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs } from './reducers/blogReducer'
import { initializeUser, login, logout } from './reducers/userReducer'
import BlogList from './components/BlogList'
import UserList from './components/UserList'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate
} from "react-router-dom"

const Home = () => {
  const blogFormRef = useRef()
  const user = useSelector(state => state.user)

  return (
    <div>
      <h2>Blog app</h2>

      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm />
      </Togglable>

      <BlogList user={user} />
    </div>
  )
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
        {/* <Route path="/blogs/:id" element={user ? <Blog blog={blog} /> : <Navigate replace to="/login" />} /> */}
        <Route path="/blogs" element={user ? <BlogList /> : <Navigate replace to="/login" />} />
        <Route path="/users" element={user ? <UserList /> : <Navigate replace to="/login" />} />
        {/* <Route path="/users/:id" element={user ? <UserList /> : <Navigate replace to="/login" />} /> */}
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
