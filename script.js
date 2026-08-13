const header = document.querySelector('.site-header');

function updateHeaderShadow() {
  if (!header) return;
  header.classList.toggle('is-scrolled', window.scrollY > 4);
}

updateHeaderShadow();
window.addEventListener('scroll', updateHeaderShadow, { passive: true });
