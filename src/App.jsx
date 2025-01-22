import React from 'react';
import { PITCH_WIDTH, PITCH_HEIGHT, GOAL_WIDTH } from './constants';
import useGameLogic from './useGameLogic';

export default function App() {
  const {
    gameOver,
    score,
    highScore,
    playerPos,
    opponents,
    resetGame
  } = useGameLogic();

  return (
    <div className="min-h-screen bg-emerald-900 flex flex-col items-center justify-center p-4">
      <div className="mb-4 flex gap-4">
        <div className="text-white text-xl">Score: {score}</div>
        <div className="text-white text-xl">High Score: {highScore}</div>
      </div>

      <div className="relative bg-emerald-700 border-2 border-white" 
           style={{ width: PITCH_WIDTH, height: PITCH_HEIGHT }}>
        {/* Player */}
        <div 
          className="absolute bg-blue-500 rounded-full"
          style={{
            width: PLAYER_SIZE,
            height: PLAYER_SIZE,
            left: playerPos.x,
            top: playerPos.y,
            transition: 'left 0.1s, top 0.1s'
          }}
        />

        {/* Opponents */}
        {opponents.map(opponent => (
          <div
            key={opponent.id}
            className="absolute bg-red-500 rounded"
            style={{
              width: opponent.width,
              height: opponent.height,
              left: opponent.x,
              top: opponent.y
            }}
          />
        ))}

        {/* Goals */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full flex justify-between">
          <div className="bg-white/20" style={{ width: GOAL_WIDTH, height: 20 }} />
          <div className="bg-white/20" style={{ width: GOAL_WIDTH, height: 20 }} />
        </div>

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