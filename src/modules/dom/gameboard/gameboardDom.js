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
  // Add heads and tails to the ships
  for (let i = 0; i < gameboard.ships.length; i += 1) {
    const { ship, startX, startY, endX, endY } = gameboard.ships[i];
    const headElement = gameboardElement.querySelector(
      `.gameboardCell[data-x="${startX}"][data-y="${startY}"]`,
    );
    headElement.classList.add(
      ship.isHorizontal ? 'horizontal-ship-head' : 'vertical-ship-head',
    );
    const tailElement = gameboardElement.querySelector(
      `.gameboardCell[data-x="${endX}"][data-y="${endY}"]`,
    );
    if (ship.isHorizontal) tailElement.classList.add('horizontal-ship-tail');
    else tailElement.classList.add('vertical-ship-tail');
    tailElement.classList.add(
      ship.isHorizontal ? 'horizontal-ship-tail' : 'vertical-ship-tail',
    );
  }
}

export function updateGameboard(gameboard, gameboardDOM) {
  const { gameboardElement } = gameboardDOM;
  const allCells = gameboardElement.querySelectorAll('.gameboardCell');
  allCells.forEach((cell) => {
    cell.remove();
  });
  createGameboardCells(gameboard, gameboardElement);
}

export default function createGameboard(gameboard) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('gameboard-wrapper');

  const statusBarElement = document.createElement('div');
  statusBarElement.classList.add('gameboard-status-bar');
  wrapper.appendChild(statusBarElement);

  const statusMessage = document.createElement('div');
  statusMessage.classList.add('gameboard-status-message');
  statusMessage.innerText = 'Status Message';
  statusBarElement.appendChild(statusMessage);

  const gameboardElement = document.createElement('div');
  wrapper.appendChild(gameboardElement);

  gameboardElement.classList.add('gameboard');
  createGameboardCells(gameboard, gameboardElement);
  return {
    wrapper,
    statusBarElement,
    statusMessage,
    gameboardElement,
  };
}
