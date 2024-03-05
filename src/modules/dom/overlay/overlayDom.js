require('./overlay.css');

function createOverlay() {
  const overlayElement = document.createElement('div');
  overlayElement.classList.add('overlay', 'invisible');
  return overlayElement;
}

module.exports = createOverlay;
