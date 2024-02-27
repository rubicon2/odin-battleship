const Gameboard = require('../modules/gameboard');
const Ship = require('../modules/ship');

const gameboard = new Gameboard();

beforeEach(() => {
  gameboard.reset();
});

describe('gameboard', () => {
  test('reset', () => {
    const anotherBoard = new Gameboard();
    gameboard.reset();
    expect(gameboard).toEqual(anotherBoard);
  });

  test('check position valid', () => {
    expect(gameboard.checkPositionValid(0, 0)).toBe(true);
    expect(
      gameboard.checkPositionValid(
        gameboard.boardSize - 1,
        gameboard.boardSize - 1,
      ),
    ).toBe(true);
    expect(gameboard.checkPositionValid(-1, 0)).toBe(false);
    expect(gameboard.checkPositionValid(0, -1)).toBe(false);
    expect(gameboard.checkPositionValid(gameboard.boardSize, 0)).toBe(false);
  });

  test('check position empty', () => {
    const ship = new Ship('Some Ship', 3);
    expect(gameboard.checkSpaceAvailable(ship, 0, 0)).toBe(true);
  });

  test('detects whether ships are all sunk', () => {
    const shipA = new Ship('Ship the First', 3);
    gameboard.place(shipA, 0, 0);
    const shipB = new Ship('Ship the Second', 3);
    gameboard.place(shipB, 1, 0);
    expect(gameboard.areShipsAllSunk()).toBe(false);
    gameboard.receiveAttack(0, 0);
    gameboard.receiveAttack(0, 1);
    gameboard.receiveAttack(0, 2);
    gameboard.receiveAttack(1, 0);
    gameboard.receiveAttack(1, 1);
    gameboard.receiveAttack(1, 2);
    expect(gameboard.areShipsAllSunk()).toBe(true);
  });

  describe('get ship at position', () => {
    test('get ship at origin', () => {
      const ship = new Ship('Some Ship', 3);
      // Err doesn't this mean we are testing not only gameboard.get but gameboard.place also?
      gameboard.place(ship, 0, 0);
      expect(gameboard.get(0, 0)).toBe(ship);
    });

    test('get null as position with no ship', () => {
      expect(gameboard.get(0, 0)).toBe(null);
    });

    test('get ship at all positions, taking into account vertical orientation and length of ship', () => {
      const ship = new Ship('Some Ship', 5);
      gameboard.place(ship, 2, 2);
      expect(gameboard.get(2, 1)).toBe(null);
      expect(gameboard.get(2, 2)).toBe(ship);
      expect(gameboard.get(2, 3)).toBe(ship);
      expect(gameboard.get(2, 4)).toBe(ship);
      expect(gameboard.get(2, 5)).toBe(ship);
      expect(gameboard.get(2, 6)).toBe(ship);
      expect(gameboard.get(2, 7)).toBe(null);
    });

    test('get ship at all positions, taking into account horiztonal orientation and length of ship', () => {
      const ship = new Ship('Some Ship', 3, false);
      gameboard.place(ship, 2, 2);
      expect(gameboard.get(1, 2)).toBe(null);
      expect(gameboard.get(2, 2)).toBe(ship);
      expect(gameboard.get(3, 2)).toBe(ship);
      expect(gameboard.get(4, 2)).toBe(ship);
      expect(gameboard.get(5, 2)).toBe(null);
    });
  });

  describe('placing ships', () => {
    test('set ship (length 3) to vertical position', () => {
      // Literally the same as get ship test. Is there any way to separate these tests?
      const ship = new Ship('Some Ship', 3);
      gameboard.place(ship, 0, 0);
      expect(gameboard.get(0, 0)).toBe(ship);
      expect(gameboard.get(0, 1)).toBe(ship);
      expect(gameboard.get(0, 2)).toBe(ship);
    });

    test('set ship (length 3) to horizontal position', () => {
      // Literally the same as get ship test. Is there any way to separate these tests?
      const ship = new Ship('Some Ship', 3, false);
      gameboard.place(ship, 0, 0);
      expect(gameboard.get(0, 0)).toBe(ship);
      expect(gameboard.get(1, 0)).toBe(ship);
      expect(gameboard.get(2, 0)).toBe(ship);
    });

    test('set ship (length 5) to horizontal position', () => {
      const ship = new Ship('A Slightly Longer Ship', 5, false);
      gameboard.place(ship, 2, 2);
      expect(gameboard.get(0, 2)).toBe(null);
      expect(gameboard.get(1, 2)).toBe(null);
      expect(gameboard.get(2, 2)).toBe(ship);
      expect(gameboard.get(3, 2)).toBe(ship);
      expect(gameboard.get(4, 2)).toBe(ship);
      expect(gameboard.get(5, 2)).toBe(ship);
      expect(gameboard.get(6, 2)).toBe(ship);
      expect(gameboard.get(7, 2)).toBe(null);
    });

    test('place multiple ships', () => {
      const shipA = new Ship('The First One', 5);
      gameboard.place(shipA, 0, 0);
      const shipB = new Ship('Ship The Second', 3);
      gameboard.place(shipB, 1, 0);
      expect(gameboard.get(0, 4)).toBe(shipA);
      expect(gameboard.get(1, 2)).toBe(shipB);
    });

    test('attempting to put a ship in a location that conflicts with an existing ship throws an error', () => {
      const shipH = new Ship('A Horizontal Ship', 3, false);
      gameboard.place(shipH, 2, 2);
      const shipV = new Ship('A Vertical Ship', 3, true);
      expect(() => gameboard.place(shipV, 2, 0)).toThrow();
    });

    test('attempting to put a ship on a location that would run off the board throws an error', () => {
      const ship = new Ship('A Very Lost Ship', 3, false);
      expect(() => gameboard.place(ship, 9, 9)).toThrow();
    });
  });

  describe('receive attack', () => {
    let ship;

    beforeEach(() => {
      ship = new Ship('Some Ship', 3);
      gameboard.place(ship, 0, 0);
    });

    test('attack hits', () => {
      gameboard.receiveAttack(0, 0);
      expect(ship.hitCount).toBe(1);
    });

    test('attack hits same spot twice, this should not count as two hits', () => {
      gameboard.receiveAttack(0, 0);
      gameboard.receiveAttack(0, 0);
      expect(ship.hitCount).toBe(1);
    });
  });
});
