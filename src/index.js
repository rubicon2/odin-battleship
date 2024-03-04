import createGameboard, {
  updateBoard,
  addHit,
  addMiss,
  updateGameboard,
} from './modules/dom/gameboard/gameboardDom';
import './style.css';

const Gameboard = require('./modules/gameboard');
const Player = require('./modules/player');
const Skynet = require('./modules/skynet');
const Ship = require('./modules/ship');
const rangedRandomInt = require('./modules/rangedRandomInt');
const Pubsub = require('./modules/pubsub');

let canAttack = true;

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
wrapper.appendChild(playerGameboardDOM.gameboardElement);

const enemyGameboardDOM = createGameboard(enemyGameboard);
wrapper.appendChild(enemyGameboardDOM.gameboardElement);

function enemyAttackPlayer() {
  setTimeout(
    () => {
      const attackPlayer = enemy.attack.bind(enemy);
      attackPlayer(playerGameboard);
      canAttack = true;
    },
    rangedRandomInt(400, 1000),
  );
}

// All this binding stuff is terrible...
Pubsub.subscribe('onCellClick', (gameboardDOM, x, y) => {
  if (canAttack && gameboardDOM === enemyGameboardDOM.gameboardElement) {
    canAttack = false;
    player.attack(enemyGameboard, x, y);
    // enemyGameboard.receiveAttack(x, y);
    enemyAttackPlayer();
  }
});

Pubsub.subscribe('onAttackHit', (gameboard, x, y) => {
  if (gameboard === playerGameboard) playerGameboardDOM.addHit(x, y);
  else if (gameboard === enemyGameboard) enemyGameboardDOM.addHit(x, y);
});
Pubsub.subscribe('onAttackMiss', (gameboard, x, y) => {
  if (gameboard === playerGameboard) playerGameboardDOM.addMiss(x, y);
  else if (gameboard === enemyGameboard) enemyGameboardDOM.addMiss(x, y);
});

Pubsub.subscribe('onBoardChange', (gameboard) => {
  if (gameboard === playerGameboard)
    updateGameboard(gameboard, playerGameboardDOM.gameboardElement);
  if (gameboard === enemyGameboard)
    updateGameboard(gameboard, enemyGameboardDOM.gameboardElement);
});
