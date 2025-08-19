import React from "react";
import Game from "../lib/theGame";
import type { PokemonData } from "../lib/pokeApi";
import CluesComponent from "../components/clues";

interface GamePageState {
  loading: boolean;
  error: string | null;
  pokemon: PokemonData | null;
  score: number;
  life: number;
  numberOfClues: number;
}

class GamePage extends React.Component<{}, GamePageState> {
  game = new Game();

  state: GamePageState = {
    loading: false,
    error: null,
    pokemon: null,
    score: 0,
    life: 0,
    numberOfClues: 0
  };

  

  async componentDidMount() {
    try {
      this.setState({ loading: true, error: null });
      await this.game.startGame();
      this.setState({
        loading: false,
        score: this.game.getScore(),
        life: this.game.getLife(),

        pokemon: this.game.getCurrentPokemon(),
      });
      console.log(this.game.getCurrentPokemon());
    } catch (error) {
      this.setState({
        loading: false,
        error: error instanceof Error ? error.message : "Failed to start game",
      });
    }
  }
  
  componentDidUpdate() {
    if (this.game.getGameState() === "game_over") {
      this.setState({
        loading: false,
        error: "Game Over! Please restart the game.",
        pokemon: null,
      });
    }
  }

  dataFromChild = (data: number) => {
    this.setState({ numberOfClues : data });
  }

  handleGuess (name: string){
    this.game.guessPokemon(name);
    this.setState({
      score: this.game.getScore() + this.state.numberOfClues,
      life: this.game.getLife(),
      pokemon: this.game.getCurrentPokemon(),
    });
  }
  
  render() {
    const { loading, error, pokemon, score, life } = this.state;

    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 text-center p-4">
        <h1 className="text-4xl font-bold mb-4">Pokémon Game</h1>
        <p className="text-lg mb-4">Score: {score} | Life: {life}</p>
        <input
          type="text"
          placeholder="Guess the Pokémon"
          className="border p-2 rounded mb-4"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              this.handleGuess((e.target as HTMLInputElement).value);
            }
          }}
        />
        {loading && <p>Loading game...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        {pokemon && (
          <div className="mt-4">
            <audio src="src/assets/sound/whosthatpokemon.mp3" autoPlay />

           
            <img
              src={pokemon.picture}
              alt= "No Cheating"
              className="w-3xs mx-auto brightness-0"
            />
            {/* Clues */}
             {/* <h2 className="text-2xl font-semibold">{pokemon.name}</h2> */}
            <CluesComponent pokemon={pokemon}
                sendNumberOfClues={this.dataFromChild}
            />

            
          </div>
        )}
      </div>
    );
  }
}
export default GamePage;
