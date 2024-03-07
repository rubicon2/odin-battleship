require('./switchShipOrientationButton.css');

const downArrow = '\u2193';
const rightArrow = '\u2192';

function createSwitchShipOrientationButton() {
  const switchShipOrientationButton = document.createElement('button');
  switchShipOrientationButton.classList.add('switch-ship-orientation-button');
  switchShipOrientationButton.type = 'button';
  switchShipOrientationButton.innerText = rightArrow;
  return switchShipOrientationButton;
}

module.exports = { createSwitchShipOrientationButton, downArrow, rightArrow };
