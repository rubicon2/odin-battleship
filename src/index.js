import './style.css';
import createGameboard, {
  updateGameboard,
  revealShips,
} from './modules/dom/gameboard/gameboardDom';

const Pubsub = require('./modules/pubsub');
const Gameboard = require('./modules/gameboard');
const Player = require('./modules/player');
const Skynet = require('./modules/skynet');
const Ship = require('./modules/ship');
const rangedRandomInt = require('./modules/rangedRandomInt');
const randomDelay = require('./modules/randomDelay');

let canAttack = true;
let gameOver = false;

const gameboardSize = 10;
const playerGameboard = new Gameboard(gameboardSize);
const player = new Player('Bob', gameboardSize);

const enemyGameboard = new Gameboard(gameboardSize);
const enemy = new Skynet('Kate', gameboardSize);

function randomlyPlaceShips(gameboard, shipCount) {
  while (gameboard.shipCount() < shipCount) {
    const newShip = new Ship(
      'Random Ship',
      rangedRandomInt(3, 5),
      rangedRandomInt(0, 1),
    );
    try {
      gameboard.place(
        newShip,
        rangedRandomInt(gameboard.minBoardPosition, gameboard.maxBoardPosition),
        rangedRandomInt(gameboard.minBoardPosition, gameboard.maxBoardPosition),
      );
    } catch (error) {
      console.log(
        'Tried to place a ship where one already exists. Keep trying...',
      );
    }
  }
}

randomlyPlaceShips(playerGameboard, 5);
randomlyPlaceShips(enemyGameboard, 5);

const wrapper = document.createElement('div');
wrapper.classList.add('wrapper');
document.body.appendChild(wrapper);

const playerGameboardDOM = createGameboard(playerGameboard);
wrapper.appendChild(playerGameboardDOM);
revealShips(playerGameboard, playerGameboardDOM);

const enemyGameboardDOM = createGameboard(enemyGameboard);
wrapper.appendChild(enemyGameboardDOM);

function checkWon() {
  if (playerGameboard.areShipsAllSunk()) {
    alert('Skynet wins!');
    gameOver = true;
  } else if (enemyGameboard.areShipsAllSunk()) {
    alert('You win!');
    gameOver = true;
  } else {
    console.log(`${enemyGameboard.shipsLeft()} ships left to sink...`);
  }
}

Pubsub.subscribe('onCellClick', async (gameboardDOM, x, y) => {
  if (!gameOver && canAttack && gameboardDOM === enemyGameboardDOM) {
    canAttack = false;
    player.attack(enemyGameboard, x, y);
    await randomDelay(400, 1000);
    enemy.attack(playerGameboard);
    canAttack = true;
  }
});

Pubsub.subscribe('onBoardChange', (gameboard) => {
  if (gameboard === playerGameboard) {
    updateGameboard(gameboard, playerGameboardDOM);
    revealShips(playerGameboard, playerGameboardDOM);
  } else if (gameboard === enemyGameboard) {
    updateGameboard(gameboard, enemyGameboardDOM);
  }
  if (!gameOver) checkWon();
});
