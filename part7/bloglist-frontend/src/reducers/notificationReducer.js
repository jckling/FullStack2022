import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  content: '',
  className: '',
  timeoutId: null,
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState: initialState,
  reducers: {
    setMessage(state, action) {
      const message = action.payload
      return message
    },
    clearMessage(state, action) {
      return initialState
    },
  },
})

export const setNotification = (content, className, timeout) => {
  return (dispatch, getState) => {
    const currectTimeoutId = getState().notification.timeoutId
    clearTimeout(currectTimeoutId)

    const timeoutId = setTimeout(() => {
      dispatch(clearMessage())
    }, timeout * 1000)

    dispatch(setMessage({ content, className, timeoutId }))
  }
}

export const { setMessage, clearMessage } = notificationSlice.actions
export default notificationSlice.reducer
