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

export function revealShips(gameboard, gameboardElement) {
  const gameboardSize = gameboard.boardSize;
  for (let x = 0; x < gameboardSize; x += 1) {
    for (let y = 0; y < gameboardSize; y += 1) {
      const ship = gameboard.boardCells[x][y];
      if (ship) {
        const cellElement = gameboardElement.querySelector(
          `.gameboardCell[data-x="${x}"][data-y="${y}"]`,
        );
        cellElement.classList.add('ship');
        cellElement.classList.add(
          ship.isHorizontal ? 'horizontal-ship' : 'vertical-ship',
        );
      }
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
  const wrapper = document.createElement('div');
  wrapper.classList.add('gameboard-wrapper');

  const status = document.createElement('div');
  status.classList.add('gameboard-status');
  status.innerText = '5 Ships Left';
  wrapper.appendChild(status);

  const gameboardElement = document.createElement('div');
  wrapper.appendChild(gameboardElement);

  gameboardElement.classList.add('gameboard');
  createGameboardCells(gameboard, gameboardElement);
  return { wrapper, gameboardElement };
}
