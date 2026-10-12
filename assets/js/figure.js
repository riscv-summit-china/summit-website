window.addEventListener('DOMContentLoaded', () => {
  const preview = document.querySelector('#fullPageContainer');
  if (!preview) return;

  const container = preview.querySelector('.container');
  const closeButton = preview.querySelector('.close');
  const zoomInButton = preview.querySelector('.zoom-in');
  const zoomOutButton = preview.querySelector('.zoom-out');
  const resetButton = preview.querySelector('.zoom-reset');
  const maxScale = 12;
  const pointers = new Map();
  let image;
  let stage;
  let trigger;
  let scale = 1;
  let offsetX = 0;
  let offsetY = 0;
  let pinchDistance = 0;

  function clampOffset() {
    if (!image?.naturalWidth || !stage) return;
    const fit = Math.min(stage.clientWidth / image.naturalWidth, stage.clientHeight / image.naturalHeight);
    const maxX = Math.max(0, (image.naturalWidth * fit * scale - stage.clientWidth) / 2);
    const maxY = Math.max(0, (image.naturalHeight * fit * scale - stage.clientHeight) / 2);
    offsetX = Math.max(-maxX, Math.min(maxX, offsetX));
    offsetY = Math.max(-maxY, Math.min(maxY, offsetY));
  }

  function render() {
    if (!image) return;
    clampOffset();
    image.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
    zoomOutButton.disabled = scale === 1;
    zoomInButton.disabled = scale === maxScale;
    resetButton.textContent = `${Math.round(scale * 100)}%`;
    stage.classList.toggle('is-zoomed', scale > 1);
  }

  function zoomTo(nextScale) {
    scale = Math.max(1, Math.min(maxScale, nextScale));
    if (scale === 1) {
      offsetX = 0;
      offsetY = 0;
    }
    render();
  }

  function hide() {
    preview.classList.add('hidden');
    preview.style.display = 'none';
    container.replaceChildren();
    image = undefined;
    stage = undefined;
    pointers.clear();
    pinchDistance = 0;
    trigger?.focus();
  }

  function show(figure, opener) {
    const source = figure.querySelector('img');
    if (!source) return;
    trigger = opener;
    stage = document.createElement('figure');
    image = source.cloneNode(true);
    image.removeAttribute('loading');
    image.draggable = false;
    stage.appendChild(image);
    const caption = figure.querySelector('figcaption');
    if (caption) stage.appendChild(caption.cloneNode(true));
    container.replaceChildren(stage);
    scale = 1;
    offsetX = 0;
    offsetY = 0;
    render();
    preview.classList.remove('hidden');
    preview.style.display = '';
    closeButton.focus();
  }

  function distance() {
    const [first, second] = [...pointers.values()];
    return Math.hypot(first.x - second.x, first.y - second.y);
  }

  document.querySelectorAll('figure .image-preview-trigger').forEach((button) => {
    button.addEventListener('click', () => show(button.closest('figure'), button));
  });
  closeButton.addEventListener('click', hide);
  zoomInButton.addEventListener('click', () => zoomTo(scale * 1.5));
  zoomOutButton.addEventListener('click', () => zoomTo(scale / 1.5));
  resetButton.addEventListener('click', () => zoomTo(1));
  preview.addEventListener('click', (event) => {
    if (event.target === preview) hide();
  });
  container.addEventListener('wheel', (event) => {
    if (!image) return;
    event.preventDefault();
    zoomTo(scale * (event.deltaY < 0 ? 1.2 : 1 / 1.2));
  }, { passive: false });
  container.addEventListener('dblclick', () => zoomTo(scale === 1 ? 2 : 1));
  container.addEventListener('pointerdown', (event) => {
    if (!stage) return;
    stage.setPointerCapture(event.pointerId);
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.size === 2) pinchDistance = distance();
  });
  container.addEventListener('pointermove', (event) => {
    const previous = pointers.get(event.pointerId);
    if (!previous) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.size === 2) {
      const nextDistance = distance();
      if (pinchDistance) zoomTo(scale * nextDistance / pinchDistance);
      pinchDistance = nextDistance;
    } else if (scale > 1) {
      offsetX += event.clientX - previous.x;
      offsetY += event.clientY - previous.y;
      render();
    }
  });
  function releasePointer(event) {
    pointers.delete(event.pointerId);
    pinchDistance = 0;
  }
  container.addEventListener('pointerup', releasePointer);
  container.addEventListener('pointercancel', releasePointer);
  window.addEventListener('resize', render);
  document.addEventListener('keydown', (event) => {
    if (preview.classList.contains('hidden')) return;
    if (event.key === 'Escape') hide();
    if (event.key === '+' || event.key === '=') zoomTo(scale * 1.5);
    if (event.key === '-') zoomTo(scale / 1.5);
    if (event.key === '0') zoomTo(1);
  });
});
