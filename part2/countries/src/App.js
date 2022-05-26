import React, { useState, useEffect } from 'react'
import axios from 'axios' 

const Country = ({country}) => {
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>capital {country.capital}</p>
      <p>population {country.population}</p>
      <h2>languages</h2>
      <ul>
        {Object.keys(country.languages).map(key => <li key={key}>{country.languages[key]}</li>)}
      </ul>
      <img src={country.flags.png} />
    </div>
  )
}

const App = () => {
  const [name, setName] = useState('')
  const [countries, setCountries] = useState([])

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setName(event.target.value.toLowerCase())
  }

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        console.log('promise fulfilled')
        setCountries(response.data)
      })
  }, [])

  const countriesToShow = () => {
    if (name === '') return
    const filterCountries = countries.filter(country => country.name.common.toLowerCase().includes(name))
    if (filterCountries.length > 10)  return <p>Too many matches, specify another filter</p>
    if (filterCountries.length > 1)   return filterCountries.map(country => <p key={country.name.common}>{country.name.common}</p>)
    if (filterCountries.length === 1) return <Country country={filterCountries[0]} />
  }

  return (
    <div>
      <div>
        find countries: <input 
        value={name}
        onChange={handleNameChange}
        />
      </div>
      <div>
        {countriesToShow()}
      </div>
    </div>
  )
}

export default App
