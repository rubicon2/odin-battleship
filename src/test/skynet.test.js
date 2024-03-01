const Skynet = require('../modules/skynet');
const Gameboard = require('../modules/gameboard');
const Ship = require('../modules/ship');

let gameboard = null;
let skynet = null;
let ship = null;

beforeEach(() => {
  gameboard = new Gameboard();
  skynet = new Skynet('The AI Overlord', gameboard.boardSize);
  ship = new Ship('Some Ship', 3);
  gameboard.place(ship, 0, 0);
});

describe('skynet', () => {
  test('make random shot', () => {
    skynet.attack(gameboard);
    expect(gameboard.receivedAttacks.length).toBe(1);
  });

  test('do not try to make same shot twice', () => {
    for (let i = 0; i < 4; i += 1) {
      skynet.attack(gameboard);
    }
    expect(gameboard.receivedAttacks.length).toBe(4);
  });
});
