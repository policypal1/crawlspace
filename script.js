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
   IMAGE PROBLEM CAROUSEL
========================= */

const problemCarousel = document.querySelector('#problemCarousel');
const problemCards = Array.from(document.querySelectorAll('.problem-card-v2'));
const selectedProblemInput = document.querySelector('#selectedProblem');
const problemSelectionMessage = document.querySelector('#problemSelectionMessage');
const problemContinue = document.querySelector('#problemContinue');
const carouselPrev = document.querySelector('.carousel-arrow-prev');
const carouselNext = document.querySelector('.carousel-arrow-next');
const carouselCount = document.querySelector('#carouselCount');

const inspectionSection = document.querySelector('#quote');
const inspectionTitle = document.querySelector('#inspectionTitle');
const inspectionCopy = document.querySelector('#inspectionCopy');
const inspectionConcern = document.querySelector('#inspectionConcern');
const inspectionChecks = document.querySelector('#inspectionChecks');
const inspectionServices = document.querySelector('#inspectionServices');

function splitData(value) {
  return (value || '').split('|').map(item => item.trim()).filter(Boolean);
}

function renderList(container, values, tagName = 'li') {
  if (!container) return;
  container.innerHTML = '';

  values.forEach(value => {
    const item = document.createElement(tagName);
    item.textContent = value;
    container.appendChild(item);
  });
}

function updateInspectionPlan(card) {
  if (!card) return;

  const problem = card.dataset.problem || 'Selected crawl space concern';
  const title = card.dataset.planTitle || 'We’ll inspect the problem first.';
  const copy = card.dataset.planCopy || '';
  const services = splitData(card.dataset.services);
  const checks = splitData(card.dataset.checks);

  if (inspectionTitle) inspectionTitle.textContent = title;
  if (inspectionCopy) inspectionCopy.textContent = copy;
  if (inspectionConcern) inspectionConcern.textContent = problem;

  renderList(inspectionChecks, checks, 'li');
  renderList(inspectionServices, services, 'span');
}

function selectProblem(card) {
  if (!card) return;

  problemCards.forEach(item => {
    const selected = item === card;
    item.classList.toggle('is-selected', selected);
    item.setAttribute('aria-pressed', String(selected));
  });

  const problem = card.dataset.problem || '';

  if (selectedProblemInput) selectedProblemInput.value = problem;
  if (problemSelectionMessage) {
    problemSelectionMessage.textContent = `${problem} selected. We’ll tailor the next section around this concern.`;
  }

  if (problemContinue) {
    problemContinue.disabled = false;
    problemContinue.classList.remove('is-disabled');
  }

  updateInspectionPlan(card);
}

problemCards.forEach(card => {
  card.addEventListener('click', () => selectProblem(card));
});

if (problemContinue) {
  problemContinue.addEventListener('click', () => {
    if (problemContinue.disabled || !inspectionSection) return;
    inspectionSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

function getScrollStep() {
  if (!problemCards.length) return 320;
  const first = problemCards[0];
  const styles = window.getComputedStyle(problemCarousel);
  const gap = parseFloat(styles.columnGap || styles.gap || 0) || 0;
  return first.getBoundingClientRect().width + gap;
}

function updateCarouselState() {
  if (!problemCarousel || !problemCards.length) return;

  const step = getScrollStep();
  const index = Math.max(0, Math.min(
    problemCards.length - 1,
    Math.round(problemCarousel.scrollLeft / step)
  ));

  if (carouselCount) {
    carouselCount.textContent = `${index + 1} / ${problemCards.length}`;
  }

  const maxScroll = problemCarousel.scrollWidth - problemCarousel.clientWidth - 2;
  if (carouselPrev) carouselPrev.disabled = problemCarousel.scrollLeft <= 2;
  if (carouselNext) carouselNext.disabled = problemCarousel.scrollLeft >= maxScroll;
}

if (carouselPrev && problemCarousel) {
  carouselPrev.addEventListener('click', () => {
    problemCarousel.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
  });
}

if (carouselNext && problemCarousel) {
  carouselNext.addEventListener('click', () => {
    problemCarousel.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
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
