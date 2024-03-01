const Gameboard = require('../modules/gameboard');
const Player = require('../modules/player');
const Ship = require('../modules/ship');

const player = new Player('Jimbo');
const opponentGameboard = new Gameboard();
const ship = new Ship('Some Ship', 5);
opponentGameboard.place(ship, 0, 0);

describe('attack a gameboard', () => {
  test('miss an attack', () => {
    player.attack(opponentGameboard, 1, 0);
    expect(ship.hitCount).toBe(0);
  });

  test('attack a ship and hit', () => {
    player.attack(opponentGameboard, 0, 0);
    expect(ship.hitCount).toBe(1);
    player.attack(opponentGameboard, 0, 1);
    expect(ship.hitCount).toBe(2);
    player.attack(opponentGameboard, 0, 4);
    expect(ship.hitCount).toBe(3);
  });
});
