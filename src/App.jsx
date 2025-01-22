import React, { useState, useEffect, useCallback } from 'react';
import { PLAYER_SIZE, GRAVITY, JUMP_FORCE, OBSTACLE_WIDTH, GAME_SPEED } from './constants';
import { checkCollision } from './gameUtils';

export default function App() {
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [playerPosition, setPlayerPosition] = useState(300);
  const [playerVelocity, setPlayerVelocity] = useState(0);
  const [obstacles, setObstacles] = useState([]);

  const resetGame = useCallback(() => {
    setPlayerPosition(300);
    setPlayerVelocity(0);
    setObstacles([]);
    setScore(0);
    setGameOver(false);
    setHighScore(prev => Math.max(prev, score));
  }, [score]);

  const jump = () => {
    if (!gameOver && playerPosition === 300) {
      setPlayerVelocity(JUMP_FORCE);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
      if (gameOver && e.code === 'Space') {
        resetGame();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameOver, resetGame]);

  useEffect(() => {
    if (gameOver) return;

    const gameLoop = () => {
      let newVelocity = playerVelocity + GRAVITY;
      let newPosition = playerPosition + newVelocity;
      
      if (newPosition > 300) {
        newPosition = 300;
        newVelocity = 0;
      }

      setPlayerPosition(newPosition);
      setPlayerVelocity(newVelocity);

      const newObstacles = obstacles.map(obstacle => ({
        ...obstacle,
        x: obstacle.x - GAME_SPEED
      })).filter(obstacle => obstacle.x > -OBSTACLE_WIDTH);

      setObstacles(newObstacles);

      if (newObstacles.some(obstacle => checkCollision(obstacle, newPosition))) {
        setGameOver(true);
      }

      setScore(prev => prev + 1);
    };

    const animationFrame = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrame);
  }, [playerPosition, playerVelocity, obstacles, gameOver]);

  useEffect(() => {
    if (gameOver) return;

    const obstacleInterval = setInterval(() => {
      setObstacles(prev => [...prev, { x: window.innerWidth, id: Date.now() }]);
    }, 2000);

    return () => clearInterval(obstacleInterval);
  }, [gameOver]);

  useEffect(() => {
    const savedHighScore = localStorage.getItem('highScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('highScore', highScore.toString());
  }, [highScore]);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center">
      <div className="mb-4 flex gap-4">
        <div className="text-white text-xl">Score: {score}</div>
        <div className="text-white text-xl">High Score: {highScore}</div>
      </div>
      
      <div className="relative w-full h-[400px] overflow-hidden bg-slate-800">
        <div 
          className="absolute bottom-0 left-[100px] bg-red-500 transition-transform duration-75"
          style={{ 
            width: PLAYER_SIZE + 'px',
            height: PLAYER_SIZE + 'px',
            transform: `translateY(${-playerPosition}px)`
          }}
        />

        {obstacles.map(obstacle => (
          <div
            key={obstacle.id}
            className="absolute bottom-0 h-[40px] bg-green-500"
            style={{
              width: OBSTACLE_WIDTH + 'px',
              left: obstacle.x + 'px'
            }}
          />
        ))}

        {gameOver && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
            <div className="text-white text-4xl mb-4">Game Over!</div>
            <button 
              onClick={resetGame}
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer"
            >
              Play Again (Space)
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 text-white">
        Made on <a href="https://www.zapt.ai" target="_blank" rel="noopener" className="text-blue-400 hover:underline">ZAPT</a>
      </div>
    </div>
  );
}