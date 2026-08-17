/* ============================================================
   PROJECTS — 3D Tilt, Hover Effects, Flow Animation
   ============================================================ */

import { initTiltEffect, prefersReducedMotion } from './utils.js';

export function initProjects() {
  /* 3D tilt on project cards */
  initTiltEffect('.project-card', 5);

  /* Animate flow diagrams inside project cards on hover */
  if (!prefersReducedMotion()) {
    document.querySelectorAll('.project-card').forEach((card) => {
      const nodes = card.querySelectorAll('.project-flow__node');
      card.addEventListener('mouseenter', () => {
        nodes.forEach((n, i) => {
          n.style.transitionDelay = `${i * 60}ms`;
          n.classList.add('highlighted');
        });
      });
      card.addEventListener('mouseleave', () => {
        nodes.forEach((n) => {
          n.style.transitionDelay = '0ms';
          n.classList.remove('highlighted');
        });
      });
    });
  }
}
