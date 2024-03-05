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
  const { gameboardElement, statusElement } = gameboardDOM;
  const allCells = gameboardElement.querySelectorAll('.gameboardCell');
  allCells.forEach((cell) => {
    cell.remove();
  });
  if (gameboard.shipsLeft())
    statusElement.innerText = `${gameboard.shipsLeft()} ships left`;
  else statusElement.innerText = 'All ships destroyed!';
  createGameboardCells(gameboard, gameboardElement);
}

export default function createGameboard(gameboard) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('gameboard-wrapper');

  const statusElement = document.createElement('div');
  statusElement.classList.add('gameboard-status');
  statusElement.innerText = '5 ships left';
  wrapper.appendChild(statusElement);

  const gameboardElement = document.createElement('div');
  wrapper.appendChild(gameboardElement);

  gameboardElement.classList.add('gameboard');
  createGameboardCells(gameboard, gameboardElement);
  return { wrapper, statusElement, gameboardElement };
}
