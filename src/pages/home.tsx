import React from "react";
import { Link } from "react-router-dom";

class Home extends React.Component {
  componentDidMount() {
    // This is where you can add any initialization logic if needed
  }

  render() {
    const lastScore = localStorage.getItem("lastScore") || "0";

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-yellow-500 to-red-500 flex flex-col justify-center items-center p-4 relative overflow-hidden">
        {/* Floating Pokéball Decorations */}
        <div className="absolute top-10 left-10 w-16 h-16 bg-red-500/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-12 h-12 bg-yellow-400/20 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-1/3 right-10 w-8 h-8 bg-blue-400/20 rounded-full animate-ping delay-700"></div>
        <div className="absolute bottom-1/3 left-20 w-10 h-10 bg-green-400/20 rounded-full animate-pulse delay-500"></div>

        {/* Main Content */}
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          {/* Animated Title */}
          <div className="mb-12 space-y-4">
            <h1 className="font-pokemon text-4xl sm:text-5xl md:text-6xl pokemon-logo animate-bounce text-white drop-shadow-2xl">
              Who's that
            </h1>
            <h1 className="font-pokemon text-7xl sm:text-8xl md:text-9xl pokemon-logo animate-float bg-gradient-to-r from-yellow-300 via-red-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
              Pokémon?
            </h1>
          </div>

          {/* Last Score Display */}
          {lastScore !== "0" && (
            <div className="mb-8 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/20 animate-fadeIn">
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl">🏆</span>
                <div>
                  <div className="text-sm text-gray-600 font-medium">Best Score</div>
                  <div className="text-2xl font-bold text-yellow-600">{lastScore}</div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/game" className="w-full sm:w-auto">
              <button className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-xl hover:shadow-2xl border-2 border-green-400">
                <div className="flex items-center justify-center gap-3">
                  <span className="text-xl group-hover:animate-spin">⚡</span>
                  <span>Start Game</span>
                </div>
              </button>
            </Link>
            
            <Link to="/pokedex" className="w-full sm:w-auto">
              <button className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-xl hover:shadow-2xl border-2 border-red-400">
                <div className="flex items-center justify-center gap-3">
                  <span className="text-xl group-hover:animate-bounce">📖</span>
                  <span>Pokédex</span>
                </div>
              </button>
            </Link>
          </div>

          {/* Subtitle */}
          <p className="mt-8 text-white/80 text-lg font-medium">
            Test your Pokémon knowledge and become a master trainer!
          </p>
        </div>

        {/* Bottom Wave Effect */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>
    );
  }
}

export default Home;