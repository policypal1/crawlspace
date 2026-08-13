(() => {
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');

  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 12);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('in-view'));
  }

  const serviceSelect = document.getElementById('service');
  document.querySelectorAll('[data-service]').forEach(link => {
    link.addEventListener('click', () => {
      const service = link.getAttribute('data-service');
      if (serviceSelect && service) {
        serviceSelect.value = service;
        window.setTimeout(() => serviceSelect.focus({ preventScroll: true }), 500);
      }
    });
  });

  const form = document.getElementById('estimateForm');
  const emailDetails = document.getElementById('emailDetails');
  const status = document.getElementById('formStatus');

  const buildMessage = () => {
    const name = document.getElementById('name')?.value.trim() || '';
    const city = document.getElementById('city')?.value.trim() || '';
    const service = document.getElementById('service')?.value || '';
    const details = document.getElementById('details')?.value.trim() || '';
    return [
      'Hi Jon, I would like a free crawl space estimate.',
      name ? `Name: ${name}` : '',
      city ? `Property city: ${city}` : '',
      service ? `Issue/service: ${service}` : '',
      details ? `What I am noticing: ${details}` : ''
    ].filter(Boolean).join('\n');
  };

  const updateEmailLink = () => {
    if (!emailDetails) return;
    const body = buildMessage();
    emailDetails.href = `mailto:jon@crawlspaceprosnw.com?subject=${encodeURIComponent('Crawl Space Estimate Request')}&body=${encodeURIComponent(body)}`;
  };

  ['name', 'city', 'service', 'details'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', updateEmailLink);
    document.getElementById(id)?.addEventListener('change', updateEmailLink);
  });
  updateEmailLink();

  if (form) {
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const message = buildMessage();
      const smsUrl = `sms:+13604704956?body=${encodeURIComponent(message)}`;
      if (status) status.textContent = 'Opening your text app. Review the message, then press send.';
      window.location.href = smsUrl;
    });
  }

  const faqItems = document.querySelectorAll('.faq-list details');
  faqItems.forEach(item => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      faqItems.forEach(other => {
        if (other !== item) other.open = false;
      });
    });
  });

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
