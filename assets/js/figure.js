function hideFullPageImage(container) {
  container.classList.add('hidden');
  container.style.display = 'none';
  container.querySelector('div.container').innerHTML = '';
}
function showFullPageImage(figure, container) {
  const realContainer = container.querySelector('div.container');
  const fig = document.createElement('figure');
  const img = figure.querySelector('img');
  if (!img) return;
  const imgClone = img.cloneNode(true);
  const cap = figure.querySelector('figcaption');
  realContainer.innerHTML = '';
  fig.appendChild(imgClone);
  if (cap) fig.appendChild(cap.cloneNode(true));
  realContainer.appendChild(fig);
  container.classList.remove('hidden');
  container.style.display = '';
  container.querySelector('.close').focus();
}

window.addEventListener('DOMContentLoaded', () => {
  const allFigures = document.querySelectorAll('figure');
  const fullPageContainer = document.querySelector('#fullPageContainer');
  const fullPageContainerClose = document.querySelector('#fullPageContainer >.close');
  if (!fullPageContainer || !fullPageContainerClose) return;
  allFigures.forEach((ele) => {
    ele.addEventListener('click', (event) => {
      if (ele.querySelector('.image-preview-trigger')) event.preventDefault();
      showFullPageImage(ele, fullPageContainer);
    });
  });
  fullPageContainerClose.addEventListener('click', (event) => {
    event.stopPropagation();
    hideFullPageImage(fullPageContainer);
  });
  fullPageContainer.addEventListener('click', (event) => {
    if (event.target === fullPageContainer) hideFullPageImage(fullPageContainer);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !fullPageContainer.classList.contains('hidden')) {
      hideFullPageImage(fullPageContainer);
    }
  });
});
