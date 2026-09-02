(() => {
  const ORIGINAL_SCRIPT = "https://cdn.jsdelivr.net/gh/policypal1/crawlspace@76bbd0d19aaac5956c4bb5dbecc7d00f383407ba/script.js";
  const FORM_ENDPOINT = "https://script.google.com/macros/s/AKfycbzm5ZaVzeXJXtDjgMX0DtcKd3st0myj5Rp7qGQtQY_wu3lmVjb3Hvu2S7Si9OJXe9RR/exec";

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

  function initQuoteFormSubmission() {
    const form = document.querySelector('#quoteForm');
    if (!form) return;

    const submitButton = form.querySelector('.quote-submit');
    if (!submitButton) return;

    const originalButtonHtml = submitButton.innerHTML;

    const status = document.createElement('div');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    status.style.display = 'none';
    status.style.marginTop = '14px';
    status.style.padding = '13px 15px';
    status.style.borderRadius = '10px';
    status.style.fontSize = '14px';
    status.style.lineHeight = '1.45';
    status.style.fontWeight = '700';
    status.style.textAlign = 'center';

    submitButton.insertAdjacentElement('afterend', status);

    function showStatus(type, message) {
      status.style.display = 'block';
      status.textContent = message;

      if (type === 'success') {
        status.style.background = '#eaf7ef';
        status.style.border = '1px solid #b8e0c5';
        status.style.color = '#176336';
      } else {
        status.style.background = '#fff0f0';
        status.style.border = '1px solid #f0b8b8';
        status.style.color = '#9f2424';
      }
    }

    function clearSelectedProblemState() {
      const selectedProblemInput = document.querySelector('#selectedProblem');
      if (selectedProblemInput) selectedProblemInput.value = '';

      document.querySelectorAll('.problem-card-v2').forEach((card) => {
        card.classList.remove('is-selected');
        card.setAttribute('aria-pressed', 'false');
      });
    }

    form.addEventListener(
      'submit',
      async (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        if (form.dataset.submitting === 'true') return;

        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }

        form.dataset.submitting = 'true';
        submitButton.disabled = true;
        submitButton.innerHTML = 'Sending Request…';
        status.style.display = 'none';

        try {
          const payload = new URLSearchParams();
          const formData = new FormData(form);

          formData.forEach((value, key) => {
            payload.append(key, String(value));
          });

          await fetch(FORM_ENDPOINT, {
            method: 'POST',
            mode: 'no-cors',
            body: payload
          });

          form.reset();
          clearSelectedProblemState();

          showStatus(
            'success',
            'Thanks. Your estimate request was sent. We’ll be in touch soon.'
          );

          submitButton.innerHTML = 'Request Sent ✓';

          window.setTimeout(() => {
            submitButton.innerHTML = originalButtonHtml;
          }, 3500);
        } catch (error) {
          console.error('Quote form submission failed:', error);

          showStatus(
            'error',
            'Something went wrong. Please call or text (360) 470-4956.'
          );

          submitButton.innerHTML = originalButtonHtml;
        } finally {
          form.dataset.submitting = 'false';
          submitButton.disabled = false;
        }
      },
      true
    );
  }

  function initClientRequestedDetails() {
    function addRequestedDetails() {
      const reviewsShell = document.querySelector('#reviews .reviews-scroller-shell');

      if (reviewsShell && !document.querySelector('#leaveGoogleReviewButton')) {
        const reviewWrap = document.createElement('div');
        reviewWrap.style.display = 'flex';
        reviewWrap.style.justifyContent = 'center';
        reviewWrap.style.alignItems = 'center';
        reviewWrap.style.width = '100%';
        reviewWrap.style.margin = '28px 0 0';

        const reviewButton = document.createElement('a');
        reviewButton.id = 'leaveGoogleReviewButton';
        reviewButton.href = 'https://g.page/r/CTLRqh0kijy5EBM/review';
        reviewButton.target = '_blank';
        reviewButton.rel = 'noopener';
        reviewButton.textContent = 'Leave a Google Review';

        reviewButton.style.display = 'inline-flex';
        reviewButton.style.alignItems = 'center';
        reviewButton.style.justifyContent = 'center';
        reviewButton.style.minHeight = '52px';
        reviewButton.style.padding = '0 24px';
        reviewButton.style.borderRadius = '8px';
        reviewButton.style.background = '#1A5A97';
        reviewButton.style.color = '#ffffff';
        reviewButton.style.textDecoration = 'none';
        reviewButton.style.fontSize = '15px';
        reviewButton.style.fontWeight = '800';
        reviewButton.style.lineHeight = '1';
        reviewButton.style.boxShadow = '0 10px 24px rgba(3, 18, 41, 0.18)';
        reviewButton.style.position = 'relative';
        reviewButton.style.zIndex = '5';

        reviewWrap.appendChild(reviewButton);
        reviewsShell.insertAdjacentElement('afterend', reviewWrap);
      }

      const footerCredit = document.querySelector('.footer-bottom .footer-credit');

      if (footerCredit && !document.querySelector('#contractorLicenseNumber')) {
        const license = document.createElement('span');
        license.id = 'contractorLicenseNumber';
        license.textContent = 'Contractor License: OUTSIOG746BH';
        footerCredit.insertAdjacentElement('beforebegin', license);
      }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', addRequestedDetails, { once: true });
    } else {
      addRequestedDetails();
    }

    // One delayed retry in case another script finishes building a section after load.
    window.setTimeout(addRequestedDetails, 300);
  }

  initMobileScrollQuote();
  initQuoteFormSubmission();
  initClientRequestedDetails();

  const original = document.createElement('script');
  original.src = ORIGINAL_SCRIPT;
  original.async = false;
  document.head.appendChild(original);
})();
