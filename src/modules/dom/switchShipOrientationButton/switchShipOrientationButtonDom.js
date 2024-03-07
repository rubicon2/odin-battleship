require('./switchShipOrientationButton.css');

function createSwitchShipOrientationButton() {
  const switchShipOrientationButton = document.createElement('button');
  switchShipOrientationButton.classList.add('switch-ship-orientation-button');
  switchShipOrientationButton.type = 'button';
  switchShipOrientationButton.innerText = 'Horizontal';
  return switchShipOrientationButton;
}

module.exports = createSwitchShipOrientationButton;
