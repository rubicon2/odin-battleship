class Ship {
  constructor(name, length, isHorizontal = true) {
    this.name = name;
    this.length = length;
    this.isHorizontal = isHorizontal;
    this.hitCount = 0;
  }

  hit() {
    this.hitCount += 1;
  }

  isSunk() {
    return this.hitCount >= this.length;
  }
}

module.exports = Ship;
