const array2D = require('./array2d');
const Pubsub = require('./pubsub');

class Gameboard {
  // Stores locations of all ships
  // I.e. so a ship of length 3 will take up 3 cells, all containing a ref to the ship
  #boardCells = null;

  #receivedAttackCells = null;

  // Keep refs to each ship as they are placed, so can easily update their state
  #ships = [];

  constructor(boardSize = 10) {
    this.boardSize = boardSize;
    this.#boardCells = array2D(boardSize);
    this.#receivedAttackCells = array2D(boardSize);
  }

  reset() {
    this.#boardCells = array2D(this.boardSize);
    this.#receivedAttackCells = array2D(this.boardSize);
    this.#ships = [];
    Pubsub.publish('onBoardChange', this);
  }

  get minBoardPosition() {
    return 0;
  }

  get maxBoardPosition() {
    return this.boardSize - 1;
  }

  get boardCells() {
    return this.#boardCells;
  }

  get receivedAttackCells() {
    return this.#receivedAttackCells;
  }

  get receivedAttacks() {
    return this.#receivedAttackCells.flat().filter((cell) => cell !== null);
  }

  anySpacesLeftToAttack() {
    return this.receivedAttacks.length < this.boardSize ** 2;
  }

  checkPositionValid(x, y) {
    return (
      x >= this.minBoardPosition &&
      x <= this.maxBoardPosition &&
      y >= this.minBoardPosition &&
      y <= this.maxBoardPosition
    );
  }

  checkSpaceAvailable(ship, x, y) {
    if (ship.isHorizontal) {
      for (let currentY = y; currentY < y + ship.length; currentY += 1) {
        if (
          this.#boardCells[x][currentY] ||
          !this.checkPositionValid(x, currentY)
        )
          return false;
      }
    } else {
      for (let currentX = x; currentX < x + ship.length; currentX += 1) {
        if (
          this.#boardCells[currentX][y] ||
          !this.checkPositionValid(currentX, y)
        )
          return false;
      }
    }
    return true;
  }

  place(ship, x, y) {
    if (this.checkSpaceAvailable(ship, x, y)) {
      if (ship.isHorizontal) {
        for (let currentY = y; currentY < y + ship.length; currentY += 1) {
          this.#boardCells[x][currentY] = ship;
        }
      } else {
        for (let currentX = x; currentX < x + ship.length; currentX += 1) {
          this.#boardCells[currentX][y] = ship;
        }
      }
      this.#ships.push(ship);
      Pubsub.publish('onBoardChange', this);
    } else {
      throw new Error(`Space is not available! x: ${x}, y: ${y}`);
    }
  }

  get(x, y) {
    return this.#boardCells[x][y];
  }

  checkSpaceAttacked(x, y) {
    if (this.#receivedAttackCells[x][y] !== null) return true;
    return false;
  }

  receiveAttack(x, y) {
    if (this.checkSpaceAttacked(x, y)) {
      // Already attacked that spot, skip
      return;
    }
    const ship = this.#boardCells[x][y];
    if (ship) {
      ship.hit();
      this.#receivedAttackCells[x][y] = true;
      Pubsub.publish('onAttackHit', this, x, y);
    } else {
      this.#receivedAttackCells[x][y] = false;
      Pubsub.publish('onAttackMiss', this, x, y);
    }
    Pubsub.publish('onBoardChange', this);
  }

  shipCount() {
    return this.#ships.length;
  }

  areShipsAllSunk() {
    // eslint-disable-next-line no-restricted-syntax
    for (const ship of this.#ships) if (!ship.isSunk()) return false;
    return true;
  }
}

module.exports = Gameboard;
