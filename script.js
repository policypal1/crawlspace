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

  initMobileScrollQuote();

  const original = document.createElement('script');
  original.src = ORIGINAL_SCRIPT;
  original.async = false;
  document.head.appendChild(original);
})();
