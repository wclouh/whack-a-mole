import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [moles, setMoles] = useState(Array(9).fill(false));
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [difficulty, setDifficulty] = useState("medium");
  const [gameOver, setGameOver] = useState(false);

  const hitSound = useRef(new Audio("/assets/hit.mp3"));
  const popSound = useRef(new Audio("/assets/pop.mp3"));

  const moleTimer = useRef(null);
  const countdown = useRef(null);

  const speeds = {
    easy: 1200,
    medium: 800,
    hard: 500,
  };

  useEffect(() => {
    if (isPlaying) {
      moleTimer.current = setInterval(() => {
        let newMoles = Array(9).fill(false);
        const randomIndex = Math.floor(Math.random() * 9);
        newMoles[randomIndex] = true;
        setMoles(newMoles);
        popSound.current.play();
      }, speeds[difficulty]);

      countdown.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(countdown.current);
            clearInterval(moleTimer.current);
            setIsPlaying(false);
            setGameOver(true);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(moleTimer.current);
      clearInterval(countdown.current);
    };
  }, [isPlaying, difficulty]);

  const hitMole = (index) => {
    if (moles[index]) {
      setScore((s) => s + 1);
      hitSound.current.play();
      let newMoles = [...moles];
      newMoles[index] = false;
      setMoles(newMoles);
    }
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setIsPlaying(true);
    setGameOver(false);
  };

  return (
    <div className="game">
      <h1>🎯 Whack-a-Mole</h1>
      <p className="score">Score: {score}</p>
      <p className="timer">Time Left: {timeLeft}s</p>

      {!isPlaying && !gameOver && (
        <div className="controls">
          <label>Difficulty: </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="easy">🐢 Easy</option>
            <option value="medium">⚡ Medium</option>
            <option value="hard">🔥 Hard</option>
          </select>
          <button onClick={startGame} className="start-btn">
            Start Game
          </button>
        </div>
      )}

      {gameOver && (
        <div className="game-over">
          <h2>🎉 Game Over!</h2>
          <p>Your Final Score: {score}</p>
          <button onClick={startGame} className="restart-btn">
            Play Again
          </button>
        </div>
      )}

      <div className="grid">
        {moles.map((mole, index) => (
          <div key={index} className="hole" onClick={() => hitMole(index)}>
            {mole && (
              <img
                src="/assets/mole.png"
                alt="Mole"
                className="mole-img"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

