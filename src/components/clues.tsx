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
            <div key={index} className={`clue p-4 mb-3 rounded-lg transition-all 
                ${isRevealed ? 'bg-white shadow-md' : 'bg-gray-100'}`}>
                <h3 className="font-bold text-gray-700">{clue.label}</h3>
                {isRevealed ? (
                    clue.clueType === 'cry' ? (
                        <audio src={clue.value as string} controls className="mt-2" />
                    ) : (
                        <p className="mt-1">{Array.isArray(clue.value) ? clue.value[0] : clue.value}</p>
                    )
                ) : (
                    <p className="mt-1 text-gray-400">???</p>
                )}
            </div>
        );
    };

    render() {
        const { revealClue } = this.state;
        const allRevealed = revealClue.length >= this.clues.length;

        return (
            <div className="clues-container">
                <h2 className="text-2xl font-bold mb-4">Pokémon Clues</h2>
                
                {this.clues.map(this.renderClue)}
                
                <button
                    onClick={this.handleRevealClue}
                    disabled={allRevealed}
                    className={`mt-4 px-6 py-2 rounded-lg font-bold text-white
                        ${allRevealed ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                    {allRevealed ? 'All Clues Revealed!' : 'Reveal Next Clue'}
                </button>
                
                <div className="mt-3 text-sm text-gray-500">
                    {revealClue.length}/{this.clues.length} clues revealed
                </div>
            </div>
        );
    }
}

export default CluesComponent;