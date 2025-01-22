import { useState, useEffect, useCallback } from 'react';
import { 
  PLAYER_SIZE, 
  PLAYER_SPEED,
  OPPONENT_WIDTH,
  OPPONENT_HEIGHT,
  PITCH_WIDTH,
  PITCH_HEIGHT,
  GAME_SPEED
} from './constants';
import { checkCollision, getRandomPosition } from './gameUtils';

export default function useGameLogic() {
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [playerPos, setPlayerPos] = useState({ x: PITCH_WIDTH/2, y: PITCH_HEIGHT/2 });
  const [opponents, setOpponents] = useState([]);
  const [keys, setKeys] = useState({ left: false, right: false, up: false, down: false });

  const resetGame = useCallback(() => {
    setPlayerPos({ x: PITCH_WIDTH/2, y: PITCH_HEIGHT/2 });
    setOpponents([]);
    setScore(0);
    setGameOver(false);
    setHighScore(prev => Math.max(prev, score));
  }, [score]);

  const handleKeyDown = (e) => {
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      setKeys(prev => ({ ...prev, [e.key.replace('Arrow', '').toLowerCase()]: true }));
    }
  };

  const handleKeyUp = (e) => {
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      setKeys(prev => ({ ...prev, [e.key.replace('Arrow', '').toLowerCase()]: false }));
    }
    if (gameOver && e.code === 'Space') resetGame();
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameOver]);

  useEffect(() => {
    if (gameOver) return;

    const movePlayer = () => {
      setPlayerPos(prev => ({
        x: Math.max(0, Math.min(PITCH_WIDTH - PLAYER_SIZE, 
          prev.x + (keys.right ? PLAYER_SPEED : 0) - (keys.left ? PLAYER_SPEED : 0))),
        y: Math.max(0, Math.min(PITCH_HEIGHT - PLAYER_SIZE, 
          prev.y + (keys.down ? PLAYER_SPEED : 0) - (keys.up ? PLAYER_SPEED : 0)))
      }));
    };

    const moveOpponents = () => {
      setOpponents(prev => prev.map(opponent => ({
        ...opponent,
        x: opponent.x - GAME_SPEED
      })).filter(opponent => opponent.x > -OPPONENT_WIDTH));
    };

    const checkCollisions = () => {
      const playerBounds = {
        x: playerPos.x,
        y: playerPos.y,
        width: PLAYER_SIZE,
        height: PLAYER_SIZE
      };

      if (opponents.some(opponent => checkCollision(playerBounds, opponent))) {
        setGameOver(true);
      }
    };

    const gameLoop = () => {
      movePlayer();
      moveOpponents();
      checkCollisions();
      requestAnimationFrame(gameLoop);
    };

    const animationFrame = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrame);
  }, [keys, playerPos, opponents, gameOver]);

  useEffect(() => {
    if (gameOver) return;

    const spawnOpponent = () => {
      setOpponents(prev => [...prev, {
        x: PITCH_WIDTH,
        y: getRandomPosition(PITCH_HEIGHT - OPPONENT_HEIGHT),
        width: OPPONENT_WIDTH,
        height: OPPONENT_HEIGHT,
        id: Date.now()
      }]);
    };

    const opponentInterval = setInterval(spawnOpponent, 2000);
    return () => clearInterval(opponentInterval);
  }, [gameOver]);

  useEffect(() => {
    const savedHighScore = localStorage.getItem('highScore');
    if (savedHighScore) setHighScore(parseInt(savedHighScore));
  }, []);

  useEffect(() => {
    localStorage.setItem('highScore', highScore.toString());
  }, [highScore]);

  return {
    gameOver,
    score,
    highScore,
    playerPos,
    opponents,
    resetGame
  };
}