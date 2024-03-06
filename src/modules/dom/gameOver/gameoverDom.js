require('./gameover.css');
const createOverlay = require('../overlay/overlayDom');

function createGameOverOverlay(message) {
  const overlay = createOverlay();
  overlay.classList.add('game-over-overlay');

  const infoPanel = document.createElement('div');
  infoPanel.classList.add('game-over-info-panel');
  overlay.appendChild(infoPanel);

  const overlayInfoText = document.createElement('div');
  overlayInfoText.classList.add('game-over-message');
  overlayInfoText.innerText = message;
  infoPanel.appendChild(overlayInfoText);

  const playAgainButton = document.createElement('button');
  playAgainButton.classList.add('play-again-button');
  playAgainButton.type = 'button';
  playAgainButton.innerText = 'Play Again';
  infoPanel.appendChild(playAgainButton);

  return { overlay, overlayInfoText, playAgainButton };
}

module.exports = createGameOverOverlay;
