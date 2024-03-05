const Ship = require('./ship');
const rangedRandomInt = require('./rangedRandomInt');

class Player {
  constructor(name) {
    this.name = name;
  }

  randomlyPlaceShips(gameboard) {
    const carrier = new Ship(
      'Carrier',
      5,
      rangedRandomInt(0, 1) ? false : true,
    );
    const battleship = new Ship(
      'Battleship',
      4,
      rangedRandomInt(0, 1) ? false : true,
    );
    const cruiser = new Ship(
      'Cruiser',
      3,
      rangedRandomInt(0, 1) ? false : true,
    );
    const submarine = new Ship(
      'Submarine',
      3,
      rangedRandomInt(0, 1) ? false : true,
    );
    const destroyer = new Ship(
      'Destroyer',
      2,
      rangedRandomInt(0, 1) ? false : true,
    );
    const ships = [carrier, battleship, cruiser, submarine, destroyer];

    const minPos = gameboard.minBoardPosition;
    const maxPos = gameboard.maxBoardPosition;

    while (ships.length) {
      try {
        gameboard.place(
          ships[ships.length - 1],
          rangedRandomInt(minPos, maxPos),
          rangedRandomInt(minPos, maxPos),
        );
        ships.pop();
      } catch (error) {
        console.log(
          'Tried to place a ship where one already exists. Keep trying...',
        );
      }
    }
  }

  attack(gameboard, x, y) {
    gameboard.receiveAttack(x, y);
  }
}

module.exports = Player;
