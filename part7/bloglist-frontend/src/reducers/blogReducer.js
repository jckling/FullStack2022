import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    initialize(state, action) {
      return state.sort((a, b) => b.likes - a.likes)
    },
    voteOf(state, action) {
      const votedBlog = action.payload
      const newState = state.map((blog) =>
        blog.id !== votedBlog.id ? blog : votedBlog
      )
      return newState.sort((a, b) => b.likes - a.likes)
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    setBlogs(state, action) {
      return action.payload
    },
    removeOf(state, action) {
      const removedBlog = action.payload
      const newState = state.filter((blog) => blog.id !== removedBlog.id)
      return newState.sort((a, b) => b.likes - a.likes)
    },
  },
})

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
    dispatch(initialize(blogs))
  }
}

export const createBlog = (content) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(content)
    dispatch(appendBlog(newBlog))
  }
}

export const removeBlog = (content) => {
  return async (dispatch) => {
    await blogService.remove(content)
    dispatch(removeOf(content))
  }
}

export const voteBlog = (blog) => {
  return async (dispatch) => {
    const votedBlog = await blogService.update({
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id,
    })
    dispatch(voteOf(votedBlog))
  }
}

export const { initialize, voteOf, appendBlog, setBlogs, removeOf } =
  blogSlice.actions
export default blogSlice.reducer
