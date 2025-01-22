import { PLAYER_SIZE, OPPONENT_WIDTH, PITCH_WIDTH } from './constants';

export const checkCollision = (entity1, entity2) => {
  return !(entity1.x > entity2.x + entity2.width || 
          entity1.x + entity1.width < entity2.x || 
          entity1.y > entity2.y + entity2.height || 
          entity1.y + entity1.height < entity2.y);
};

export const getRandomPosition = (max) => Math.random() * max;