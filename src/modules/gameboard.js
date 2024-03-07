const array2D = require('./array2d');
const Pubsub = require('./pubsub');

class Gameboard {
  // Stores locations of all ships
  // I.e. so a ship of length 3 will take up 3 cells, all containing a ref to the ship
  #boardCells = null;

  #receivedAttackCells = null;

  // Keep refs to each ship as they are placed, so can easily update their state
  #shipLog = [];

  constructor(boardSize = 10) {
    this.boardSize = boardSize;
    this.#boardCells = array2D(boardSize);
    this.#receivedAttackCells = array2D(boardSize);
  }

  reset() {
    this.#boardCells = array2D(this.boardSize);
    this.#receivedAttackCells = array2D(this.boardSize);
    this.#shipLog = [];
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

  get ships() {
    return this.#shipLog;
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
      // Make a record of start and end positions so we can use this to style front and end of ship later
      const endX = ship.isHorizontal ? x : x + ship.length - 1;
      const endY = ship.isHorizontal ? y + ship.length - 1 : y;
      this.#shipLog.push({
        startX: x,
        startY: y,
        endX,
        endY,
        ship,
      });
      Pubsub.publish('onBoardChange', this);
    } else {
      throw new Error(`Space is not available! x: ${x}, y: ${y}`);
    }
  }

  get(x, y) {
    return this.#boardCells[x][y];
  }

  removeShip(x, y) {
    const ship = this.get(x, y);
    const { startX, startY } = this.#shipLog.filter(
      (entry) => entry.ship === ship,
    )[0];
    // Remove from ship log
    this.#shipLog = this.#shipLog.filter((entry) => entry.ship !== ship);
    // Remove from board
    if (ship.isHorizontal) {
      for (
        let currentY = startY;
        currentY < startY + ship.length;
        currentY += 1
      ) {
        this.#boardCells[x][currentY] = null;
      }
    } else {
      for (
        let currentX = startX;
        currentX < startX + ship.length;
        currentX += 1
      ) {
        this.#boardCells[currentX][y] = null;
      }
    }
    Pubsub.publish('onBoardChange', this);
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
    } else {
      this.#receivedAttackCells[x][y] = false;
    }
    Pubsub.publish('onBoardChange', this);
  }

  shipCount() {
    return this.#shipLog.length;
  }

  shipsLeft() {
    return this.#shipLog.reduce(
      (count, shipLogEntry) =>
        count + parseInt(shipLogEntry.ship.isSunk() ? 0 : 1, 10),
      0,
    );
  }

  areShipsAllSunk() {
    // eslint-disable-next-line no-restricted-syntax
    for (const shipLogEntry of this.#shipLog)
      if (!shipLogEntry.ship.isSunk()) return false;
    return true;
  }
}

module.exports = Gameboard;
