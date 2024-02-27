const Ship = require('../modules/ship');

describe('ship', () => {
  test('ship length', () => {
    const ship = new Ship('Name', 3);
    expect(ship.length).toBe(3);
  });

  test('ship orientation', () => {
    const ship = new Ship('Name', 3);
    expect(ship.isVertical).toBe(true);
  });

  test('times hit', () => {
    const ship = new Ship('Name', 3);
    expect(ship.hitCount).toBe(0);
  });

  test('hit method', () => {
    const ship = new Ship('Name', 3);
    ship.hit();
    ship.hit();
    expect(ship.hitCount).toBe(2);
  });

  test('is sunk method', () => {
    const ship = new Ship('Name', 1);
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });
});
