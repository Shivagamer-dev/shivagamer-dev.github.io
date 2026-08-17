/* ============================================================
   APP — Main Initialization & Global Handlers
   ============================================================ */

import { initRevealObserver, throttle } from './utils.js';
import { initHeroScene } from './hero-scene.js';
import { initProjects } from './projects.js';
import { initMLExpertise } from './ml-expertise.js';
import { initMLLab } from './ml-lab.js';
import { initSkillsNetwork } from './skills-network.js';
import { initArchitecture } from './architecture.js';
import { initTimeline } from './timeline.js';
import { initGitHubAPI } from './github-api.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Navigation
  initNavigation();

  // 2. Scroll Animations (Intersection Observers)
  initRevealObserver();

  // 3. Module Initialization
  initHeroScene();
  initProjects();
  initMLExpertise();
  initMLLab();
  initSkillsNetwork();
  initArchitecture();
  initTimeline();
  initGitHubAPI();
});

function initNavigation() {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav__toggle');
  const links = document.querySelector('.nav__links');
  const linkItems = document.querySelectorAll('.nav__link');
  const sections = document.querySelectorAll('section[id]');

  if (!nav) return;

  // Sticky nav background
  window.addEventListener('scroll', throttle(() => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    updateActiveSection();
  }, 100), { passive: true });

  // Initial check
  if (window.scrollY > 50) nav.classList.add('scrolled');
  updateActiveSection();

  // Mobile menu toggle
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = toggle.classList.toggle('open');
      links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu when clicking a link
    linkItems.forEach((link) => {
      link.addEventListener('click', () => {
        toggle.classList.remove('open');
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Active section highlighting
  function updateActiveSection() {
    let current = '';
    const scrollY = window.scrollY;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    if (!current && scrollY < 300) current = 'hero';

    linkItems.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  // Smooth scroll to hero button
  const heroScroll = document.querySelector('.hero__scroll');
  if (heroScroll) {
    heroScroll.addEventListener('click', (e) => {
      e.preventDefault();
      const about = document.getElementById('about');
      if (about) {
        window.scrollTo({
          top: about.offsetTop - 64,
          behavior: 'smooth'
        });
      }
    });
  }
}
