/* ============================================================
   TIMELINE — Experience & Hackathon Timeline Animations
   ============================================================ */

import { prefersReducedMotion } from './utils.js';

export function initTimeline() {
  if (prefersReducedMotion()) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2, rootMargin: '0px 0px -20px 0px' }
  );

  document.querySelectorAll('.timeline__item').forEach((item, i) => {
    item.style.transitionDelay = `${i * 0.15}s`;
    item.classList.add('reveal');
    observer.observe(item);
  });
}
