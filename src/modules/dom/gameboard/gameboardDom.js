import './gameboard.css';

import createGameboardCell from '../gameboardCell/gameboardCellDom';

export default function createGameboard(gameboardSize) {
  const gameboard = document.createElement('div');
  gameboard.classList.add('gameboard');

  for (let x = 0; x < gameboardSize; x += 1) {
    for (let y = 0; y < gameboardSize; y += 1) {
      const cell = createGameboardCell();
      cell.setAttribute('data-x', x);
      cell.setAttribute('data-y', y);
      gameboard.appendChild(cell);
    }
  }

  return gameboard;
}
