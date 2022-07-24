import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice ({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    initialize(state, action) {
      return state.sort((a, b) => b.votes - a.votes)
    },
    voteOf(state, action) {
      const votedAnecdote = action.payload
      const newState = state.map(anecdote =>
        anecdote.id !== votedAnecdote.id ? anecdote : votedAnecdote
      )
      return newState.sort((a, b) => b.votes - a.votes)
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
    dispatch(initialize(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const voteAnecdote = anecdote => {
  return async dispatch => {
    const votedAnecdote = await anecdoteService.update(anecdote.id, {
      ...anecdote,
      votes: anecdote.votes + 1
    })
    dispatch(voteOf(votedAnecdote))
  }
}

export const { initialize, voteOf, appendAnecdote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer