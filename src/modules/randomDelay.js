const rangedRandomInt = require('./rangedRandomInt');

function randomDelay(minDelayInMillis, maxDelayInMillis) {
  return new Promise((resolve) => {
    setTimeout(resolve, rangedRandomInt(minDelayInMillis, maxDelayInMillis));
  });
}

module.exports = randomDelay;
