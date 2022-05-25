import React, { useState } from 'react'

const Button = ({handleClick, text}) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const Display = ({value, text}) => (
  <div>
    {text} {value}
  </div>
)

const Average = ({good, neutral, bad}) => {
  const sum = good + neutral + bad
  if (sum === 0) return <div>average 0 </div>
  const avg = (good - bad) / sum
  return <div>average {avg}</div>
}

const Positive = ({good, neutral, bad}) => {
  const sum = good + neutral + bad
  if (sum === 0) return <div>positive 0 %</div>
  const pos = good / sum
  return <div>positive {pos} %</div>
}

const App = () => {
  // save clicks of each button to own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={() => setGood(good + 1)} text="good" />
      <Button handleClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button handleClick={() => setBad(bad + 1)} text="bad" />
      <h1>statistics</h1>
      <Display value={good} text="good" />
      <Display value={neutral} text="neutral" />
      <Display value={bad} text="bad" />
      <Average good={good} neutral={neutral} bad={bad} />
      <Positive good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App;
