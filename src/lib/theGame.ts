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

  constructor() {
    this.gameState = "not_started";
    this.score = 0;
    this.currentPokemonId = 0;
    this.currentPokemon = null;
    this.guessedPokemonIds = new Set();
    this.numberOfClues = 5;
    this.totalPokemonCount = 1032;
    this.life = 3;
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

  async startGame(): Promise<void> {
    this.gameState = "in_progress";
    try {
      if (this.life <= 0) {
        throw new Error("Game Over! Please restart the game.");
      }
      this.score = 0;
      this.currentPokemonId = this.generateUniquePokemonId();
      this.guessedPokemonIds.clear();
      this.life;
      this.numberOfClues = 5;

      this.currentPokemon = await PokeApi.getPokemon(this.currentPokemonId);
    } catch (error) {
      this.gameState = "not_started";
      throw error;
    }
  }

  async stillPlaying(): Promise<void>{
    this.gameState = "in_progress";
    try {
      if (this.life <= 0) {
        throw new Error("Game Over! Please restart the game.");
      }
      this.currentPokemonId = this.generateUniquePokemonId()
      this.guessedPokemonIds.clear();
      this.numberOfClues = 5;

      this.currentPokemon = await PokeApi.getPokemon(this.currentPokemonId);
    } catch (error) {
      this.gameState = "lost";
      throw error;
    }
  }

  private generateUniquePokemonId(): number {
    let id: number;
    do {
      id = Math.floor(Math.random() * this.totalPokemonCount) + 1;
    } while (this.guessedPokemonIds.has(id));
    this.guessedPokemonIds.add(id);
    return id;
  }

  guessPokemon(pokemonName: string): void {
    if (!this.currentPokemon) {
      throw new Error("No current Pokémon to guess.");
    }
    if (this.gameState !== "in_progress") {
      throw new Error("Game is not in progress.");
    }
    if (this.life <= 0) {
      throw new Error("Game Over! Please restart the game.");
    }
    if (pokemonName.toLowerCase() !== this.currentPokemon.name.toLowerCase()) {
      this.life -= 1;
    } else {
      console.log("Hoorraay! You guessed it right!");
    }
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
