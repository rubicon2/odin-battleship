const rangedRandom = require('./rangedRandom');

function rangedRandomInt(min, max) {
  return Math.round(rangedRandom(min, max));
}

module.exports = rangedRandomInt;
