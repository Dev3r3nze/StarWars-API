import './App.css'
import { useEffect, useState } from 'react'

function App () {
  let API_URL = ''
  const API_SEARCH = 'https://swapi.dev/api/people/?search='
  const API_NUM = 'https://swapi.dev/api/people/'

  const [nombre, setNombre] = useState()
  const [gender, setGender] = useState()
  const [altura, setAltura] = useState()
  const [hogar, setHogar] = useState()
  const [vehicles, setVehicles] = useState([])
  const [naves, setNaves] = useState([])

  const [num, setNum] = useState(1)
  const [customName, setCustomName] = useState('')

  useEffect(() => {
    customName === ''
      ? API_URL = `${API_NUM}${num}/?format=json`
      : API_URL = `${API_SEARCH}${customName}&format=json`

    fetch(`${API_URL}`)
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.results === undefined || resJson.results.length > 0) {
          setNombre(customName === '' ? resJson.name : resJson.results[0].name)
          setGender(customName === '' ? resJson.gender : resJson.results[0].gender)
          setAltura(customName === '' ? resJson.height : resJson.results[0].height)
          fetch(customName === '' ? `${resJson.homeworld}/?format=json` : `${resJson.results[0].homeworld}/?format=json`)
            .then((res) => res.json())
            .then((resJson) => {
              setHogar(resJson.name)
            })
          const vehiclePromises = (customName === '' ? resJson.vehicles : resJson.results[0].vehicles).map(url =>
            fetch(`${url}/?format=json`).then(res => res.json())
          )

          Promise.all(vehiclePromises).then(vehicleData =>
            setVehicles(vehicleData.map(data => data.name))
          )
          const navesPromises = (customName === '' ? resJson.starships : resJson.results[0].starships).map(url =>
            fetch(`${url}/?format=json`).then(res => res.json())
          )

          Promise.all(navesPromises).then(naveData =>
            setNaves(naveData.map(data => data.name))
          )
        } else {
          setNombre('')
          setGender('')
          setAltura('')
          setHogar('')
          setVehicles([])
          setNaves([])
        }
      })
  }, [num, customName])

  function updateNum (newNum) {
    setNum(Math.floor(newNum))
    updateCustomName('')
  }
  function updateCustomName (name) {
    name !== '' ? setCustomName(document.getElementById('searchName').value) : setCustomName('')
  }

  return (
    <div className='App'>
      <header className='App-header'>
        <h1>Star wars</h1>
        <label htmlFor='numRandom'>Busca tu personaje: </label>
        <br />
        <input type='text' id='searchName' placeholder='Luke, Anakin, Kenobi ...' />
        <button onClick={() => updateCustomName()}>Buscar</button>
        <br />
        <button onClick={() => updateNum(Math.random() * 50 + 1)}>Random</button>
        {nombre !== '' ? <h3>Tu personaje es: </h3> : <h3>Personaje no encontrado</h3>}
        {nombre && <p>Nombre: {nombre}</p>}
        {gender && <p>Genero: {gender}</p>}
        {altura && <p>Altura: {altura} cm</p>}
        {hogar && <p>Hogar: {hogar}</p>}
        {vehicles.length > 0
          ? (<p>Vehículos: {vehicles.join(', ')}</p>)
          : (nombre && <p>No tiene vehículos</p>)}
        {naves.length > 0
          ? (<p>Naves: {naves.join(', ')}</p>)
          : (nombre && <p>No tiene naves</p>)}
      </header>
    </div>
  )
}

export default App
