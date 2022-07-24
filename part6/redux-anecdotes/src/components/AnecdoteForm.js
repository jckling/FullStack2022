import React from 'react'
import { connect } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteForm = (props) => {
  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    props.createAnecdote(content)
  }

  return (
    <form onSubmit={addAnecdote}>
      <div><input type="text" name="anecdote"/></div>
      <button type="submit">create</button>
    </form>
  )
}

const mapDispatchToProps = {
  createAnecdote
}

export default connect(null, mapDispatchToProps)(AnecdoteForm)