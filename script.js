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


/* =========================
   QUOTE FORM
   Carry the selected problem into the final form.
   Submission endpoint still needs to be connected.
========================= */

const quoteForm = document.querySelector('#quoteForm');
const quoteProblem = document.querySelector('#quoteProblem');

function syncSelectedProblemToQuote() {
  if (!selectedProblemInput || !quoteProblem) return;

  const selectedValue = selectedProblemInput.value;

  if (!selectedValue) return;

  const matchingOption = Array.from(quoteProblem.options).find(
    (option) => option.value === selectedValue
  );

  if (matchingOption) {
    quoteProblem.value = selectedValue;
  }
}

problemCards.forEach((card) => {
  card.addEventListener('click', syncSelectedProblemToQuote);
});

if (quoteForm) {
  quoteForm.addEventListener('submit', (event) => {
    event.preventDefault();

    alert(
      'The form design is ready, but the submission endpoint still needs to be connected before launch.'
    );
  });
}


/* =========================
   REVIEW SCROLLER - LOOPING
========================= */

const reviewsScroller = document.querySelector('#reviewsScroller');
const reviewsPrev = document.querySelector('.reviews-arrow-prev');
const reviewsNext = document.querySelector('.reviews-arrow-next');

let reviewScrollLocked = false;

function getReviewCards() {
  if (!reviewsScroller) return [];
  return Array.from(reviewsScroller.querySelectorAll('.review-card'));
}

function getReviewScrollStep() {
  const cards = getReviewCards();
  if (!reviewsScroller || !cards.length) return 340;

  const styles = window.getComputedStyle(reviewsScroller);
  const gap = parseFloat(styles.gap || styles.columnGap || '0') || 0;

  return cards[0].getBoundingClientRect().width + gap;
}

function loopReviewsNext() {
  if (!reviewsScroller || reviewScrollLocked) return;

  const cards = getReviewCards();
  if (!cards.length) return;

  reviewScrollLocked = true;

  const step = getReviewScrollStep();

  reviewsScroller.scrollTo({
    left: step,
    behavior: 'smooth'
  });

  window.setTimeout(() => {
    const firstCard = reviewsScroller.querySelector('.review-card');

    if (firstCard) {
      reviewsScroller.appendChild(firstCard);
    }

    reviewsScroller.scrollLeft = 0;
    reviewScrollLocked = false;
  }, 420);
}

function loopReviewsPrev() {
  if (!reviewsScroller || reviewScrollLocked) return;

  const cards = getReviewCards();
  if (!cards.length) return;

  reviewScrollLocked = true;

  const lastCard = cards[cards.length - 1];
  const step = getReviewScrollStep();

  reviewsScroller.insertBefore(lastCard, reviewsScroller.firstElementChild);
  reviewsScroller.scrollLeft = step;

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      reviewsScroller.scrollTo({
        left: 0,
        behavior: 'smooth'
      });
    });
  });

  window.setTimeout(() => {
    reviewScrollLocked = false;
  }, 420);
}

if (reviewsNext) {
  reviewsNext.addEventListener('click', loopReviewsNext);
}

if (reviewsPrev) {
  reviewsPrev.addEventListener('click', loopReviewsPrev);
}
