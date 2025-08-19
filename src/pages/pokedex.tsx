import React from "react";

class pokedex extends React.Component {
    componentDidMount() {
        // This is where you can add any initialization logic if needed
    }
    
    render() {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 text-center p-4">
                <h1 className="text-4xl font-bold mb-4">Pokédex Page</h1>
                <p className="text-lg">This is where the Pokédex will be displayed.</p>
            </div>
        );
    }
}

export default pokedex;