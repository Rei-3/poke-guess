import React from 'react'
import { Link, Route, Routes } from 'react-router-dom'
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

            <footer className="bg-gradient-to-r from-blue-700 to-purple-700 text-white py-6 text-center flex gap-4 justify-center items-center">
              SKIBIDI!   <img
          src="https://api.visitorbadge.io/api/visitors?path=pokemon-guess-v1.vercel.app&label=VISITORS&countColor=%23263759"
          alt="Visitor Count"
        />
          </footer>
        </div>
      </>
    )
  }
}

export default App
