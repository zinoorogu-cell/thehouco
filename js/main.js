/* ============================================================
   THE HOU CO. — Global JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Navbar scroll effect ── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // run on load
  }

  /* ── Active nav link ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar__menu a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Mobile nav ── */
  const hamburger = document.querySelector('.navbar__hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Scroll reveal animations ── */
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealElements.forEach(el => revealObserver.observe(el));
  }

  /* ── Counter animation ── */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.dataset.count, 10);
            const suffix = el.dataset.suffix || '';
            const duration = 1600;
            const start = performance.now();
            const animate = (now) => {
              const elapsed = now - start;
              const progress = Math.min(elapsed / duration, 1);
              const ease = 1 - Math.pow(1 - progress, 3);
              el.textContent = Math.round(ease * target) + suffix;
              if (progress < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
            countObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(el => countObserver.observe(el));
  }

  /* ── Rates currency toggle ── */
  const currencyButtons = document.querySelectorAll('.currency-toggle');
  const ratePrices = document.querySelectorAll('.rate-price[data-base-gbp]');
  if (currencyButtons.length && ratePrices.length) {
    const exchangeRates = {
      gbp: 1,
      usd: 1.28,
      ngn: 2100
    };

    const currencySymbols = {
      gbp: '£',
      usd: '$',
      ngn: '₦'
    };

    const roundAmount = (amount, currency) => {
      if (currency === 'ngn') return Math.round(amount / 10000) * 10000;
      if (currency === 'usd') return Math.round(amount / 10) * 10;
      return Math.round(amount);
    };

    const formatAmount = (amount, currency) => {
      const rounded = roundAmount(amount, currency);
      return `${currencySymbols[currency]}${rounded.toLocaleString('en-GB')}`;
    };

    const updateRates = (currency) => {
      currencyButtons.forEach(button => {
        const isActive = button.dataset.currency === currency;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
      });

      ratePrices.forEach(price => {
        const baseGbp = Number(price.dataset.baseGbp || 0);
        const convertedAmount = baseGbp * exchangeRates[currency];
        price.textContent = formatAmount(convertedAmount, currency);
      });
    };

    currencyButtons.forEach(button => {
      button.addEventListener('click', () => updateRates(button.dataset.currency));
    });

    updateRates(document.querySelector('.currency-toggle.active')?.dataset.currency || 'gbp');
  }

  /* ── FAQ accordion ── */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (question && answer) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        faqItems.forEach(i => {
          i.classList.remove('open');
          const a = i.querySelector('.faq-answer');
          if (a) a.style.maxHeight = '0';
        });
        if (!isOpen) {
          item.classList.add('open');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    }
  });

  /* ── Contact form ── */
  const contactForm = document.querySelector('#contact-form');
  const formSuccess = document.querySelector('.form-success');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('.form-submit');
      btn.textContent = 'Sending...';
      btn.disabled = true;
      // Simulate submission
      setTimeout(() => {
        contactForm.style.display = 'none';
        if (formSuccess) formSuccess.style.display = 'block';
      }, 1500);
    });
  }

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});

/* ── Logo Carousel ── */
(function() {
  const track = document.getElementById('logoTrack');
  if (!track) return;
  const slides = track.querySelectorAll('.logo-slide');
  let visible = 4;
  let current = 0;
  const total = slides.length;

  function getVisible() {
    if (window.innerWidth <= 480) return 2;
    if (window.innerWidth <= 768) return 3;
    return 4;
  }

  function update() {
    visible = getVisible();
    const max = total - visible;
    if (current > max) current = max;
    track.style.transform = `translateX(-${current * (100 / visible)}%)`;
    slides.forEach(s => s.style.minWidth = `${100 / visible}%`);
  }

  document.querySelector('.logo-carousel-btn--prev')?.addEventListener('click', () => {
    visible = getVisible();
    current = Math.max(0, current - 1);
    update();
  });
  document.querySelector('.logo-carousel-btn--next')?.addEventListener('click', () => {
    visible = getVisible();
    const max = total - visible;
    current = current >= max ? 0 : current + 1;
    update();
  });

  window.addEventListener('resize', update);
  update();

  // Auto-advance logos
  setInterval(() => {
    visible = getVisible();
    const max = total - visible;
    current = current >= max ? 0 : current + 1;
    update();
  }, 3000);
})();

/* ── Testimonials Carousel ── */
(function() {
  const track = document.getElementById('testimonialsTrack');
  if (!track) return;
  const slides = track.querySelectorAll('.testimonials-slide');
  const dots = document.querySelectorAll('.testimonials-dot');
  let current = 0;
  const total = slides.length;

  function goTo(idx) {
    current = (idx + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  document.querySelector('.testimonials-btn--prev')?.addEventListener('click', () => goTo(current - 1));
  document.querySelector('.testimonials-btn--next')?.addEventListener('click', () => goTo(current + 1));
  dots.forEach(d => d.addEventListener('click', () => goTo(+d.dataset.index)));

  // Auto-advance every 6s
  setInterval(() => goTo(current + 1), 6000);
})();
