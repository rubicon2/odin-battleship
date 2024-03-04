import './gameboard.css';

import createGameboardCell from '../gameboardCell/gameboardCellDom';
import Pubsub from '../../pubsub';

export function updateBoard(gameboard) {}

export function addHit(x, y) {
  // The "this" stuff in here is awful.
  // But need to know which DOM gameboard to update,
  // And also need information from the gameboard game object...
  const cell = this.querySelector(
    `.gameboardCell[data-x="${x}"][data-y="${y}"]`,
  );
  cell.classList.add('hit');
}

export function addMiss(x, y) {
  const cell = this.querySelector(
    `.gameboardCell[data-x="${x}"][data-y="${y}"]`,
  );
  cell.classList.add('miss');
}

export function updateGameboard(gameboard, gameboardElement) {
  const allCells = gameboardElement.querySelectorAll('.gameboardCell');
  allCells.forEach((cell) => {
    cell.remove();
  });

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

export default function createGameboard(gameboard) {
  const gameboardElement = document.createElement('div');
  gameboardElement.classList.add('gameboard');
  // Pubsub.subscribe('onBoardChange', updateBoard);

  const addHitBound = addHit.bind(gameboardElement);
  const addMissBound = addMiss.bind(gameboardElement);
  return { gameboardElement, addHit: addHitBound, addMiss: addMissBound };
  createGameboardCells(gameboard, gameboardElement);
}
