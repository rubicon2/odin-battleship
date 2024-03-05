import './style.css';
import createGameboard, {
  updateGameboard,
  revealShips,
} from './modules/dom/gameboard/gameboardDom';

const Pubsub = require('./modules/pubsub');
const Gameboard = require('./modules/gameboard');
const Player = require('./modules/player');
const Skynet = require('./modules/skynet');
const randomDelay = require('./modules/randomDelay');

let canAttack = true;
let gameOver = false;

const gameboardSize = 10;
const playerGameboard = new Gameboard(gameboardSize);
const player = new Player('Bob', gameboardSize);

const enemyGameboard = new Gameboard(gameboardSize);
const enemy = new Skynet('Kate', gameboardSize);

player.randomlyPlaceShips(playerGameboard);
enemy.randomlyPlaceShips(enemyGameboard);

const wrapper = document.createElement('div');
wrapper.classList.add('wrapper');
document.body.appendChild(wrapper);

const playerGameboardDOM = createGameboard(playerGameboard);
const playerGameboardElement = playerGameboardDOM.gameboardElement;
wrapper.appendChild(playerGameboardDOM.wrapper);
revealShips(playerGameboard, playerGameboardElement);

const enemyGameboardDOM = createGameboard(enemyGameboard);
const enemyGameboardElement = enemyGameboardDOM.gameboardElement;
wrapper.appendChild(enemyGameboardDOM.wrapper);

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
  if (!gameOver && canAttack && gameboardDOM === enemyGameboardElement) {
    canAttack = false;
    player.attack(enemyGameboard, x, y);
    await randomDelay(400, 1000);
    enemy.attack(playerGameboard);
    canAttack = true;
  }
});

Pubsub.subscribe('onBoardChange', (gameboard) => {
  if (gameboard === playerGameboard) {
    updateGameboard(gameboard, playerGameboardElement);
    revealShips(playerGameboard, playerGameboardElement);
  } else if (gameboard === enemyGameboard) {
    updateGameboard(gameboard, enemyGameboardElement);
  }
  if (!gameOver) checkWon();
});
