(() => {
  const ORIGINAL_SCRIPT = "https://cdn.jsdelivr.net/gh/policypal1/crawlspace@76bbd0d19aaac5956c4bb5dbecc7d00f383407ba/script.js";

  function initMobileScrollQuote() {
    const cta = document.querySelector('.desktop-quote');
    if (!cta) return;

    const update = () => {
      const mobile = window.matchMedia('(max-width: 700px)').matches;
      const shouldShow = mobile && window.scrollY > 140;
      cta.classList.toggle('mobile-scroll-quote-visible', shouldShow);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
  }

  function initInfiniteProblemCarousel() {
    if (!window.matchMedia('(max-width: 700px)').matches) return;

    const carousel = document.querySelector('#problemCarousel');
    if (!carousel || carousel.dataset.infiniteReady === 'true') return;

    const realCards = Array.from(
      carousel.querySelectorAll('.problem-card-v2:not([data-loop-clone="true"])')
    );
    if (realCards.length < 2) return;

    carousel.dataset.infiniteReady = 'true';

    // Replace the arrows so the imported script's finite-position listeners
    // are detached. We attach true looping controls below.
    const oldPrev = document.querySelector('.carousel-arrow-prev');
    const oldNext = document.querySelector('.carousel-arrow-next');
    const prev = oldPrev ? oldPrev.cloneNode(true) : null;
    const next = oldNext ? oldNext.cloneNode(true) : null;
    if (oldPrev && prev) oldPrev.replaceWith(prev);
    if (oldNext && next) oldNext.replaceWith(next);

    const lastClone = realCards[realCards.length - 1].cloneNode(true);
    const firstClone = realCards[0].cloneNode(true);

    [lastClone, firstClone].forEach((clone) => {
      clone.dataset.loopClone = 'true';
      clone.setAttribute('aria-hidden', 'true');
      clone.tabIndex = -1;
      clone.classList.remove('is-selected');
      clone.setAttribute('aria-pressed', 'false');

      clone.addEventListener('click', () => {
        const value = clone.dataset.problem;
        const match = realCards.find((card) => card.dataset.problem === value);
        if (match) match.click();
      });
    });

    carousel.insertBefore(lastClone, realCards[0]);
    carousel.appendChild(firstClone);

    const allCards = () => Array.from(carousel.querySelectorAll('.problem-card-v2'));

    function targetLeft(card) {
      return card.offsetLeft - (carousel.clientWidth - card.clientWidth) / 2;
    }

    function jumpToCard(card) {
      const oldBehavior = carousel.style.scrollBehavior;
      carousel.style.scrollBehavior = 'auto';
      carousel.scrollLeft = targetLeft(card);
      carousel.style.scrollBehavior = oldBehavior;
    }

    function smoothToCard(card) {
      carousel.scrollTo({ left: targetLeft(card), behavior: 'smooth' });
    }

    function closestIndex() {
      const cards = allCards();
      const center = carousel.scrollLeft + carousel.clientWidth / 2;
      let best = 0;
      let bestDistance = Infinity;

      cards.forEach((card, index) => {
        const cardCenter = card.offsetLeft + card.clientWidth / 2;
        const distance = Math.abs(cardCenter - center);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = index;
        }
      });

      return best;
    }

    function normalizeLoopPosition() {
      const cards = allCards();
      const index = closestIndex();

      // [last clone] [real 1 ... real N] [first clone]
      if (index === 0) {
        jumpToCard(cards[cards.length - 2]);
      } else if (index === cards.length - 1) {
        jumpToCard(cards[1]);
      }
    }

    let normalizeTimer;
    carousel.addEventListener('scroll', () => {
      clearTimeout(normalizeTimer);
      normalizeTimer = setTimeout(normalizeLoopPosition, 90);
    }, { passive: true });

    if (prev) {
      prev.disabled = false;
      prev.addEventListener('click', () => {
        const cards = allCards();
        const index = closestIndex();
        const target = Math.max(0, index - 1);
        smoothToCard(cards[target]);
      });
    }

    if (next) {
      next.disabled = false;
      next.addEventListener('click', () => {
        const cards = allCards();
        const index = closestIndex();
        const target = Math.min(cards.length - 1, index + 1);
        smoothToCard(cards[target]);
      });
    }

    // Start on the first REAL card, leaving the last-card clone visible on the left.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        jumpToCard(allCards()[1]);
      });
    });

    window.addEventListener('resize', () => {
      if (!window.matchMedia('(max-width: 700px)').matches) return;
      const cards = allCards();
      const index = Math.min(Math.max(closestIndex(), 1), cards.length - 2);
      jumpToCard(cards[index]);
    }, { passive: true });
  }

  initMobileScrollQuote();

  const original = document.createElement('script');
  original.src = ORIGINAL_SCRIPT;
  original.async = false;
  original.onload = initInfiniteProblemCarousel;
  document.head.appendChild(original);
})();
