import './style.css';

const Gameboard = require('./modules/gameboard');
const Player = require('./modules/player');
const Ship = require('./modules/ship');
const rangedRandomInt = require('./modules/rangedRandomInt');

const playerOne = new Player('Bob');
const gameboardOne = new Gameboard();

const playerTwo = new Player('Kate');
const gameboardTwo = new Gameboard();

function randomlyPlaceShips(gameboard, shipCount) {
  while (gameboard.shipCount() < shipCount) {
    const newShip = new Ship(
      'Random Ship',
      rangedRandomInt(3, 5),
      rangedRandomInt(0, 1),
    );
    gameboard.place(
      newShip,
      rangedRandomInt(gameboard.minBoardPosition, gameboard.maxBoardPosition),
      rangedRandomInt(gameboard.minBoardPosition, gameboard.maxBoardPosition),
    );
  }
}

randomlyPlaceShips(gameboardOne, 5);
randomlyPlaceShips(gameboardTwo, 5);
