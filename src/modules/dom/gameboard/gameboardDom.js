import './gameboard.css';

import createGameboardCell from '../gameboardCell/gameboardCellDom';
import Pubsub from '../../pubsub';

function createGameboardCells(gameboard, gameboardElement) {
  const gameboardSize = gameboard.boardSize;
  for (let x = 0; x < gameboardSize; x += 1) {
    for (let y = 0; y < gameboardSize; y += 1) {
      const cell = createGameboardCell();
      if (gameboard.receivedAttackCells[x][y] === true)
        cell.classList.add('hit');
      else if (gameboard.receivedAttackCells[x][y] === false)
        cell.classList.add('miss');
      cell.setAttribute('data-x', x);
      cell.setAttribute('data-y', y);
      cell.addEventListener('click', () => {
        Pubsub.publish('onCellClick', gameboardElement, x, y);
      });
      gameboardElement.appendChild(cell);
    }
  }
}

export function updateGameboard(gameboard, gameboardElement) {
  const allCells = gameboardElement.querySelectorAll('.gameboardCell');
  allCells.forEach((cell) => {
    cell.remove();
  });
  createGameboardCells(gameboard, gameboardElement);
}

export default function createGameboard(gameboard) {
  const gameboardElement = document.createElement('div');
  gameboardElement.classList.add('gameboard');
  createGameboardCells(gameboard, gameboardElement);
  return gameboardElement;
}
