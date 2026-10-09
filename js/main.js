/* The Brew Cup Cafe - one-page static site (no frameworks, no server) */

/* ------------------------------------------------------------------
   CONFIG - the only things you may need to change
   ------------------------------------------------------------------ */
const CONFIG = {
  // WhatsApp number that receives table requests (country code, digits only)
  whatsapp: '918884115566',

  // OPTIONAL: email delivery via https://web3forms.com (free).
  // Sign up with the cafe's email, paste the access key here, and a
  // "Send by Email" button appears next to the WhatsApp one.
  web3formsKey: '',
};

(function () {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- header: solid on scroll ---------- */
  const header = $('#siteHeader');
  const onScroll = () => header && header.classList.toggle('is-scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  // Expose the header height so the sticky menu tabs sit right under it on phones
  const setHeaderH = () => header && document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
  setHeaderH();
  window.addEventListener('resize', setHeaderH);
  header && header.addEventListener('transitionend', setHeaderH);

  /* ---------- mobile navigation ---------- */
  const toggle = $('#navToggle');
  const mobileNav = $('#mobileNav');
  if (toggle && mobileNav) {
    const setOpen = (open) => {
      document.body.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      mobileNav.setAttribute('aria-hidden', String(!open));
    };
    toggle.addEventListener('click', () => setOpen(!document.body.classList.contains('nav-open')));
    $$('a', mobileNav).forEach((a) => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (e) => e.key === 'Escape' && setOpen(false));
  }

  /* ---------- active nav link while scrolling ---------- */
  const sections = $$('main section[id]');
  const navLinks = $$('.nav__link');
  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === '#' + entry.target.id));
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- scroll reveal ---------- */
  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- hero slider ---------- */
  const heroSlides = $$('.hero__slide');
  const heroDots = $$('#heroDots button');
  if (heroSlides.length > 1) {
    let idx = 0; let timer;
    const go = (n) => {
      heroSlides[idx].classList.remove('is-active'); heroDots[idx] && heroDots[idx].classList.remove('is-active');
      idx = (n + heroSlides.length) % heroSlides.length;
      heroSlides[idx].classList.add('is-active'); heroDots[idx] && heroDots[idx].classList.add('is-active');
    };
    const start = () => { if (reduceMotion) return; clearInterval(timer); timer = setInterval(() => go(idx + 1), 6500); };
    heroDots.forEach((dot, i) => dot.addEventListener('click', () => { go(i); start(); }));
    start();
  }

  /* ---------- animated counters ---------- */
  const counters = $$('[data-count]');
  if (counters.length) {
    const animate = (el) => {
      const target = parseFloat(el.dataset.count);
      const decimals = parseInt(el.dataset.decimals || '0', 10);
      const suffix = el.dataset.suffix || '';
      if (reduceMotion) { el.textContent = target.toFixed(decimals) + suffix; return; }
      const t0 = performance.now();
      const tick = (now) => {
        const p = Math.min((now - t0) / 1600, 1);
        el.textContent = (target * (1 - Math.pow(1 - p, 3))).toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if ('IntersectionObserver' in window) {
      const cio = new IntersectionObserver((entries) => {
        entries.forEach((entry) => { if (entry.isIntersecting) { animate(entry.target); cio.unobserve(entry.target); } });
      }, { threshold: 0.5 });
      counters.forEach((c) => cio.observe(c));
    } else counters.forEach(animate);
  }

  /* ---------- menu tabs ---------- */
  const tabs = $$('#menuTabs .filter-btn');
  const panels = $$('.menu-panel');
  const showTab = (slug) => {
    tabs.forEach((t) => { const on = t.dataset.tab === slug; t.classList.toggle('is-active', on); t.setAttribute('aria-selected', String(on)); });
    panels.forEach((p) => p.classList.toggle('is-hidden', p.dataset.panel !== slug));
    panels.forEach((p) => $$('.menu-item', p).forEach((i) => i.classList.add('is-visible')));
  };
  tabs.forEach((t) => t.addEventListener('click', () => showTab(t.dataset.tab)));
  $$('[data-menu-tab]').forEach((a) => a.addEventListener('click', () => showTab(a.dataset.menuTab)));

  /* ---------- review slider ---------- */
  const slider = $('#testimonialSlider');
  if (slider) {
    const items = $$('.testimonial', slider); const dots = $$('.slider__dot', slider);
    let i = 0; let timer;
    const show = (n) => {
      items[i].classList.remove('is-active'); dots[i].classList.remove('is-active');
      i = (n + items.length) % items.length;
      items[i].classList.add('is-active'); dots[i].classList.add('is-active');
    };
    const auto = () => { if (reduceMotion) return; clearInterval(timer); timer = setInterval(() => show(i + 1), 7000); };
    $$('.slider__btn', slider).forEach((b) => b.addEventListener('click', () => { show(i + Number(b.dataset.dir)); auto(); }));
    dots.forEach((d, n) => d.addEventListener('click', () => { show(n); auto(); }));
    auto();
  }

  /* ---------- lightbox ---------- */
  const lb = $('#lightbox');
  if (lb) {
    const img = $('#lightboxImg'); const cap = $('#lightboxCaption');
    let links = []; let cur = 0;
    const render = () => { const a = links[cur]; img.src = a.getAttribute('href'); img.alt = a.dataset.caption || ''; cap.textContent = a.dataset.caption || ''; };
    const open = (list, n) => { links = list; cur = n; render(); lb.classList.add('is-open'); lb.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; };
    const close = () => { lb.classList.remove('is-open'); lb.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; };
    const step = (d) => { cur = (cur + d + links.length) % links.length; render(); };
    document.addEventListener('click', (e) => {
      const a = e.target.closest('[data-lightbox]'); if (!a) return;
      e.preventDefault();
      const visible = $$('[data-lightbox]'); open(visible, visible.indexOf(a));
    });
    $('#lightboxClose').addEventListener('click', close);
    $('#lightboxPrev').addEventListener('click', () => step(-1));
    $('#lightboxNext').addEventListener('click', () => step(1));
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
    document.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') close(); if (e.key === 'ArrowLeft') step(-1); if (e.key === 'ArrowRight') step(1);
    });
  }

  /* ---------- reservation form (WhatsApp + optional email) ---------- */
  const form = $('#reserveForm');
  if (form) {
    const status = $('#reserveStatus');
    const emailBtn = $('#reserveEmail');
    const today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    $$('.js-date-min', form).forEach((el) => { el.min = today.toISOString().slice(0, 10); });
    if (CONFIG.web3formsKey) emailBtn.classList.remove('is-hidden');

    const setStatus = (msg, ok) => { status.textContent = msg; status.className = 'form__status ' + (ok ? 'is-ok' : 'is-error'); };

    const read = () => {
      const f = Object.fromEntries(new FormData(form).entries());
      Object.keys(f).forEach((k) => { f[k] = String(f[k]).trim().slice(0, 600); });
      return f;
    };

    const validate = (f) => {
      if (f.website) return 'Something went wrong.';
      if (!f.date) return 'Please choose a date.';
      if (!f.time) return 'Please choose a time.';
      if (f.name.length < 2) return 'Please tell us your name.';
      if (!/^[+()\-\s\d]{7,20}$/.test(f.phone)) return 'Please enter a valid phone number.';
      return '';
    };

    const niceDate = (iso) => {
      const d = new Date(iso + 'T00:00:00');
      return isNaN(d) ? iso : d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    };

    const message = (f) =>
      `Hi The Brew Cup Cafe! I'd like to reserve a table.\n\n` +
      `Name: ${f.name}\nPhone: ${f.phone}\nDate: ${niceDate(f.date)}\nTime: ${f.time}\nGuests: ${f.guests}` +
      (f.occasion ? `\nOccasion: ${f.occasion}` : '') +
      (f.message ? `\nNotes: ${f.message}` : '');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const f = read(); const err = validate(f);
      if (err) return setStatus(err, false);
      window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(message(f))}`, '_blank', 'noopener');
      setStatus('WhatsApp has opened with your request. Just press send.', true);
    });

    emailBtn.addEventListener('click', async () => {
      const f = read(); const err = validate(f);
      if (err) return setStatus(err, false);
      emailBtn.disabled = true; setStatus('Sending...', true);
      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: CONFIG.web3formsKey,
            subject: `Table request - ${f.name}, ${f.date} ${f.time} (${f.guests} guests)`,
            from_name: 'The Brew Cup Cafe website',
            name: f.name, phone: f.phone, date: f.date, time: f.time, guests: f.guests, occasion: f.occasion, notes: f.message,
            botcheck: f.website,
          }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || 'Failed');
        form.reset();
        setStatus('Thanks! Your request has been emailed. We will confirm shortly.', true);
      } catch (err) {
        setStatus('Email could not be sent right now. Please use WhatsApp or call us.', false);
      } finally {
        emailBtn.disabled = false;
      }
    });
  }
})();
