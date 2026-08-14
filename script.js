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
   PROBLEM SELECTOR
========================= */

const problemCards = document.querySelectorAll('.problem-card');
const selectedProblemInput = document.querySelector('#selectedProblem');
const problemSelectionMessage = document.querySelector(
  '#problemSelectionMessage'
);
const problemContinue = document.querySelector('#problemContinue');

function selectProblem(selectedCard) {
  if (!selectedCard) return;

  const selectedValue =
    selectedCard.dataset.problem || '';

  problemCards.forEach((card) => {
    const isSelected =
      card === selectedCard;

    card.classList.toggle(
      'is-selected',
      isSelected
    );

    card.setAttribute(
      'aria-pressed',
      String(isSelected)
    );
  });

  if (selectedProblemInput) {
    selectedProblemInput.value =
      selectedValue;
  }

  if (problemSelectionMessage) {
    problemSelectionMessage.textContent =
      `Selected: ${selectedValue}`;
  }

  if (problemContinue) {
    problemContinue.classList.remove(
      'is-disabled'
    );

    problemContinue.setAttribute(
      'aria-disabled',
      'false'
    );

    problemContinue.removeAttribute(
      'tabindex'
    );
  }
}

problemCards.forEach((card) => {
  card.addEventListener(
    'click',
    () => {
      selectProblem(card);
    }
  );
});

if (problemContinue) {
  problemContinue.addEventListener(
    'click',
    (event) => {
      if (
        problemContinue.getAttribute(
          'aria-disabled'
        ) === 'true'
      ) {
        event.preventDefault();
      }
    }
  );
}
