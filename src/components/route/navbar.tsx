import React from "react";
import { Link } from "react-router-dom";

class Navbar extends React.Component {

    render() {
        return (
            <nav className="bg-gray-800 p-4">
                <div className="container mx-auto flex justify-between items-center">
                   <Link to="/" className="text-black text-lg font-semibold">
                        Poke Guess
                    </Link>
                    <Link to="/about" className="text-black text-lg font-semibold">
                        About
                    </Link>1
                </div>
            </nav>
        );
    }
}

export default Navbar;