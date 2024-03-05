const Player = require('./player');
const rangedRandomInt = require('./rangedRandomInt');
const array2D = require('./array2d');

class Skynet extends Player {
  #attackList;

  constructor(name, gameboardSize) {
    super(name);
    this.#attackList = array2D(gameboardSize);
  }

  attack(gameboard) {
    // Make sure there is no infinite recursion if the board is already full of attacks
    if (!gameboard.anySpacesLeftToAttack()) return;
    const x = rangedRandomInt(
      gameboard.minBoardPosition,
      gameboard.maxBoardPosition,
    );
    const y = rangedRandomInt(
      gameboard.minBoardPosition,
      gameboard.maxBoardPosition,
    );
    if (this.#attackList[x][y]) {
      // If attack at that location was already done, call repeatedly until new co-ords are randomly picked
      this.attack(gameboard);
      // Return here and skip over adding to attack list and calling super.attack()
      return;
    }
    this.#attackList[x][y] = true;
    super.attack(gameboard, x, y);
  }
}

module.exports = Skynet;
