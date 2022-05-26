import React from 'react'

const Person = ({person, delPerson}) => {
  return (
    <div>
      {person.name} {person.number} <button onClick={() => delPerson(person)}>delete</button>
    </div>
  )
}

const Persons = ({persons, delPerson}) => persons.map(person => <Person key={person.id} person={person} delPerson={delPerson}/>)

export default Persons
