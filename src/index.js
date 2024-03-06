import './style.css';
import createGameboard, {
  updateGameboard,
  revealShips,
} from './modules/dom/gameboard/gameboardDom';

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

const gameOverDom = createGameOverOverlay();
document.body.appendChild(gameOverDom.overlay);
gameOverDom.playAgainButton.addEventListener('click', () => {
  resetGame();
  gameOverDom.overlay.classList.add('invisible');
  // Need to fade out and then remove overlay so it does not get in the way of clicking the cells!
  // At the moment set z-index to some random value to keep it out of the way, but looks weird when fading out...
});

function gameLost() {
  gameOverDom.overlayInfoText.innerText = 'YOU LOST LIKE A WINNER!';
  gameOverDom.overlay.classList.remove('invisible');
}

function gameWon() {
  gameOverDom.overlayInfoText.innerText = 'YOU WON LIKE A LOSER!';
  gameOverDom.overlay.classList.remove('invisible');
}

function updateStatus(gameboardDOM, message) {
  gameboardDOM.statusElement.innerText = message;
}

async function handleGameboardCellClick(gameboardDOM, x, y) {
  if (!gameOver && canAttack && gameboardDOM === enemyGameboardElement) {
    canAttack = false;
    player.attack(enemyGameboard, x, y);
    // await randomDelay(400, 1000);
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
          await new Promise((resolve) => setTimeout(resolve, 2000));
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
    gameLost();
    gameOver = true;
  } else if (enemyGameboard.areShipsAllSunk()) {
    gameWon();
    gameOver = true;
  } else {
    console.log(`${enemyGameboard.shipsLeft()} ships left to sink...`);
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
