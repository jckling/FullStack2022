import React, { useState, useEffect } from 'react'
import axios from 'axios' 

const Country = ({country}) => {
  if (country) {
    return (
      <div>
        <h1>{country.name.common}</h1>
        <p>capital {country.capital}</p>
        <p>population {country.population}</p>
        <h2>Spoken languages</h2>
        <ul>
          {Object.values(country.languages).map(language => <li key={language}>{language}</li>)}
        </ul>
        <img src={country.flags.png} alt={country.name.common}/>
        <Weather country={country} />
      </div>
    )
  }
}

const Weather = ({country}) => {
  const api_key = process.env.REACT_APP_API_KEY
  const [weather, setWeather] = useState(null)
  const [lat, lon] = country.latlng

  useEffect(() => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`)
      .then(response => {
        console.log('promise fulfilled')
        setWeather(response.data)
      })
      .catch(error => console.log(`Error: ${error}`))
  }, [lat, lon, api_key])
  
  if (weather !== null) {
    return (
      <div>
        <h2>Weather in {country.name.common}</h2>
        <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather[0].main}/>
        {weather.weather[0].main}
        <p><b>temperature:</b> {weather.main.temp} Celcius</p>
        <p><b>wind:</b> {weather.wind.speed} mph</p>
      </div>
    )
  }
}

const App = () => {
  const [name, setName] = useState('')
  const [countries, setCountries] = useState([])
  const [showCountry, setCountry] = useState('')

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setName(event.target.value.toLowerCase())
    setCountry('')
  }

  const handleShowCountry = (country) => setCountry(country)

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
    if (filterCountries.length > 1)   return (
      <div>
        {filterCountries.map(country => (
            <div key={country.name.common}>
              {country.name.common} <button onClick={() => {handleShowCountry(country)} }>show</button>
            </div>
          )
        )}
        <Country country={showCountry} />
      </div>
    )
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
