class Ship {
  constructor(name, length, isVertical = true) {
    this.name = name;
    this.length = length;
    this.isVertical = isVertical;
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
