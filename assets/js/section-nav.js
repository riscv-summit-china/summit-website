export function initSectionNav() {
  const nav = document.querySelector('.info-section-nav');
  if (!nav) return;

  const links = Array.from(nav.querySelectorAll('a[href^="#"]'));
  if (links.length === 0) return;

  const sectionMap = new Map();
  links.forEach(link => {
    const hash = link.getAttribute('href');
    if (!hash || hash.length <= 1) return;
    const id = hash.slice(1);
    const target = document.getElementById(id);
    if (target) {
      sectionMap.set(target, link);
    }
  });

  const targets = Array.from(sectionMap.keys());
  if (targets.length === 0) return;

  function setActiveLink(activeLink) {
    links.forEach(l => {
      l.classList.remove('is-active');
      if (l.parentElement && l.parentElement.tagName === 'LI') {
        l.parentElement.classList.remove('is-active');
      }
    });
    if (activeLink) {
      activeLink.classList.add('is-active');
      if (activeLink.parentElement && activeLink.parentElement.tagName === 'LI') {
        activeLink.parentElement.classList.add('is-active');
      }
      if (window.innerWidth <= 980) {
        activeLink.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }

  let isClickScrolling = false;
  let clickTimeout = null;

  links.forEach(link => {
    link.addEventListener('click', () => {
      setActiveLink(link);
      isClickScrolling = true;
      clearTimeout(clickTimeout);
      clickTimeout = setTimeout(() => {
        isClickScrolling = false;
      }, 800);
    });
  });

  function updateActiveOnScroll() {
    if (isClickScrolling) return;
    const headerOffset = 150;
    const scrollPos = window.scrollY + headerOffset;

    let currentTarget = null;
    for (let i = 0; i < targets.length; i++) {
      const target = targets[i];
      const top = target.getBoundingClientRect().top + window.scrollY;
      if (scrollPos >= top - 20) {
        currentTarget = target;
      } else {
        break;
      }
    }

    if (currentTarget) {
      const link = sectionMap.get(currentTarget);
      if (link && !link.classList.contains('is-active')) {
        setActiveLink(link);
      }
    } else if (targets.length > 0) {
      setActiveLink(links[0]);
    }
  }

  window.addEventListener('scroll', updateActiveOnScroll, { passive: true });
  window.addEventListener('resize', updateActiveOnScroll, { passive: true });
  updateActiveOnScroll();
}
