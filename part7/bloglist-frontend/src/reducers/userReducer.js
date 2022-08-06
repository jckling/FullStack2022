import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import blogService from '../services/blogs'
import { setNotification } from '../reducers/notificationReducer'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(state, action) {
      const user = action.payload
      blogService.setToken(user.token)
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      return action.payload
    },
    clearUser(state, action) {
      blogService.setToken(null)
      window.localStorage.removeItem('loggedBlogAppUser')
      return null
    }
  }
})

export const initializeUser = () => {
  return async (dispatch) => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
    }
  }
}

export const login = (username, password) => {
  return async (dispatch) => {
    try {
      const user = await loginService.login({username, password})
      dispatch(setUser(user))
      dispatch(setNotification('logged in successfully', 'success', 5))
    } catch (exception) {
      dispatch(setNotification('wrong username or password', 'error', 5))
    }
  }
}

export const logout = () => {
  return async (dispatch) => {
    dispatch(clearUser())
    dispatch(setNotification('logged out successfully', 'success', 5))
  }
}

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer