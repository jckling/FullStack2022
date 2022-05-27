import React, { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')
  const [id, setId] = useState(0)
  const [message, setMessage] = useState(null)
  const [type, setType] = useState("success")

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
        setId(initialPersons.length + 1)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    if (persons.some(person => newName === person.name)) {
      const person = persons.find(p => p.name === newName)
      if (person.number === newNumber) window.alert(`${newName} is already added to phonebook`)
      else if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const changedPerson = { ...person, number: newNumber }
        
        personService
          .update(person.id, changedPerson)
          .then(returnPerson => {
            setPersons(persons.map(p => p.id !== person.id ? p : returnPerson))
            setNewName('')
            setNewNumber('')
            setMessage(`Updated ${newName}`)
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          })
          .catch(error => {
          console.log(`Error: ${error}`)
          setPersons(persons.filter(p => p.id !== person.id))
            setMessage(`Information of ${newName} has already been removed from server`)
            setType("error")
            setTimeout(() => {
              setMessage(null)
              setType("success")
            }, 8000)
          })
      }
    }
    else {
      const personObject = {
        name: newName,
        number: newNumber,
        id: id,
      }

      personService
        .create(personObject)
        .then(returnPerson => {
          setPersons(persons.concat(returnPerson))
          setNewName('')
          setNewNumber('')
          setId(id + 1)
          setMessage(`Added ${newName}`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
    }
  }

  const delPerson = (person) => {
    if (window.confirm(`Delete ${person.name} ?`)) {
      personService
        .remove(person.id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== person.id))
        })
        .catch(error => {
          console.log(`Error: ${error}`)
          setPersons(persons.filter(p => p.id !== person.id))
          setMessage(`Information of ${newName} has already been removed from server`)
          setType("error")
          setTimeout(() => {
            setMessage(null)
            setType("success")
          }, 8000)
        })
    }
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterNameChange = (event) => {
    console.log(event.target.value)
    setFilterName(event.target.value.toLowerCase())
  }

  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(filterName))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} type={type}/>
      <Filter filterName={filterName} handleFilterNameChange={handleFilterNameChange} />
      <h3>Add a new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName} handleNameChange={handleNameChange}
        newNumber={newNumber} handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons persons={personsToShow} delPerson={delPerson}/>
    </div>
  )
}

export default App
