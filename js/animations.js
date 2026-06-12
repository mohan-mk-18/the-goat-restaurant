/* ═══════════════════════════════════════════════════════════
   THE GOAT RESTAURANT — ANIMATIONS.JS  (v2 - fixed)
   Progressive enhancement: content visible by default,
   scroll animations added only after JS confirms readiness.
   ═══════════════════════════════════════════════════════════ */
'use strict';

/* ─── SCROLL REVEAL ──────────────────────────────────────── */
(function initReveal() {
  if (!('IntersectionObserver' in window)) return;

  // Mark document ready so CSS opacity:0 activates
  document.documentElement.classList.add('js-reveal-ready');

  const els = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -10px 0px' });

  els.forEach(el => io.observe(el));

  // Hard fallback: force everything visible after 2.5s
  setTimeout(() => {
    document.querySelectorAll(
      '.reveal-up:not(.visible),.reveal-left:not(.visible),.reveal-right:not(.visible)'
    ).forEach(el => el.classList.add('visible'));
  }, 2500);
})();

/* ─── GSAP HERO PARALLAX ──────────────────────────────────── */
window.addEventListener('load', function () {
  if (typeof gsap === 'undefined') return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  // Only use GSAP for decorative parallax — NOT for show/hide
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
      gsap.to(heroBg, {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }

    // Subtle scale on section headers (purely decorative)
    gsap.utils.toArray('.section-header h2').forEach(el => {
      gsap.fromTo(el,
        { scale: 0.96 },
        {
          scale: 1,
          duration: 0.55,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true }
        }
      );
    });
  }
});