import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaGithub,
  FaGoogle,
  FaHeart,
  FaLinkedin
} from "react-icons/fa";

class Home extends React.Component {
   constMusicArray: string[] = [
    "/sound/intro/bleach.mp3",
    "/sound/intro/dbgt.mp3",
    "/sound/intro/dbz.mp3",
    "/sound/intro/digimon.mp3",
    "/sound/intro/duel.mp3",
    "/sound/intro/gurren.mp3",
    "/sound/intro/inuyasha.mp3",
    "/sound/intro/lelouch.mp3"
  ];

  audioRef: HTMLAudioElement | null = null;

  componentDidMount() {
    // Start the first random song
    this.playRandomMusic();

    // Allow audio after first user interaction
    document.addEventListener("click", this.unmuteAudio, { once: true });
    document.addEventListener("keydown", this.unmuteAudio, { once: true });
  }

  componentWillUnmount() {
    if (this.audioRef) {
      this.audioRef.pause();
      this.audioRef = null;
    }
  }

  unmuteAudio = () => {
    if (this.audioRef) {
      this.audioRef.muted = false;
      this.audioRef.play().catch((err) => console.log("Play blocked:", err));
    }
  };

  playRandomMusic = () => {
    try {
      const randomIndex = Math.floor(Math.random() * this.constMusicArray.length);
      const selectedMusic = this.constMusicArray[randomIndex];

      // Stop previous audio
      if (this.audioRef) {
        this.audioRef.pause();
        this.audioRef = null;
      }

      // Create new audio element
      this.audioRef = new Audio(selectedMusic);
      this.audioRef.loop = false;
      this.audioRef.muted = true; // Start muted for autoplay policy

      // Play (may be blocked until user interacts)
      this.audioRef.play().catch((err) => console.log("Autoplay blocked:", err));

      // When this song ends, play another random song
      this.audioRef.onended = () => {
        this.playRandomMusic();
      };
    } catch (error) {
      console.error("Error playing music:", error);
    }
  };

  
  render() {
    const lastScore = localStorage.getItem("lastScore") || "0";

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-yellow-500 to-red-500 flex flex-col justify-center items-center p-4 relative overflow-hidden">

        {/* Floating Pokéball Decorations */}
        <div className="absolute top-10 left-10 w-16 h-16 bg-red-500/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-12 h-12 bg-yellow-400/20 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-1/3 right-10 w-8 h-8 bg-blue-400/20 rounded-full animate-ping delay-700"></div>
        <div className="absolute bottom-1/3 left-20 w-10 h-10 bg-green-400/20 rounded-full animate-pulse delay-500"></div>

        {/* Main Content */}
        <div className="relative z-10 text-center max-w-2xl mx-auto">

          {/* Animated Title */}
          <div className="mb-12 space-y-4">
            <h1 className="font-pokemon text-4xl sm:text-5xl md:text-6xl pokemon-logo animate-bounce text-white drop-shadow-2xl">
              Who's that
            </h1>
            <h1 className="font-pokemon text-7xl sm:text-8xl md:text-9xl pokemon-logo animate-float bg-gradient-to-r from-yellow-300 via-red-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
              Pokémon?
            </h1>
          </div>

          {/* Last Score Display */}
          <div className="mb-8 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/20 animate-fadeIn">
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">🏆</span>
              <div>
                <div className="text-sm text-gray-600 font-medium">
                  Best Score
                </div>
                <div className="text-2xl font-bold text-yellow-600">
                  {lastScore}
                </div>
              </div>
            </div>
          </div>

          <div className="text-center bg-red-600/20 backdrop-blur-sm rounded-xl px-6 py-4 mb-6 border border-white/30">
            <div className="flex items-center gap-2 justify-center mb-2">
              <FaHeart className="text-red-400 animate-pulse" />
              <span>Made with love by Asssookkaa (lie)</span>
            </div>

            <div className="space-x-2">
              <a href="https://github.com/Rei-3" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-black/20 hover:bg-black/30 px-4 py-2 rounded-full transition-all duration-300">
                <FaGithub />
              </a>

              <a href="https://www.facebook.com/super.gamer.5" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-black/20 hover:bg-black/30 px-4 py-2 rounded-full transition-all duration-300">
                <FaFacebook />
              </a>

              <a href="https://www.linkedin.com/in/christan-endam-b7365a376" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-black/20 hover:bg-black/30 px-4 py-2 rounded-full transition-all duration-300">
                <FaLinkedin />
              </a>

              <a href="mailto:christan.endam@norsu.edu.ph" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-black/20 hover:bg-black/30 px-4 py-2 rounded-full transition-all duration-300">
                <FaGoogle />
              </a>
            </div>

            <Link
              className="mt-2 inline-block text-sm text-black underline hover:text-blue-900"
              to="https://christan-portfolio.vercel.app/"
            >
              Skibidi Developer Portfolio
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6">
            <Link
              to="/game"
              className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-xl hover:shadow-2xl border-2 border-green-400"
            >
              <div className="flex items-center justify-center gap-3">
                <span className="text-xl group-hover:animate-spin">⚡</span>
                <span>Start Game</span>
              </div>
            </Link>

            <Link
              to="/pokedex"
              className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-xl hover:shadow-2xl border-2 border-red-400"
            >
              <div className="flex items-center justify-center gap-3">
                <span className="text-xl group-hover:animate-bounce">📖</span>
                <span>Pokédex</span>
              </div>
            </Link>
          </div>

          {/* Last Score */}
          <div className="mt-8 flex justify-center">
            <div className="bg-gray-600 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/30">
              <p className="text-white text-lg font-medium text-center">
                Your Last Score:{" "}
                <span className="font-bold text-yellow-300">{lastScore}</span>
              </p>
            </div>
          </div>

          <p className="mt-8 text-white/80 text-lg font-medium">
            Test your Pokémon knowledge and become a master trainer!
          </p>

        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>
    );
  }
}

export default Home;
