import React from "react";
import Game from "../lib/theGame";
import type { PokemonData } from "../lib/pokeApi";
import CluesComponent from "../components/clues";

interface GamePageProps {
  navigate?: (path: string) => void;
}

interface GamePageState {
  loading: boolean;
  error: string | null;
  pokemon: PokemonData | null;
  score: number;
  life: number;
  numberOfClues: number;
}

class GamePage extends React.Component<GamePageProps, GamePageState> {
  inputRef: React.RefObject<HTMLInputElement | null>;
  game = new Game();

  state: GamePageState = {
    loading: false,
    error: null,
    pokemon: null,
    score: 0,
    life: 0,
    numberOfClues: 0,
  };

  constructor(props: GamePageProps) {
    super(props);
    this.inputRef = React.createRef();
  }

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
    } catch (error) {
      this.setState({
        loading: false,
        error: error instanceof Error ? error.message : "Failed to start game",
      });
    }
  }

  componentDidUpdate(_prevProps: Readonly<GamePageProps>, prevState: Readonly<GamePageState>) {
    // Save score and navigate when life reaches 0
    if (this.state.life === 0 && prevState.life > 0) {
      localStorage.setItem("lastScore", this.state.score.toString());
      if (this.props.navigate) {
        this.props.navigate("/home");
      }
    }
  }

  dataFromChild = (data: number) => {
    console.log(`Clues remaining: ${data}`);
    this.setState({ numberOfClues: data });
  };

  async handleGuess(name: string) {
    const { pokemon, numberOfClues } = this.state;
    const isCorrect =
      pokemon && name.trim().toLowerCase() === pokemon.name.toLowerCase();
    
    this.game.guessPokemon(name);
    
    if (isCorrect) {
      // Add points for correct guess - use remaining clues as bonus points
      const bonusPoints = numberOfClues > 0 ? numberOfClues : 1; // At least 1 point for correct guess
      this.game.setScore(this.game.getScore() + bonusPoints);
      await this.game.stillPlaying();
      
      console.log(`Correct! Added ${bonusPoints} points. Total score: ${this.game.getScore()}`);
    }
    
    this.setState({
      score: this.game.getScore(),
      life: this.game.getLife(),
      pokemon: this.game.getCurrentPokemon(),
    });
    
    if (isCorrect && this.inputRef.current) {
      this.inputRef.current.value = "";
      this.inputRef.current.focus();
    }
  }

  render() {
    const { loading, error, pokemon, score, life } = this.state;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col items-center p-4 sm:p-6">
        {/* Score and Life Widget - Fixed Position */}
        <div className="fixed top-4 left-4 right-4 z-10 flex justify-center">
          <div className="flex gap-3">
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-white/20">
              <div className="flex items-center gap-2">
                <span className="text-yellow-500">🏆</span>
                <span className="font-bold text-gray-800">{score}</span>
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-white/20">
              <div className="flex items-center gap-1">
                {Array.from({ length: life }, () => "❤️")}
                {Array.from({ length: 3 - life }, () => "🤍")}
              </div>
            </div>
          </div>
        </div>

        {/* Header - with top margin for widget */}
        <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl p-6 mb-4 mt-16">
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-4">
            Who's That Pokémon?
          </h1>
        </div>

        {/* Status Messages */}
        {loading && (
          <div className="w-full max-w-md mx-auto bg-blue-500 text-white px-4 py-3 rounded-xl shadow-lg mb-4 text-center">
            <span className="font-semibold">Loading new Pokémon...</span>
          </div>
        )}
        
        {life === 0 && (
          <div className="w-full max-w-md mx-auto bg-red-500 text-white px-4 py-3 rounded-xl shadow-lg mb-4 text-center">
            <div className="font-bold">Game Over!</div>
            <div>Final Score: {score}</div>
          </div>
        )}
        
        {error && life > 0 && (
          <div className="w-full max-w-md mx-auto bg-orange-500 text-white px-4 py-3 rounded-xl shadow-lg mb-4 text-center">
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {/* Pokémon Card */}
        {pokemon && (
          <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
            <audio src="src/assets/sound/whosthatpokemon.mp3" />
            
            {/* Pokémon Image */}
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-8 text-center relative">
              <div className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold">
                ?
              </div>
              <img
                src={pokemon.picture}
                alt="Mystery Pokémon"
                className="w-40 h-40 sm:w-48 sm:h-48 mx-auto brightness-0"
              />
              <div className="mt-4 text-gray-600 text-sm">
                Tap the silhouette for a hint!
              </div>
            </div>

            {/* Clues Section */}
            <div className="p-6 bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
                Pokédex Data
              </h3>
              <CluesComponent
                pokemon={pokemon}
                sendNumberOfClues={this.dataFromChild}
              />
            </div>
          </div>
        )}

        {/* Mobile-friendly spacing */}
        <div className="h-20"></div>

        {/* Fixed Input Bar at Bottom */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 p-4 z-20">
          <div className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="Enter Pokémon name..."
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-center"
              ref={this.inputRef}
              disabled={life === 0}
              onKeyDown={(e) => {
                if (e.key === "Enter" && life > 0) {
                  this.handleGuess((e.target as HTMLInputElement).value);
                }
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default GamePage;