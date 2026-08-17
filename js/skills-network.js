/* ============================================================
   SKILLS NETWORK — Interactive Canvas Network Graph
   ============================================================ */

import { throttle, isTouchDevice, prefersReducedMotion } from './utils.js';

export function initSkillsNetwork() {
  const wrap = document.getElementById('network-canvas');
  if (!wrap) return;

  const canvas = document.createElement('canvas');
  wrap.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const reduced = prefersReducedMotion();
  let W, H, dpr;
  let mouse = { x: -999, y: -999 };
  let hoveredNode = null;

  /* ── Node Data ──────────────────────────────────────────── */
  const categories = [
    {
      name: 'Machine Learning',
      color: '#8b5cf6',
      children: ['Regression', 'Classification', 'Clustering', 'PCA', 'XGBoost', 'Random Forest', 'SHAP', 'LIME', 'GridSearchCV', 'Fairlearn'],
    },
    {
      name: 'Backend',
      color: '#3b82f6',
      children: ['Java', 'Spring Boot', 'Node.js', 'Express.js', 'FastAPI', 'REST APIs'],
    },
    {
      name: 'Frontend',
      color: '#22d3ee',
      children: ['React', 'React Native', 'Vite', 'Tailwind CSS'],
    },
    {
      name: 'Databases',
      color: '#4ade80',
      children: ['MySQL', 'PostgreSQL', 'MongoDB'],
    },
    {
      name: 'AI',
      color: '#a78bfa',
      children: ['NLP', 'Prompt Engineering', 'Generative AI', 'Explainable AI'],
    },
    {
      name: 'Tools',
      color: '#f59e0b',
      children: ['Git', 'GitHub', 'Firebase', 'Streamlit', 'Render', 'Vercel', 'n8n', 'Weka'],
    },
  ];

  let nodes = [];
  let edges = [];

  function buildGraph() {
    nodes = [];
    edges = [];

    const centerNode = {
      id: 'center',
      label: 'SHIVA TYAGI',
      x: W / 2,
      y: H / 2,
      radius: 22,
      color: '#f1f5f9',
      isCenter: true,
      category: null,
      baseX: W / 2,
      baseY: H / 2,
    };
    nodes.push(centerNode);

    const catCount = categories.length;
    const catRadius = Math.min(W, H) * 0.3;

    categories.forEach((cat, ci) => {
      const angle = (ci / catCount) * Math.PI * 2 - Math.PI / 2;
      const cx = W / 2 + Math.cos(angle) * catRadius;
      const cy = H / 2 + Math.sin(angle) * catRadius;

      const catNode = {
        id: `cat-${ci}`,
        label: cat.name,
        x: cx,
        y: cy,
        radius: 16,
        color: cat.color,
        isCenter: false,
        category: cat.name,
        baseX: cx,
        baseY: cy,
      };
      nodes.push(catNode);
      edges.push({ from: 'center', to: `cat-${ci}`, color: cat.color });

      const childCount = cat.children.length;
      const childRadius = Math.min(W, H) * 0.13;

      cat.children.forEach((child, chi) => {
        const cAngle = angle + ((chi - (childCount - 1) / 2) * 0.35);
        const childDist = catRadius + childRadius + 10;
        const childX = W / 2 + Math.cos(cAngle) * childDist;
        const childY = H / 2 + Math.sin(cAngle) * childDist;

        const childNode = {
          id: `child-${ci}-${chi}`,
          label: child,
          x: childX,
          y: childY,
          radius: 6,
          color: cat.color,
          isCenter: false,
          category: cat.name,
          baseX: childX,
          baseY: childY,
        };
        nodes.push(childNode);
        edges.push({ from: `cat-${ci}`, to: `child-${ci}-${chi}`, color: cat.color });
      });
    });
  }

  function resize() {
    const rect = wrap.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio, 2);
    W = rect.width;
    H = rect.height;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildGraph();
  }

  resize();
  window.addEventListener('resize', throttle(resize, 200));

  /* ── Interaction ───────────────────────────────────────── */
  if (!isTouchDevice()) {
    wrap.addEventListener('mousemove', throttle((e) => {
      const rect = wrap.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;

      hoveredNode = null;
      for (const node of nodes) {
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        if (Math.sqrt(dx * dx + dy * dy) < node.radius + 8) {
          hoveredNode = node;
          break;
        }
      }
      wrap.style.cursor = hoveredNode ? 'pointer' : 'default';
    }, 16), { passive: true });

    wrap.addEventListener('mouseleave', () => {
      mouse.x = -999;
      mouse.y = -999;
      hoveredNode = null;
    });
  }

  /* ── Draw ──────────────────────────────────────────────── */
  let time = 0;
  let animId = null;

  function draw() {
    animId = requestAnimationFrame(draw);
    time += 0.006;
    ctx.clearRect(0, 0, W, H);

    // Edges
    edges.forEach((edge) => {
      const from = nodes.find((n) => n.id === edge.from);
      const to = nodes.find((n) => n.id === edge.to);
      if (!from || !to) return;

      const isHighlighted =
        hoveredNode &&
        (hoveredNode.category === from.category || hoveredNode.category === to.category ||
         hoveredNode.isCenter || from.id === hoveredNode.id || to.id === hoveredNode.id);

      ctx.strokeStyle = edge.color;
      ctx.globalAlpha = isHighlighted ? 0.4 : 0.1;
      ctx.lineWidth = isHighlighted ? 1.5 : 0.8;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
    });
    ctx.globalAlpha = 1;

    // Nodes
    nodes.forEach((node) => {
      const isHighlighted =
        hoveredNode &&
        (hoveredNode.id === node.id ||
         hoveredNode.category === node.category ||
         hoveredNode.isCenter || node.isCenter);

      // Float
      if (!reduced) {
        node.x = node.baseX + Math.sin(time + node.baseX * 0.01) * 2;
        node.y = node.baseY + Math.cos(time + node.baseY * 0.01) * 1.5;
      }

      const r = node.radius;
      const alpha = isHighlighted ? 0.8 : 0.35;

      // Glow
      if (isHighlighted && !node.isCenter) {
        ctx.fillStyle = node.color;
        ctx.globalAlpha = 0.15;
        ctx.beginPath();
        ctx.arc(node.x, node.y, r + 8, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = node.isCenter ? '#0b0f1a' : node.color;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
      ctx.fill();

      if (node.isCenter) {
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.6;
        ctx.stroke();
      }

      ctx.globalAlpha = 1;

      // Label
      const fontSize = node.isCenter ? 10 : (r > 10 ? 9 : 7);
      ctx.fillStyle = isHighlighted ? '#f1f5f9' : '#94a3b8';
      ctx.font = `${node.isCenter || r > 10 ? '600' : '400'} ${fontSize}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (node.isCenter) {
        ctx.fillText(node.label, node.x, node.y);
      } else if (r > 10) {
        ctx.fillText(node.label, node.x, node.y + r + 14);
      } else {
        ctx.fillText(node.label, node.x, node.y + r + 10);
      }
    });

    ctx.textAlign = 'start';
    ctx.textBaseline = 'alphabetic';
  }

  // Only animate when visible — properly start AND stop
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      if (!animId) draw();
    } else {
      if (animId) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    }
  }, { threshold: 0.1 });
  observer.observe(wrap);
}
