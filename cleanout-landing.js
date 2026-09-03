(() => {
  const FORM_ENDPOINT = "https://script.google.com/macros/s/AKfycbzm5ZaVzeXJXtDjgMX0DtcKd3st0myj5Rp7qGQtQY_wu3lmVjb3Hvu2S7Si9OJXe9RR/exec";

  const form = document.querySelector('#quoteForm');
  if (form) {
    const submit = form.querySelector('.form-submit');
    const original = submit.textContent;
    const status = document.createElement('div');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    submit.insertAdjacentElement('afterend', status);

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (form.dataset.submitting === 'true') return;
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      form.dataset.submitting = 'true';
      submit.disabled = true;
      submit.textContent = 'Sending Request…';
      status.className = '';
      status.textContent = '';

      try {
        const payload = new URLSearchParams();
        const data = new FormData(form);
        data.forEach((value, key) => payload.append(key, String(value)));
        payload.append('page_url', window.location.href);

        await fetch(FORM_ENDPOINT, { method: 'POST', mode: 'no-cors', body: payload });

        form.reset();
        status.className = 'form-status success';
        status.textContent = 'Thanks. Your cleanout estimate request was sent. We’ll be in touch soon.';
        submit.textContent = 'Request Sent ✓';

        // Optional Google Ads / GA4 conversion hook. If gtag is installed globally,
        // this records the successful form submission without breaking the page if it is not.
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'generate_lead', {
            event_category: 'Crawl Space Cleanout',
            event_label: 'Estimate Form Submission'
          });
        }

        window.setTimeout(() => { submit.textContent = original; }, 3500);
      } catch (error) {
        console.error('Quote form submission failed:', error);
        status.className = 'form-status error';
        status.textContent = 'Something went wrong. Please call or text (360) 470-4956.';
        submit.textContent = original;
      } finally {
        form.dataset.submitting = 'false';
        submit.disabled = false;
      }
    });
  }

  document.querySelectorAll('.faq-wrap details').forEach((item) => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      document.querySelectorAll('.faq-wrap details').forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });
})();
