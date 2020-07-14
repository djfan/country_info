import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios'




const App = () => {
  const [search, setSearch] = useState('')
  const [allResult, setAllResult] = useState('')
  const [result, setResult] = useState('')
  const [weather, setWeather] = useState('')
  const [weatherImg, setWeatherImg] = useState('')
  
  const downloadAllResult = () => {
    axios.get("https://restcountries.eu/rest/v2/all")
         .then(response => {
          //  console.log(response.data.map(country => (country['name'].toLowerCase())))
           setAllResult(response.data)
         })
  }

  useEffect(downloadAllResult, [])

  
  const api_key = process.env.REACT_APP_API_KEY
  const getWeather = (city) => {
    let api_call = `http://api.weatherstack.com/current?access_key=${api_key}&query=${city}`
    console.log('apicall', api_call)
    axios.get(encodeURI(api_call))
        .then(response => {
          console.log(response.data)
          console.log(response.data['current']["weather_descriptions"][0])
          setWeather(response.data['current']["weather_descriptions"][0])
          setWeatherImg(response.data['current']['weather_icons'][0])
          }
        )
  }

  const handleSearchChange = (event) => {
    console.log('search change', event.target.value)
    setSearch(event.target.value.toLowerCase())
    let curSearch = event.target.value.toLowerCase()
    let remainingResult = allResult.filter(country => 
      (country['name'].toLowerCase().startsWith(curSearch)))
    setResult(remainingResult)
    if (remainingResult.length === 1) {
      getWeather(remainingResult[0].capital)
    }
  }

  // const handleSearchSubmit = (event) => {
  //   event.preventDefault()
  //   const remainingResult = allResult.filter(country => 
  //     (country['name'].toLowerCase().startsWith(search)))
  //   console.log('from submit', search, remainingResult)
  // }
  

  const handleShowButton = (item) => {
    setSearch(item.toLowerCase())
    setResult(allResult.filter(country => 
      (country['name'].toLowerCase().startsWith(item.toLowerCase()))))
  }

  const Board = ({text, value}) => {
    return (
      <div>
        <p>{text}{value}</p>
      </div>

    )
  }


  const List = ({items}) => {
    if (items === '') {
      return ("Please Type Country Name!")
    }
    else if (items.length === 1) {
      return (
        <div>
          <h1>{items[0].name}</h1>
          <p>Capital: {items[0].capital}</p>
          <p>Population: {items[0].population}</p>
          <h2>Languages</h2>
          {items[0].languages.map(language => 
            (<li key={language['iso639_2']}>
              <b>{language['name']}</b>
              ({language['nativeName']})</li>)
              )
          }
          <br/>
          <img src={items[0]['flag']} alt="Flag" height='20%' width='20%'></img>
          <h2>weather_descriptions</h2>
          <p>{weather}</p>
          <img src={weatherImg} alt="Flag" height='20%' width='20%'></img>
        </div>
      )
    }
    else if (items.length > 10) {
      return ("Too many matches, specify another filter")
    }
    else {
      return (
        <div>
          {items.map(i => (<li key={i.alpha3Code}>
                            {i.name}
                            <button onClick={()=> handleShowButton(i.name)}>show</button>
                          </li>))}
          
        </div>
      )
    }
  }




  return (
    <div>
      <form>
      {/* <form onSubmit={handleSearchSubmit}> */}
        find countrieas   
        <input value={search} onChange={handleSearchChange}/>
        {/* <button type='submit'>Search</button> */}
      </form>
      <Board text={"Number of Matches:  "} value={search === ''?0:result.length}/>
      <Board value={search}/>
      <List items={result}/>
    </div>
  )
}

ReactDOM.render(
    <App />,
  document.getElementById('root')
);