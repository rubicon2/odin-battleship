import './style.css';
import createGameboard, {
  updateGameboard,
  revealShips,
} from './modules/dom/gameboard/gameboardDom';
import { delay, fade } from './modules/domFade';
import rangedRandomInt from './modules/rangedRandomInt';

const Pubsub = require('./modules/pubsub');
const Gameboard = require('./modules/gameboard');
const Ship = require('./modules/ship');
const Player = require('./modules/player');
const Skynet = require('./modules/skynet');
const createGameOverOverlay = require('./modules/dom/gameOver/gameoverDom');

let canAttack = true;
let gameOver = true;

const gameboardSize = 10;
const playerGameboard = new Gameboard(gameboardSize);
const player = new Player('Bob', gameboardSize);

const enemyGameboard = new Gameboard(gameboardSize);
const enemy = new Skynet('Kate', gameboardSize);

const wrapper = document.createElement('div');
wrapper.classList.add('wrapper');
document.body.appendChild(wrapper);

const playerGameboardDOM = createGameboard(playerGameboard);
const playerGameboardElement = playerGameboardDOM.gameboardElement;
wrapper.appendChild(playerGameboardDOM.wrapper);

const enemyGameboardDOM = createGameboard(enemyGameboard);
const enemyGameboardElement = enemyGameboardDOM.gameboardElement;
wrapper.appendChild(enemyGameboardDOM.wrapper);

async function hideOverlay() {
  await fade(gameOverDom.overlay, 1, 0);
  gameOverDom.overlay.style.display = 'none';
}

async function showOverlay() {
  gameOverDom.overlay.style.display = 'grid';
  await fade(gameOverDom.overlay, 1, 1);
}

const gameOverDom = createGameOverOverlay();
gameOverDom.overlay.style.opacity = 0;
hideOverlay();
document.body.appendChild(gameOverDom.overlay);
gameOverDom.playAgainButton.addEventListener('click', async () => {
  await hideOverlay();
  resetGame();
});

function updateStatus(gameboardDOM, message) {
  gameboardDOM.statusElement.innerText = message;
}

async function handleGameboardCellClick(gameboardDOM, x, y) {
  if (!gameOver && canAttack && gameboardDOM === enemyGameboardElement) {
    canAttack = false;
    player.attack(enemyGameboard, x, y);
    await delay(rangedRandomInt(400, 1000));
    enemy.attack(playerGameboard);
    canAttack = true;
  }
}

async function handleShipCreateCellClick(gameboardDOM, x, y) {
  if (gameboardDOM === playerGameboardElement) {
    try {
      switch (playerGameboard.shipCount()) {
        case 0:
          playerGameboard.place(new Ship('Carrier', 5), x, y);
          updateStatus(
            playerGameboardDOM,
            'Click to place a Battleship (length: 4)',
          );
          break;
        case 1:
          playerGameboard.place(new Ship('Battleship', 4), x, y);
          updateStatus(
            playerGameboardDOM,
            'Click to place a Cruiser (length: 3)',
          );
          break;
        case 2:
          playerGameboard.place(new Ship('Cruiser', 3), x, y);
          updateStatus(
            playerGameboardDOM,
            'Click to place a Submarine (length: 3)',
          );
          break;
        case 3:
          playerGameboard.place(new Ship('Submarine', 3), x, y);
          updateStatus(
            playerGameboardDOM,
            'Click to place a Destroyer (length: 2)',
          );
          break;
        case 4:
          playerGameboard.place(new Ship('Destroyer', 2), x, y);
          updateStatus(playerGameboardDOM, 'All ships placed!');
          await delay(2000);
          updateStatus(
            playerGameboardDOM,
            'Click on the enemy grid to attack!',
          );
          startGame();
          break;
        default:
          break;
      }
    } catch (error) {
      updateStatus(playerGameboardDOM, error.message);
    }
  }
}

function resetGame() {
  playerGameboard.reset();
  enemyGameboard.reset();
  Pubsub.subscribe('onCellClick', handleShipCreateCellClick);
  updateStatus(playerGameboardDOM, 'Click to place a Carrier (length: 5)');
  updateStatus(enemyGameboardDOM, '5 ships left');
}

function updateShipsLeftStatus(gameboard) {
  let gameboardDOM = null;
  if (gameboard === playerGameboard) gameboardDOM = playerGameboardDOM;
  else if (gameboard === enemyGameboard) gameboardDOM = enemyGameboardDOM;

  gameboardDOM.statusElement.innerText = gameboard.shipsLeft()
    ? `${gameboard.shipsLeft()} ships left`
    : `All ships destroyed!`;
}

function startGame() {
  Pubsub.unsubscribe('onCellClick', handleShipCreateCellClick);
  Pubsub.subscribe('onCellClick', handleGameboardCellClick);
  Pubsub.subscribe('onBoardChange', updateShipsLeftStatus);
  enemy.randomlyPlaceShips(enemyGameboard);
  gameOver = false;
}

function checkWon() {
  if (playerGameboard.areShipsAllSunk()) {
    gameOver = true;
    gameOverDom.overlayInfoText.innerText = 'You lost!';
    showOverlay();
  } else if (enemyGameboard.areShipsAllSunk()) {
    gameOver = true;
    gameOverDom.overlayInfoText.innerText = 'You won!';
    showOverlay();
  }
}

Pubsub.subscribe('onBoardChange', (gameboard) => {
  if (gameboard === playerGameboard) {
    updateGameboard(gameboard, playerGameboardDOM);
    revealShips(playerGameboard, playerGameboardElement);
  } else if (gameboard === enemyGameboard) {
    updateGameboard(gameboard, enemyGameboardDOM);
  }
  if (!gameOver) checkWon();
});

resetGame();
