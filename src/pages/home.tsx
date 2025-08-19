import React from "react";
import { Link } from "react-router-dom";

class Home extends React.Component {
  componentDidMount() {
    // This is where you can add any initialization logic if needed
  }

  render() {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 text-center p-4">
        <div className="animate-pokemon-intro space-y-4 md:space-y-10">
          <h1 className="font-pokemon text-4xl sm:text-5xl md:text-6xl pokemon-logo animate-bounce">
            Who's that
          </h1>
          <h1 className="font-pokemon text-7xl sm:text-8xl md:text-9xl pokemon-logo animate-float">
            Pokémon?
          </h1>
        </div>

        <div className="space-x-4 mt-10">
          <Link to={"/game"}>
            <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full transition-all transform hover:scale-105 shadow-lg">
              Start
            </button>
          </Link>
          <button className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-full transition-all transform hover:scale-105 shadow-lg">
            <Link to={"/pokedex"}>Pokédex</Link>
          </button>
        </div>
      </div>
    );
  }
}

export default Home;
