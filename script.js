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

    const isOpen =
      menuToggle.getAttribute('aria-expanded') === 'true';

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


/* =========================
   SECTION 3 SELECTOR
   Grid on desktop, carousel on mobile
========================= */

const problemCarousel = document.querySelector('#problemCarousel');
const problemCards = Array.from(document.querySelectorAll('.problem-card-v2'));
const selectedProblemInput = document.querySelector('#selectedProblem');
const carouselPrev = document.querySelector('.carousel-arrow-prev');
const carouselNext = document.querySelector('.carousel-arrow-next');
const carouselCount = document.querySelector('#carouselCount');

function selectProblem(card) {
  if (!card) return;

  problemCards.forEach((item) => {
    const selected = item === card;
    item.classList.toggle('is-selected', selected);
    item.setAttribute('aria-pressed', String(selected));
  });

  if (selectedProblemInput) {
    selectedProblemInput.value = card.dataset.problem || '';
  }
}

problemCards.forEach((card) => {
  card.addEventListener('click', () => {
    selectProblem(card);
  });
});

function mobileCarouselActive() {
  return window.matchMedia('(max-width: 700px)').matches;
}

function getScrollStep() {
  if (!problemCarousel || !problemCards.length) return 320;

  const card = problemCards[0];
  const styles = window.getComputedStyle(problemCarousel);
  const gap = parseFloat(styles.columnGap || styles.gap || '0') || 0;

  return card.getBoundingClientRect().width + gap;
}

function updateCarouselState() {
  if (!problemCarousel || !problemCards.length) return;

  if (!mobileCarouselActive()) {
    if (carouselPrev) carouselPrev.disabled = true;
    if (carouselNext) carouselNext.disabled = true;
    if (carouselCount) carouselCount.textContent = `1 / ${problemCards.length}`;
    return;
  }

  const step = getScrollStep();
  const index = Math.max(
    0,
    Math.min(
      problemCards.length - 1,
      Math.round(problemCarousel.scrollLeft / step)
    )
  );

  if (carouselCount) {
    carouselCount.textContent = `${index + 1} / ${problemCards.length}`;
  }

  const maxScroll =
    problemCarousel.scrollWidth -
    problemCarousel.clientWidth -
    2;

  if (carouselPrev) {
    carouselPrev.disabled =
      problemCarousel.scrollLeft <= 2;
  }

  if (carouselNext) {
    carouselNext.disabled =
      problemCarousel.scrollLeft >= maxScroll;
  }
}

if (carouselPrev && problemCarousel) {
  carouselPrev.addEventListener('click', () => {
    if (!mobileCarouselActive()) return;

    problemCarousel.scrollBy({
      left: -getScrollStep(),
      behavior: 'smooth'
    });
  });
}

if (carouselNext && problemCarousel) {
  carouselNext.addEventListener('click', () => {
    if (!mobileCarouselActive()) return;

    problemCarousel.scrollBy({
      left: getScrollStep(),
      behavior: 'smooth'
    });
  });
}

if (problemCarousel) {
  let ticking = false;

  problemCarousel.addEventListener('scroll', () => {
    if (ticking) return;

    ticking = true;

    window.requestAnimationFrame(() => {
      updateCarouselState();
      ticking = false;
    });
  });
}

window.addEventListener('resize', updateCarouselState);

updateCarouselState();
