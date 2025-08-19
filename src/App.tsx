import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/home'
import GamePage from './pages/game'
import Pokedex from './pages/pokedex'

class App extends React.Component {
  render() {
    return (
      <>
      
        <div className='min-h-screen bg-gray-100'>

            <Routes>

              <Route path="/" element={<Home />} />
              <Route path="/game" element={<GamePage/>} />
              <Route path="/pokedex" element={<Pokedex />} />
            
            </Routes>

            <footer>
              Made by Assookkaa
            </footer>
        </div>
      </>
    )
  }
}

export default App
