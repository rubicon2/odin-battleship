import './gameboardCell.css';

export default function createGameboardCell() {
  const gameboardCell = document.createElement('div');
  gameboardCell.classList.add('gameboardCell');
  return gameboardCell;
}
