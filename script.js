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

function getCurrentCarouselIndex() {
  if (!problemCarousel || !problemCards.length) return 0;

  const step = getScrollStep();

  return Math.max(
    0,
    Math.min(
      problemCards.length - 1,
      Math.round(problemCarousel.scrollLeft / step)
    )
  );
}

function scrollToCarouselIndex(index) {
  if (!problemCarousel || !problemCards.length) return;

  const wrappedIndex =
    (index + problemCards.length) %
    problemCards.length;

  problemCarousel.scrollTo({
    left: wrappedIndex * getScrollStep(),
    behavior: 'smooth'
  });
}

function updateCarouselState() {
  if (!problemCarousel || !problemCards.length) return;

  /* Arrows intentionally stay active on mobile so
     7 -> 1 and 1 -> 7 loop continuously. */
  if (carouselPrev) {
    carouselPrev.disabled = !mobileCarouselActive();
  }

  if (carouselNext) {
    carouselNext.disabled = !mobileCarouselActive();
  }
}

if (carouselPrev && problemCarousel) {
  carouselPrev.addEventListener('click', () => {
    if (!mobileCarouselActive()) return;

    const currentIndex =
      getCurrentCarouselIndex();

    scrollToCarouselIndex(
      currentIndex - 1
    );
  });
}

if (carouselNext && problemCarousel) {
  carouselNext.addEventListener('click', () => {
    if (!mobileCarouselActive()) return;

    const currentIndex =
      getCurrentCarouselIndex();

    scrollToCarouselIndex(
      currentIndex + 1
    );
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
