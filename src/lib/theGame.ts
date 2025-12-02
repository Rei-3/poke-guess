import PokeApi, { type PokemonData, type Clues } from "./pokeApi";

class Game {
  private gameState: string;
  private score: number;
  private currentPokemonId: number;
  private currentPokemon: PokemonData | null;
  private guessedPokemonIds: Set<number>;
  private numberOfClues: number;
  private life: number;
  private readonly totalPokemonCount: number;
  private timePerGuess: number;
  private timerInterval: NodeJS.Timeout | null;
  private currentTimeLeft: number;
  private onTimerUpdate: ((timeLeft: number) => void) | null;

  constructor() {
    this.gameState = "not_started";
    this.score = 0;
    this.currentPokemonId = 0;
    this.currentPokemon = null;
    this.guessedPokemonIds = new Set();
    this.numberOfClues = 5;
    this.totalPokemonCount = 1032;
    this.life = 3;
    this.timePerGuess = 30; // Increased to 30 seconds for better UX
    this.timerInterval = null;
    this.currentTimeLeft = this.timePerGuess;
    this.onTimerUpdate = null;
  }


  getCurrentPokemon(): PokemonData | null {
    return this.currentPokemon;
  }

  setScore(score: number): void {
    this.score = score;
  }

  setNumberOfClues(numberOfClues: number): void {
    this.numberOfClues = numberOfClues;
  }

  getScore(): number {
    return this.score;
  }

  getLife(): number {
    return this.life;
  }

  getNumberOfClues(): number {
    return this.numberOfClues;
  }

  getGameState(): string {
    return this.gameState;
  }
  getTimePerGuess(): number {
    return this.timePerGuess;
  }

  // setTimePerGuess(time: number): void {
  //   this.timePerGuess = time;
  // }
 setTimerUpdateCallback(callback: (timeLeft: number) => void): void {
    this.onTimerUpdate = callback;
  }

  private updateTimer(): void {
    if (this.currentTimeLeft <= 0) {
      this.handleTimeUp();
      return;
    }
    
    this.currentTimeLeft -= 1;
    
    // Notify UI about timer update
    if (this.onTimerUpdate) {
      this.onTimerUpdate(this.currentTimeLeft);
    }
    
    console.log(`Time left: ${this.currentTimeLeft}s`);
  }

  private handleTimeUp(): void {
    this.stopTimer();
    this.life -= 1;
    
    if (this.life <= 0) {
      this.gameState = "lost";
      console.log("Time's up! Game over!");
    } else {
      console.log("Time's up! Life lost!");
      // Auto move to next Pokémon or end round
      this.resetTimer();
    }
  }

  private startTimer(): void {
    this.stopTimer(); // Clear any existing timer
    this.currentTimeLeft = this.timePerGuess;
    
    this.timerInterval = setInterval(() => {
      this.updateTimer();
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  private resetTimer(): void {
    this.stopTimer();
    this.currentTimeLeft = this.timePerGuess;
    
    if (this.onTimerUpdate) {
      this.onTimerUpdate(this.currentTimeLeft);
    }
  }

  getCurrentTimeLeft(): number {
    return this.currentTimeLeft;
  }

  // Modify startGame to include timer
  async startGame(): Promise<void> {
    this.gameState = "in_progress";
    try {
      if (this.life <= 0) {
        throw new Error("Game Over! Please restart the game.");
      }
      this.score = 0;
      this.currentPokemonId = this.generateUniquePokemonId();
      this.guessedPokemonIds.clear();
      this.numberOfClues = 5;
      this.currentPokemon = await PokeApi.getPokemon(this.currentPokemonId);
      this.resetTimer();
      this.startTimer();
    } catch (error) {
      this.gameState = "not_started";
      this.stopTimer();
      throw error;
    }
  }

  // Modify stillPlaying to reset timer
  async stillPlaying(): Promise<void> {
    this.gameState = "in_progress";
    try {
      if (this.life <= 0) {
        throw new Error("Game Over! Please restart the game.");
      }
      this.currentPokemonId = this.generateUniquePokemonId();
      this.guessedPokemonIds.clear();
      this.numberOfClues = 5;
      this.currentPokemon = await PokeApi.getPokemon(this.currentPokemonId);
      this.resetTimer();
      this.startTimer();
    } catch (error) {
      this.gameState = "lost";
      this.stopTimer();
      throw error;
    }
  }

  // Modify guessPokemon to handle timer
  guessPokemon(pokemonName: string): boolean {
    if (!this.currentPokemon) {
      throw new Error("No current Pokémon to guess.");
    }
    if (this.gameState !== "in_progress") {
      throw new Error("Game is not in progress.");
    }
    if (this.life <= 0) {
      throw new Error("Game Over! Please restart the game.");
    }
    
    this.stopTimer(); // Stop timer when guessing
    
    const isCorrect = pokemonName.toLowerCase() === this.currentPokemon.name.toLowerCase();
    
    if (!isCorrect) {
      this.life -= 1;
      console.log("Wrong guess! Life lost.");
      
      // Restart timer for next guess if life remains
      if (this.life > 0) {
        this.resetTimer();
        this.startTimer();
      } else {
        this.gameState = "lost";
      }
    } else {
      console.log("Hoorraay! You guessed it right!");
      this.gameState = "correct";
    }
    
    return isCorrect;
  }

  // Add method to get formatted time
  getFormattedTime(): string {
    const minutes = Math.floor(this.currentTimeLeft / 60);
    const seconds = this.currentTimeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  // Clean up timer when game ends
  endGame(): void {
    this.stopTimer();
    this.gameState = "not_started";
  }

  // Add a method to pause/resume timer
  pauseTimer(): void {
    this.stopTimer();
  }

  resumeTimer(): void {
    if (this.gameState === "in_progress" && !this.timerInterval) {
      this.startTimer();
    }
  }

  // Clean up on destruction
  cleanup(): void {
    this.stopTimer();
  }

  private generateUniquePokemonId(): number {
    let id: number;
    do {
      id = Math.floor(Math.random() * this.totalPokemonCount) + 1;
    } while (this.guessedPokemonIds.has(id));
    this.guessedPokemonIds.add(id);
    return id;
  } 

  generateClues(pokemon: PokemonData): Clues[] {
    return [
      {
        clueType: "cry",
        label: "Cry",
        value: pokemon.cries.latest,
        order: 1,
      },
      {
        clueType: "type",
        label: "Type",
        value: pokemon.firstType,
        order: 2,
      },
      {
        clueType: "generation",
        label: "Generation",
        value: pokemon.generation.name,
        order: 3,
      },
      {
        clueType: "flavorText",
        label: "Flavor Text",
        value: pokemon.flavorTextEntries[2],
        order: 4,
      },
      {
        clueType: "species",
        label: "Species",
        value: pokemon.species.name,
        order: 5,
      },
    ];
  }
}

export default Game;
