import React from "react";

class Pokedex extends React.Component {
    render() {
        return (
            <div
                style={{
                    backgroundImage: 'url("https://famewatcher.com/wp-content/uploads/2009/08/construction-black.jpg")',
                    backgroundSize: "repeat",
                    backgroundPosition: "center",
                    minHeight: "100vh",
                }}
                className="flex flex-col justify-center items-center min-h-screen bg-gray-100 bg-opacity-60 text-center p-4"
            >
                <h1 className="text-4xl bg-amber-300 p-2 rounded font-bold mb-4">Pokédex Page</h1>
                <h1 className="text-6xl bg-black p-2 rounded-lg font-bold text-yellow-600">
                    This is under construction 
                </h1>
            </div>
        );
    }
}

export default Pokedex;