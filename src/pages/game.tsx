import React from "react";
import Game from "../lib/theGame";
import type { PokemonData } from "../lib/pokeApi";
import CluesComponent from "../components/clues";
import { Link } from "react-router-dom";

interface GamePageProps {
  navigate?: (path: string) => void;
}

interface GamePageState {
  loading: boolean;
  guessLoading: boolean;
  error: string | null;
  pokemon: PokemonData | null;
  score: number;
  life: number;
  numberOfClues: number;
  timePerGuess: number;
  currentTimeLeft: number;
  timerActive: boolean;
  lastGuessResult: "correct" | "wrong" | null;
  guessFeedback: string;
  buttonDisabled: boolean; // New state for temporary disable
}

class GamePage extends React.Component<GamePageProps, GamePageState> {
  inputRef: React.RefObject<HTMLInputElement | null>;
  game = new Game();
  private timerInterval: NodeJS.Timeout | null = null;

  state: GamePageState = {
    loading: false,
    guessLoading: false,
    error: null,
    pokemon: null,
    score: 0,
    life: 0,
    numberOfClues: 0,
    timePerGuess: 0,
    currentTimeLeft: 0,
    timerActive: false,
    lastGuessResult: null,
    guessFeedback: "",
    buttonDisabled: false, // Initialize new state
  };

  constructor(props: GamePageProps) {
    super(props);
    this.inputRef = React.createRef();
    this.game.setTimerUpdateCallback(this.handleTimerUpdate.bind(this));
  }

  handleTimerUpdate = (timeLeft: number) => {
    this.setState({ currentTimeLeft: timeLeft });

    if (timeLeft <= 0 && this.state.life > 0) {
      this.handleTimeUp();
    }
  };

  handleTimeUp = () => {
    console.log("Time's up!");

    const newLife = Math.max(0, this.state.life - 1);
    this.setState({
      life: newLife,
      lastGuessResult: "wrong",
      guessFeedback: "⏰ Time's up! Life lost!",
    });

    if (newLife <= 0) {
      this.endGame();
    } else {
      // Show feedback for 1.5 seconds before loading next Pokémon
      setTimeout(() => {
        this.moveToNextPokemon();
      }, 1500);
    }
  };

  startTimer = () => {
    this.stopTimer();
    this.setState({ timerActive: true });
    this.timerInterval = setInterval(() => {}, 1000);
  };

  stopTimer = () => {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.setState({ timerActive: false });
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
        timePerGuess: this.game.getTimePerGuess(),
        currentTimeLeft: this.game.getTimePerGuess(),
      });
      this.startTimer();
    } catch (error) {
      this.setState({
        loading: false,
        error: error instanceof Error ? error.message : "Failed to start game",
      });
    }
  }

  componentDidUpdate(
    _prevProps: Readonly<GamePageProps>,
    prevState: Readonly<GamePageState>
  ) {
    if (this.state.life === 0 && prevState.life > 0) {
      localStorage.setItem("lastScore", this.state.score.toString());
      this.stopTimer();
      if (this.props.navigate) {
        setTimeout(() => {
          this.props.navigate!("/");
        }, 3000);
      }
    }
  }

  componentWillUnmount() {
    this.stopTimer();
    this.game.cleanup();
  }

  dataFromChild = (data: number) => {
    this.setState({ numberOfClues: data });
  };

  async moveToNextPokemon() {
    try {
      this.setState({
        guessLoading: true,
        lastGuessResult: null,
        guessFeedback: "",
      });

      await this.game.stillPlaying();

      this.setState({
        guessLoading: false,
        pokemon: this.game.getCurrentPokemon(),
        score: this.game.getScore(),
        life: this.game.getLife(),
        currentTimeLeft: this.game.getTimePerGuess(),
        lastGuessResult: null,
        guessFeedback: "",
      });

      this.startTimer();
    } catch (error) {
      this.setState({
        guessLoading: false,
        error: error instanceof Error ? error.message : "Failed to load next Pokémon",
      });
    }
  }

  async handleGuess(name: string) {
    const { pokemon, numberOfClues } = this.state;
    const isCorrect =
      pokemon && name.trim().toLowerCase() === pokemon.name.toLowerCase();

    this.stopTimer();
    this.inputRef.current!.disabled = true; // Disable input while processing

    if (isCorrect) {
      const clueBonus = numberOfClues > 0 ? numberOfClues : 1;
      const totalBonus = clueBonus;

      this.game.setScore(this.game.getScore() + totalBonus);

      this.setState({
        lastGuessResult: "correct",
        guessFeedback: `🎉 Correct! +${totalBonus} points! Loading next Pokémon...`,
      });

      // Show success message for 1.5 seconds before loading next
      setTimeout(() => {
        this.moveToNextPokemon().then(() => {
          if (this.inputRef.current) {
            this.inputRef.current.value = "";
            this.inputRef.current.disabled = false;
            this.inputRef.current.focus();
          }
        });
      }, 1500);
    } else {
      this.game.guessPokemon(name);
      const newLife = this.game.getLife();

      this.setState({
        life: newLife,
        lastGuessResult: "wrong",
        guessFeedback: "❌ Wrong guess! Try again...",
      });

      if (newLife <= 0) {
        this.endGame();
      } else {
        // Re-enable input after short delay for wrong guess
        setTimeout(() => {
          this.setState({
            lastGuessResult: null,
            guessFeedback: "",
          });
          if (this.inputRef.current) {
            this.inputRef.current.disabled = false;
            this.inputRef.current.focus();
          }
          this.startTimer();
        }, 1500);
      }
    }
  }

  endGame() {
    this.stopTimer();
    localStorage.setItem("lastScore", this.state.score.toString());
    this.setState({
      guessFeedback: "💀 Game Over! Final score saved.",
    });
  }

  getTimerColor() {
    const { currentTimeLeft, timePerGuess } = this.state;
    const percentage = (currentTimeLeft / timePerGuess) * 100;
    if (percentage > 50) return "from-green-400 to-green-500";
    if (percentage > 25) return "from-yellow-400 to-yellow-500";
    return "from-red-400 to-red-500";
  }

  getProgressWidth() {
    const { currentTimeLeft, timePerGuess } = this.state;
    return (currentTimeLeft / timePerGuess) * 100;
  }

  formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  render() {
    const {
      loading,
      guessLoading,
      error,
      pokemon,
      score,
      life,
      currentTimeLeft,
      lastGuessResult,
      guessFeedback,
    } = this.state;

    const progressWidth = this.getProgressWidth();
    const timerColor = this.getTimerColor();

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col items-center p-4 sm:p-6 relative">
        {/* Background Audio */}
        <audio src="./sound/whosthatpokemon.mp3" autoPlay />

        {/* Overlay for loading states */}
        {(loading || guessLoading) && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-8 max-w-sm mx-4 animate-pulse">
              <div className="flex flex-col items-center gap-4">
                {/* Pokémon Loading Animation */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 animate-spin">
                    <div className="absolute inset-4 bg-white rounded-full"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-red-400 rounded-full animate-bounce"></div>
                  </div>
                </div>

                {/* Loading Text */}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {guessLoading ? "Loading next Pokémon..." : "Starting game..."}
                  </h3>
                  <p className="text-gray-600">
                    {guessLoading ? "Searching the Pokémon world..." : "Initializing Pokédex..."}
                  </p>
                </div>

                {/* Loading Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse w-3/4"></div>
                </div>

                {/* Loading Dots */}
                <div className="flex gap-2">
                  {[1, 2, 3].map((dot) => (
                    <div
                      key={dot}
                      className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-bounce"
                      style={{ animationDelay: `${dot * 0.2}s` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Score and Life Widget */}
        <div className="fixed top-4 left-4 right-4 z-10 flex justify-center">
          <div className="flex gap-3">
            {/* Score */}
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-white/20">
              <div className="flex items-center gap-2">
                <span className="text-yellow-500">🏆</span>
                <span className="font-bold text-gray-800">{score}</span>
              </div>
            </div>

            {/* Timer */}
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-white/20">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">⏰</span>
                <span className="font-bold text-gray-800 font-mono">
                  {this.formatTime(currentTimeLeft)}
                </span>
              </div>
              <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full bg-gradient-to-r ${timerColor} transition-all duration-1000 ease-linear`}
                  style={{ width: `${progressWidth}%` }}
                />
              </div>
            </div>

            {/* Life */}
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-white/20">
              <div className="flex items-center gap-1">
                {Array.from({ length: life }, () => "❤️")}
                {Array.from({ length: 3 - life }, () => "🤍")}
              </div>
            </div>
          </div>
        </div>

        {/* Time Warning */}
        {currentTimeLeft <= 10 && currentTimeLeft > 0 && life > 0 && !guessLoading && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-10 animate-pulse">
            <div className="bg-red-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
              <span>⚠️</span>
              <span className="font-bold">Hurry! {currentTimeLeft}s left!</span>
            </div>
          </div>
        )}

        {/* Guess Feedback Message */}
        {guessFeedback && !guessLoading && (
          <div
            className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-20 animate-fade-in ${
              lastGuessResult === "correct"
                ? "bg-green-500 text-white"
                : lastGuessResult === "wrong"
                ? "bg-red-500 text-white"
                : "bg-blue-500 text-white"
            } px-6 py-3 rounded-full shadow-lg font-bold text-center`}
          >
            {guessFeedback}
          </div>
        )}

        {/* Header */}
        <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl p-6 mb-4 mt-20">
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-4">
            Who's That Pokémon?
          </h1>
        </div>

        {/* Status Messages */}
        {!loading && life === 0 && (
          <div className="w-full max-w-md mx-auto rounded-xl shadow-lg mb-4 text-center">
            <div className="w-full max-w-md mx-auto bg-red-500 text-white px-4 py-3 rounded-xl shadow-lg mb-4 text-center">
              <div className="font-bold">Game Over!</div>
              <div>Final Score: {score}</div>
            </div>
            <div className="w-full max-w-md mx-auto bg-green-500 hover:bg-green-600 px-4 py-3 rounded-xl shadow-lg mb-4 text-center text-white transition-colors duration-300">
              <Link to="/">
                <div className="font-bold">Return to Home</div>
              </Link>
            </div>
          </div>
        )}

        {error && life > 0 && (
          <div className="w-full max-w-md mx-auto bg-orange-500 text-white px-4 py-3 rounded-xl shadow-lg mb-4 text-center">
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {/* Pokémon Card */}
        {pokemon && !guessLoading && (
          <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Pokémon Image */}
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-8 text-center relative">
              <div className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold">
                ?
              </div>
              <img
                src={pokemon.picture}
                alt="Mystery Pokémon"
                className={`w-40 h-40 sm:w-48 sm:h-48 mx-auto transition-all duration-500 ${
                  lastGuessResult === "correct" ? "brightness-100 scale-110" : "brightness-0"
                }`}
              />
              <div className="mt-4 text-gray-600 text-sm">
                {lastGuessResult === "correct"
                  ? `It's ${pokemon.name}!`
                  : "Tap the silhouette for a hint!"}
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
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter Pokémon name..."
                className="flex-1 px-3 py-3 text-base border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-center disabled:bg-gray-100 disabled:cursor-not-allowed"
                ref={this.inputRef}
                disabled={life === 0 || guessLoading}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && life > 0 && !guessLoading) {
                    this.handleGuess((e.target as HTMLInputElement).value);
                  }
                }}
              />
              <button
                onClick={() => {
                  if (this.inputRef.current && life > 0 && !guessLoading && !this.state.buttonDisabled) {
                    this.setState({ buttonDisabled: true }); // Temporarily disable the button
                    this.handleGuess(this.inputRef.current.value);
                    setTimeout(() => {
                      this.setState({ buttonDisabled: false }); // Re-enable the button after 3 seconds
                    }, 3000);
                  }
                }}
                disabled={life === 0 || guessLoading || this.state.buttonDisabled} // Include the new state in the disabled condition
                className={`min-w-[60px] px-3 py-3 rounded-xl font-bold text-white transition-all duration-300 transform ${
                  life === 0 || guessLoading || this.state.buttonDisabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 active:scale-95 shadow-lg hover:shadow-xl"
                }`}
              >
                {guessLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                ) : (
                  <>
                    <span className="hidden xs:inline text-sm">Submit</span>
                    <span className="xs:hidden text-lg">✓</span>
                  </>
                )}
              </button>
            </div>

            {/* Helper text */}
            <div className="mt-2 text-center text-xs text-gray-500">
              {guessLoading
                ? "Loading next Pokémon..."
                : life > 0
                ? "Press Enter or tap Submit to guess"
                : "Game Over"}
            </div>
          </div>
        </div>

        {/* Add CSS animations */}
        <style>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translate(-50%, -20px); }
            to { opacity: 1; transform: translate(-50%, 0); }
          }
          .animate-fade-in {
            animation: fade-in 0.3s ease-out;
          }
        `}</style>
      </div>
    );
  }
}

export default GamePage;