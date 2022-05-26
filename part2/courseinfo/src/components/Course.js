import React from 'react'

const Header = ({name}) => <h2>{name}</h2>

const Content = ({part}) => <p>{part.name} {part.exercises}</p>

const Total = ({parts}) => {
  const result = parts.reduce((prev, curr) => prev = prev + curr.exercises, 0)
  return <p><b> total of {result} exercises</b></p>
}

const Course = ({course}) => {
  return (
    <div>
      <Header name={course.name} />
      {course.parts.map(part => 
        <Content key={part.id} part={part} />
      )}
      <Total parts={course.parts} />
    </div>
  )
}

export default Course
