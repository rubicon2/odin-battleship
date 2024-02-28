class Player {
  constructor(name) {
    this.name = name;
  }

  attack(gameboard, x, y) {
    gameboard.receiveAttack(x, y);
  }
}

module.exports = Player;
