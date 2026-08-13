const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

function setMenu(open) {
  if (!menuToggle || !mobileMenu) return;

  menuToggle.classList.toggle('is-open', open);
  mobileMenu.classList.toggle('is-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  mobileMenu.setAttribute('aria-hidden', String(!open));
}

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', (event) => {
    event.stopPropagation();
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    setMenu(!isOpen);
  });

  mobileMenu.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      setMenu(false);
    }
  });

  document.addEventListener('click', (event) => {
    if (
      menuToggle.getAttribute('aria-expanded') === 'true' &&
      !mobileMenu.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      setMenu(false);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setMenu(false);
      menuToggle.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 700) {
      setMenu(false);
    }
  });
}
