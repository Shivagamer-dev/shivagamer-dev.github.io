/* ============================================================
   ML EXPERTISE — Interactive Knowledge Map & Tabs
   ============================================================ */

export function initMLExpertise() {
  const tabs = document.querySelectorAll('.ml__tab');
  const panels = document.querySelectorAll('.ml__panel');

  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.panel;

      tabs.forEach((t) => t.classList.remove('active'));
      panels.forEach((p) => p.classList.remove('active'));

      tab.classList.add('active');
      const panel = document.getElementById(target);
      if (panel) panel.classList.add('active');
    });
  });

  /* Tooltip on method items */
  document.querySelectorAll('.ml__method-item[data-tip]').forEach((item) => {
    item.addEventListener('mouseenter', () => {
      let tip = item.querySelector('.ml-tip');
      if (!tip) {
        tip = document.createElement('div');
        tip.className = 'tooltip__content ml-tip';
        tip.textContent = item.dataset.tip;
        item.style.position = 'relative';
        item.appendChild(tip);
      }
      requestAnimationFrame(() => {
        tip.style.opacity = '1';
        tip.style.transform = 'translateX(-50%) scale(1)';
        tip.style.pointerEvents = 'auto';
      });
    });

    item.addEventListener('mouseleave', () => {
      const tip = item.querySelector('.ml-tip');
      if (tip) {
        tip.style.opacity = '0';
        tip.style.transform = 'translateX(-50%) scale(0.95)';
        tip.style.pointerEvents = 'none';
      }
    });
  });
}
