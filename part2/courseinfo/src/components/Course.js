import React from 'react'

const Header = ({name}) => <h1>{name}</h1>

const Content = ({part}) => <p>{part.name} {part.exercises}</p>

const Course = ({course}) => {
  return (
    <div>
      <Header name={course.name} />
      {course.parts.map(part => 
        <Content key={part.id} part={part} />
      )}
    </div>
  )
}

export default Course
