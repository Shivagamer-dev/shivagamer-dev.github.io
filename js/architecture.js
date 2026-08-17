/* ============================================================
   ARCHITECTURE — Full-Stack Architecture Data Flow
   ============================================================ */

export function initArchitecture() {
  // Animate data flow dots
  const dots = document.querySelectorAll('.arch-connector .dot');
  if (!dots.length) return;

  dots.forEach((dot, i) => {
    dot.style.animationDelay = `${i * 0.3}s`;
  });
}
