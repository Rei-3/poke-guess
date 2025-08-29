import React from "react";
import type { PokemonData, Clues } from "../lib/pokeApi";
import Game from "../lib/theGame";

interface CluesProps {
    pokemon: PokemonData;
    sendNumberOfClues: (numberOfClues: number) => void;
}

interface CluesState {
    revealClue: number[];
    numberOfClues: number;
}

class CluesComponent extends React.Component<CluesProps, CluesState> {
    private game: Game;
    private clues: Clues[];

    constructor(props: CluesProps) {
        super(props);
        this.game = new Game();
        this.clues = this.game.generateClues(props.pokemon);
        this.state = {
            revealClue: [],
            numberOfClues: this.game.getNumberOfClues(),
        };
    }

    componentDidMount(): void {
        this.props.sendNumberOfClues(this.state.numberOfClues);
    }
    componentDidUpdate(prevProps: CluesProps): void {
        if (prevProps.pokemon.pokemonId !== this.props.pokemon.pokemonId) {
            this.clues = this.game.generateClues(this.props.pokemon);
            this.setState({
                revealClue: [],
                numberOfClues: this.game.getNumberOfClues(),
            });
        }
    }

    handleRevealClue = () => {
        if (this.state.numberOfClues <= 0) {
            return false;
        }
        const newNum = this.state.numberOfClues - 1;
        const nextClueIndex = this.state.revealClue.length;
        
        this.setState(prevState => ({
            revealClue: [...prevState.revealClue, nextClueIndex],
            numberOfClues: newNum,
        }));
        this.props.sendNumberOfClues(newNum);
        console.log(newNum);
        return true;
    }

    renderClue = (clue: Clues, index: number) => {
        const isRevealed = this.state.revealClue.includes(index);

        return (
            <div key={index} className={`clue p-3 mb-2 rounded-lg transition-all border-l-4 
                ${isRevealed ? 'bg-blue-50 border-blue-400 shadow-sm' : 'bg-gray-50 border-gray-300'}`}>
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-700 text-sm">{clue.label}</h3>
                    {!isRevealed && <span className="text-xs text-gray-400 bg-gray-200 px-2 py-1 rounded-full">Hidden</span>}
                </div>
                {isRevealed ? (
                    <div className="mt-2">
                        {clue.clueType === 'cry' ? (
                            <audio src={clue.value as string} controls className="w-full h-8" />
                        ) : (
                            <p className="text-gray-800 text-sm">{Array.isArray(clue.value) ? clue.value[0] : clue.value}</p>
                        )}
                    </div>
                ) : (
                    <p className="mt-2 text-gray-400 text-sm italic">Click "Reveal Clue" to unlock</p>
                )}
            </div>
        );
    };

    render() {
        const { revealClue } = this.state;
        const allRevealed = revealClue.length >= this.clues.length;

        return (
            <div className="clues-container">
                <div className="grid gap-2 mb-4">
                    {this.clues.map(this.renderClue)}
                </div>
                
                <div className="text-center">
                    <button
                        onClick={this.handleRevealClue}
                        disabled={allRevealed}
                        className={`px-6 py-2 rounded-full font-semibold text-white transition-all
                            ${allRevealed ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 active:scale-95'}`}
                    >
                        {allRevealed ? 'All Clues Revealed!' : `Reveal Clue (${5 - revealClue.length} left)`}
                    </button>
                    
                    <div className="mt-2 text-xs text-gray-500">
                        {revealClue.length}/{this.clues.length} clues revealed
                    </div>
                </div>
            </div>
        );
    }
}

export default CluesComponent;