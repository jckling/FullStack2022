import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice ({
  name: 'notification',
  initialState: '',
  reducers: {
    setMessage(state, action) {
      const message = action.payload
      return message
    },
    clearMessage(state, action) {
      return ''
    }
  }
})

export const setNotification = (content, timeout) => {
  return dispatch => {
    dispatch(setMessage(content))
    setTimeout(() => {
      dispatch(clearMessage())
    }, timeout * 1000)
  }
}

export const { setMessage, clearMessage } = notificationSlice.actions
export default notificationSlice.reducer