/* ═══════════════════════════════════════════════════════════
   THE GOAT RESTAURANT — MAIN.JS  (v2 - fully fixed)
   ═══════════════════════════════════════════════════════════ */
'use strict';

/* ─── LOADER ─────────────────────────────────────────────── */
(function initLoader() {
  document.body.classList.add('loading');
  const loader = document.getElementById('loader');

  function hideLoader() {
    loader.classList.add('hidden');
    document.body.classList.remove('loading');
  }

  // Hide after 2.8s regardless of load state
  setTimeout(hideLoader, 2800);
  window.addEventListener('load', () => setTimeout(hideLoader, 2000));
})();

/* ─── SMOOTH SCROLL ──────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const navH = document.getElementById('navbar').offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
    closeMobileMenu();
  });
});

/* ─── NAVBAR SCROLL ──────────────────────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ─── MOBILE MENU ────────────────────────────────────────── */
function closeMobileMenu() {
  document.getElementById('mobile-menu').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
}

(function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  hamburger.addEventListener('click', e => {
    e.stopPropagation();
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
  });
  document.addEventListener('click', e => {
    if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
      closeMobileMenu();
    }
  });
})();

/* ─── BACK TO TOP ────────────────────────────────────────── */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ─── MENU TABS ──────────────────────────────────────────── */
(function initMenuTabs() {
  const btns = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      btns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = document.getElementById('tab-' + target);
      if (panel) panel.classList.add('active');
    });
  });
})();

/* ─── GALLERY FILTER + MODAL ─────────────────────────────── */
(function initGallery() {
  const filters = document.querySelectorAll('.gfilter');
  const items   = document.querySelectorAll('.gal-item');
  const modal   = document.getElementById('galleryModal');
  const modalImg= document.getElementById('modalImg');
  const modalCap= document.getElementById('modalCaption');

  // Filter
  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      items.forEach(item => {
        item.classList.toggle('hidden', f !== 'all' && !item.classList.contains(f));
      });
    });
  });

  // Modal open
  items.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (!img) return;
      modalImg.src  = img.src.replace('w=500', 'w=1200');
      modalImg.alt  = img.alt;
      modalCap.textContent = item.dataset.caption || img.alt;
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  // Modal close
  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
  document.getElementById('modalOverlay').addEventListener('click', closeModal);
  document.getElementById('modalClose').addEventListener('click',   closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
})();

/* ─── FAQ ACCORDION ──────────────────────────────────────── */
(function initFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-q').addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
})();

/* ─── COUNTDOWN TIMER ────────────────────────────────────── */
(function initCountdown() {
  const hEl = document.getElementById('cd-h');
  const mEl = document.getElementById('cd-m');
  const sEl = document.getElementById('cd-s');
  if (!hEl) return;

  function pad(n) { return String(n).padStart(2, '0'); }

  function update() {
    const now    = new Date();
    const target = new Date();
    target.setHours(23, 59, 59, 0);
    const diff = Math.max(0, target - now);
    hEl.textContent = pad(Math.floor(diff / 3600000));
    mEl.textContent = pad(Math.floor((diff % 3600000) / 60000));
    sEl.textContent = pad(Math.floor((diff % 60000) / 1000));
  }
  update();
  setInterval(update, 1000);
})();

/* ─── RATINGS COUNT-UP ───────────────────────────────────── */
(function initCountUp() {
  const scoreEl   = document.getElementById('countScore');
  const reviewsEl = document.getElementById('countReviews');
  if (!scoreEl) return;

  let started = false;
  const section = document.querySelector('.section-ratings');
  if (!section) return;

  const io = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !started) {
      started = true;
      io.disconnect();
      animateNum(scoreEl,   0,    4.9,  1800, true);
      animateNum(reviewsEl, 0, 2547,    2000, false);
    }
  }, { threshold: 0.4 });
  io.observe(section);

  function animateNum(el, from, to, dur, isFloat) {
    const start = performance.now();
    (function step(ts) {
      const p = Math.min((ts - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      const val  = from + (to - from) * ease;
      el.textContent = isFloat ? val.toFixed(1) : Math.round(val).toLocaleString('en-IN');
      if (p < 1) requestAnimationFrame(step);
    })(start);
  }
})();

/* ─── ADD TO ORDER TOAST ─────────────────────────────────── */
(function initAddButtons() {
  const toast = document.getElementById('cartToast');
  let timer;
  document.addEventListener('click', e => {
    if (e.target.classList.contains('btn-add') || e.target.classList.contains('btn-add-sm')) {
      toast.classList.add('show');
      clearTimeout(timer);
      timer = setTimeout(() => toast.classList.remove('show'), 2200);
      const btn = e.target;
      btn.style.transform = 'scale(0.88)';
      setTimeout(() => { btn.style.transform = ''; }, 160);
    }
  });
})();

/* ─── BOOKING FORM ───────────────────────────────────────── */
(function initBookingForm() {
  const form    = document.getElementById('bookingForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name   = form.querySelector('[name="name"]').value.trim();
    const date   = form.querySelector('[name="date"]').value;
    const time   = form.querySelector('[name="time"]').value;
    const guests = form.querySelector('[name="guests"]').value;

    if (!name || !date || !time || !guests) {
      const btn = form.querySelector('[type="submit"]');
      btn.style.animation = 'shake 0.4s ease';
      setTimeout(() => { btn.style.animation = ''; }, 400);
      return;
    }
    form.style.display = 'none';
    success.classList.add('show');
  });
})();

/* ─── NEWSLETTER ─────────────────────────────────────────── */
(function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button');
    const inp = form.querySelector('input');
    btn.textContent = '✓ Subscribed!';
    btn.style.background = '#00A862';
    inp.value = '';
    inp.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Subscribe';
      btn.style.background = '';
      inp.disabled = false;
    }, 4000);
  });
})();

/* ─── ACTIVE NAV HIGHLIGHT ───────────────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
      }
    });
  }, { threshold: 0.3 });
  sections.forEach(s => io.observe(s));
})();

/* ─── SHAKE KEYFRAME ─────────────────────────────────────── */
const style = document.createElement('style');
style.textContent = '@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}';
document.head.appendChild(style);

console.log('%c🐐 THE GOAT — Legendary.', 'color:#FF6B35;font-size:16px;font-weight:bold;');