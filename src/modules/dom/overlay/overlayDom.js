require('./overlay.css');

function createOverlay() {
  const overlayElement = document.createElement('div');
  overlayElement.classList.add('overlay');
  return overlayElement;
}

module.exports = createOverlay;
