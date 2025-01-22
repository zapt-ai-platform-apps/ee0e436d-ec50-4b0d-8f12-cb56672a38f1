import { PLAYER_SIZE, OBSTACLE_WIDTH } from './constants';

export const checkCollision = (obstacle, playerPosition) => {
  const playerLeft = 100;
  const playerRight = 100 + PLAYER_SIZE;
  const playerTop = playerPosition;
  const playerBottom = playerPosition + PLAYER_SIZE;

  const obstacleLeft = obstacle.x;
  const obstacleRight = obstacle.x + OBSTACLE_WIDTH;
  const obstacleTop = 300;
  const obstacleBottom = 300 + 40;

  return !(playerRight < obstacleLeft || 
          playerLeft > obstacleRight || 
          playerBottom < obstacleTop || 
          playerTop > obstacleBottom);
};