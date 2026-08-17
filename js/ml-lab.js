/* ============================================================
   ML VISUAL LAB — 10 Lightweight Canvas Demonstrations
   ============================================================ */

export function initMLLab() {
  const cards = document.querySelectorAll('.lab-card');
  if (!cards.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const canvas = entry.target.querySelector('canvas');
          if (canvas && !canvas.dataset.drawn) {
            canvas.dataset.drawn = '1';
            const type = canvas.dataset.lab;
            drawLab(canvas, type);
          }
        }
      });
    },
    { threshold: 0.2 }
  );

  cards.forEach((c) => observer.observe(c));
}

function drawLab(canvas, type) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = Math.min(window.devicePixelRatio, 2);
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);
  const W = rect.width;
  const H = rect.height;

  const primary = '#3b82f6';
  const accent = '#8b5cf6';
  const cyan = '#22d3ee';
  const green = '#4ade80';
  const muted = '#475569';
  const textC = '#94a3b8';
  const bg = '#141b2d';

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  switch (type) {
    case 'regression': drawRegression(ctx, W, H, primary, muted, textC); break;
    case 'classification': drawClassification(ctx, W, H, primary, accent, muted, textC); break;
    case 'kmeans': drawKMeans(ctx, W, H, primary, accent, cyan, muted); break;
    case 'pca': drawPCA(ctx, W, H, primary, accent, muted, textC); break;
    case 'decision-tree': drawDecisionTree(ctx, W, H, primary, accent, green, textC); break;
    case 'random-forest': drawRandomForest(ctx, W, H, primary, accent, cyan); break;
    case 'gradient-boosting': drawGradientBoosting(ctx, W, H, primary, accent, green, textC); break;
    case 'confusion-matrix': drawConfusionMatrix(ctx, W, H, primary, accent, green, textC); break;
    case 'feature-importance': drawFeatureImportance(ctx, W, H, primary, accent, cyan, green, textC); break;
    case 'shap': drawSHAP(ctx, W, H, primary, accent, green, textC); break;
  }
}

/* ── 1. Regression Line ──────────────────────────────────── */
function drawRegression(ctx, W, H, primary, muted, textC) {
  const pad = 30;
  // Axes
  ctx.strokeStyle = muted;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(pad, pad);
  ctx.lineTo(pad, H - pad);
  ctx.lineTo(W - pad, H - pad);
  ctx.stroke();

  // Data points
  const points = [];
  for (let i = 0; i < 20; i++) {
    const x = pad + 10 + Math.random() * (W - pad * 2 - 20);
    const slope = -0.6;
    const y = H - pad - 20 + slope * (x - pad) + (Math.random() - 0.5) * 40;
    points.push({ x, y: Math.max(pad, Math.min(H - pad - 5, y)) });
  }

  points.forEach((p) => {
    ctx.fillStyle = primary;
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  // Regression line
  ctx.strokeStyle = '#60a5fa';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(pad + 5, H - pad - 15);
  ctx.lineTo(W - pad - 5, pad + 20);
  ctx.stroke();

  // Label
  ctx.fillStyle = textC;
  ctx.font = '10px Inter, sans-serif';
  ctx.fillText('y = mx + b', W - pad - 55, pad + 14);
}

/* ── 2. Classification Boundary ──────────────────────────── */
function drawClassification(ctx, W, H, primary, accent, muted, textC) {
  const pad = 25;
  const cx = W / 2;

  // Decision boundary
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(cx, pad);
  ctx.lineTo(cx, H - pad);
  ctx.stroke();
  ctx.setLineDash([]);

  // Class A (blue)
  for (let i = 0; i < 14; i++) {
    const x = pad + Math.random() * (cx - pad - 15);
    const y = pad + 10 + Math.random() * (H - pad * 2 - 20);
    ctx.fillStyle = primary;
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.arc(x, y, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Class B (purple)
  for (let i = 0; i < 14; i++) {
    const x = cx + 15 + Math.random() * (W - cx - pad - 15);
    const y = pad + 10 + Math.random() * (H - pad * 2 - 20);
    ctx.fillStyle = accent;
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.arc(x, y, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  ctx.fillStyle = textC;
  ctx.font = '9px Inter, sans-serif';
  ctx.fillText('Class A', pad + 5, H - pad + 12);
  ctx.fillText('Class B', W - pad - 38, H - pad + 12);
}

/* ── 3. K-Means Clusters ─────────────────────────────────── */
function drawKMeans(ctx, W, H, primary, accent, cyan, muted) {
  const centers = [
    { x: W * 0.25, y: H * 0.35, color: primary },
    { x: W * 0.65, y: H * 0.3, color: accent },
    { x: W * 0.45, y: H * 0.72, color: cyan },
  ];

  centers.forEach((c) => {
    // Cluster points
    for (let i = 0; i < 12; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 10 + Math.random() * 30;
      const x = c.x + Math.cos(angle) * r;
      const y = c.y + Math.sin(angle) * r;
      ctx.fillStyle = c.color;
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Center
    ctx.globalAlpha = 1;
    ctx.fillStyle = c.color;
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(c.x, c.y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });
  ctx.globalAlpha = 1;
}

/* ── 4. PCA Dimensionality Reduction ─────────────────────── */
function drawPCA(ctx, W, H, primary, accent, muted, textC) {
  const midY = H / 2;

  // Left: 3D scatter (simulated)
  ctx.fillStyle = textC;
  ctx.font = '9px Inter, sans-serif';
  ctx.fillText('High-D', 15, 16);

  for (let i = 0; i < 20; i++) {
    const x = 20 + Math.random() * (W / 2 - 50);
    const y = 25 + Math.random() * (H - 50);
    ctx.fillStyle = primary;
    ctx.globalAlpha = 0.3 + Math.random() * 0.4;
    ctx.beginPath();
    ctx.arc(x, y, 2 + Math.random() * 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Arrow
  ctx.strokeStyle = accent;
  ctx.lineWidth = 1.5;
  const arrowX = W / 2;
  ctx.beginPath();
  ctx.moveTo(arrowX - 15, midY);
  ctx.lineTo(arrowX + 15, midY);
  ctx.moveTo(arrowX + 10, midY - 5);
  ctx.lineTo(arrowX + 15, midY);
  ctx.lineTo(arrowX + 10, midY + 5);
  ctx.stroke();

  ctx.fillStyle = textC;
  ctx.fillText('PCA', arrowX - 8, midY - 10);

  // Right: 2D projection (line)
  ctx.fillStyle = textC;
  ctx.fillText('Low-D', W - 50, 16);

  const rightPad = W / 2 + 30;
  for (let i = 0; i < 15; i++) {
    const x = rightPad + Math.random() * (W - rightPad - 20);
    const y = midY - 15 + Math.random() * 30;
    ctx.fillStyle = accent;
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

/* ── 5. Decision Tree ────────────────────────────────────── */
function drawDecisionTree(ctx, W, H, primary, accent, green, textC) {
  const cx = W / 2;
  const nodeR = 10;

  function drawNode(x, y, col) {
    ctx.fillStyle = col;
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.arc(x, y, nodeR, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = col;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, nodeR, 0, Math.PI * 2);
    ctx.stroke();
  }

  function drawEdge(x1, y1, x2, y2) {
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x1, y1 + nodeR);
    ctx.lineTo(x2, y2 - nodeR);
    ctx.stroke();
  }

  // Root
  drawNode(cx, 25, primary);
  // Level 1
  drawEdge(cx, 25, cx - 50, 65);
  drawEdge(cx, 25, cx + 50, 65);
  drawNode(cx - 50, 65, accent);
  drawNode(cx + 50, 65, accent);
  // Level 2
  drawEdge(cx - 50, 65, cx - 80, 110);
  drawEdge(cx - 50, 65, cx - 20, 110);
  drawEdge(cx + 50, 65, cx + 20, 110);
  drawEdge(cx + 50, 65, cx + 80, 110);
  drawNode(cx - 80, 110, green);
  drawNode(cx - 20, 110, green);
  drawNode(cx + 20, 110, primary);
  drawNode(cx + 80, 110, green);
  // Level 3
  drawEdge(cx + 20, 110, cx + 5, 148);
  drawEdge(cx + 20, 110, cx + 40, 148);
  drawNode(cx + 5, 148, green);
  drawNode(cx + 40, 148, green);

  ctx.fillStyle = textC;
  ctx.font = '8px Inter, sans-serif';
  ctx.fillText('Root', cx + 14, 28);
  ctx.fillText('Leaf', cx - 80 + 14, 113);
}

/* ── 6. Random Forest ────────────────────────────────────── */
function drawRandomForest(ctx, W, H, primary, accent, cyan) {
  const trees = 3;
  const gap = W / (trees + 1);

  for (let t = 0; t < trees; t++) {
    const cx = gap * (t + 1);
    const cols = [primary, accent, cyan];
    const col = cols[t];

    // Simple tree
    ctx.fillStyle = col;
    ctx.globalAlpha = 0.5;
    // Triangle shape
    ctx.beginPath();
    ctx.moveTo(cx, 20);
    ctx.lineTo(cx - 25, 65);
    ctx.lineTo(cx + 25, 65);
    ctx.closePath();
    ctx.fill();
    // Trunk
    ctx.fillRect(cx - 4, 65, 8, 18);
    ctx.globalAlpha = 1;

    ctx.fillStyle = '#f1f5f9';
    ctx.font = '9px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`T${t + 1}`, cx, 48);
  }

  // Arrows down to ensemble
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1;
  for (let t = 0; t < trees; t++) {
    const cx = gap * (t + 1);
    ctx.beginPath();
    ctx.moveTo(cx, 86);
    ctx.lineTo(W / 2, 110);
    ctx.stroke();
  }

  // Ensemble node
  ctx.fillStyle = '#22c55e';
  ctx.globalAlpha = 0.7;
  ctx.beginPath();
  ctx.arc(W / 2, 125, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#f1f5f9';
  ctx.font = '8px Inter, sans-serif';
  ctx.fillText('Vote', W / 2, 128);
  ctx.textAlign = 'start';

  ctx.fillStyle = '#94a3b8';
  ctx.font = '9px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Ensemble Prediction', W / 2, H - 12);
  ctx.textAlign = 'start';
}

/* ── 7. Gradient Boosting ────────────────────────────────── */
function drawGradientBoosting(ctx, W, H, primary, accent, green, textC) {
  const steps = ['Weak 1', 'Weak 2', 'Weak 3', 'Strong'];
  const colors = [primary, accent, '#22d3ee', green];
  const stepW = (W - 20) / steps.length;

  steps.forEach((label, i) => {
    const x = 10 + i * stepW + stepW / 2;
    const y = H / 2;
    const r = i === steps.length - 1 ? 18 : 14;

    ctx.fillStyle = colors[i];
    ctx.globalAlpha = i === steps.length - 1 ? 0.8 : 0.5;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.fillStyle = '#f1f5f9';
    ctx.font = '8px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, x, y + 3);

    // Arrow
    if (i < steps.length - 1) {
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + r + 3, y);
      ctx.lineTo(x + stepW - r - 3, y);
      ctx.stroke();
      // arrowhead
      ctx.beginPath();
      ctx.moveTo(x + stepW - r - 6, y - 3);
      ctx.lineTo(x + stepW - r - 3, y);
      ctx.lineTo(x + stepW - r - 6, y + 3);
      ctx.stroke();

      ctx.fillStyle = textC;
      ctx.font = '7px Inter, sans-serif';
      ctx.fillText('+residual', x + stepW / 2, y - 20);
    }
  });
  ctx.textAlign = 'start';
}

/* ── 8. Confusion Matrix ─────────────────────────────────── */
function drawConfusionMatrix(ctx, W, H, primary, accent, green, textC) {
  const pad = 35;
  const cellW = (W - pad * 2) / 2;
  const cellH = (H - pad * 2 - 15) / 2;
  const values = [[42, 5], [3, 38]];
  const colors = [
    [green, accent],
    [accent, green],
  ];

  ctx.fillStyle = textC;
  ctx.font = '9px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Predicted', W / 2, 12);
  ctx.save();
  ctx.translate(10, H / 2 + 10);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Actual', 0, 0);
  ctx.restore();
  ctx.textAlign = 'start';

  // Labels
  ctx.fillStyle = textC;
  ctx.font = '8px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Pos', pad + cellW / 2, pad - 3);
  ctx.fillText('Neg', pad + cellW + cellW / 2, pad - 3);

  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 2; c++) {
      const x = pad + c * cellW;
      const y = pad + r * cellH;
      ctx.fillStyle = colors[r][c];
      ctx.globalAlpha = r === c ? 0.25 : 0.1;
      ctx.fillRect(x, y, cellW - 2, cellH - 2);
      ctx.globalAlpha = 1;

      ctx.strokeStyle = r === c ? colors[r][c] : '#334155';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, cellW - 2, cellH - 2);

      ctx.fillStyle = '#f1f5f9';
      ctx.font = 'bold 16px Inter, sans-serif';
      ctx.fillText(values[r][c].toString(), x + cellW / 2 - 1, y + cellH / 2 + 5);
    }
  }
  ctx.textAlign = 'start';
}

/* ── 9. Feature Importance ───────────────────────────────── */
function drawFeatureImportance(ctx, W, H, primary, accent, cyan, green, textC) {
  const features = [
    { name: 'Feature A', val: 0.85 },
    { name: 'Feature B', val: 0.62 },
    { name: 'Feature C', val: 0.48 },
    { name: 'Feature D', val: 0.31 },
    { name: 'Feature E', val: 0.18 },
  ];
  const colors = [primary, accent, cyan, green, '#f59e0b'];
  const pad = 14;
  const labelW = 60;
  const barH = (H - pad * 2) / features.length - 6;

  features.forEach((f, i) => {
    const y = pad + i * (barH + 6);
    const maxBarW = W - labelW - pad * 2;

    ctx.fillStyle = textC;
    ctx.font = '9px Inter, sans-serif';
    ctx.fillText(f.name, pad, y + barH / 2 + 3);

    ctx.fillStyle = colors[i];
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.roundRect(labelW + pad, y, maxBarW * f.val, barH, 3);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.fillStyle = '#f1f5f9';
    ctx.font = '8px Inter, sans-serif';
    ctx.fillText((f.val * 100).toFixed(0) + '%', labelW + pad + maxBarW * f.val + 5, y + barH / 2 + 3);
  });
}

/* ── 10. SHAP Explanation ────────────────────────────────── */
function drawSHAP(ctx, W, H, primary, accent, green, textC) {
  const features = [
    { name: 'Area', val: 0.45, dir: 1 },
    { name: 'Grade', val: 0.3, dir: 1 },
    { name: 'Year', val: 0.15, dir: 1 },
    { name: 'Bath', val: -0.1, dir: -1 },
    { name: 'Lot', val: -0.25, dir: -1 },
  ];
  const pad = 20;
  const mid = W / 2;
  const barH = (H - pad * 2) / features.length - 6;
  const maxW = (W / 2 - 50);

  ctx.fillStyle = textC;
  ctx.font = '8px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('← decreases', mid - maxW / 2, 14);
  ctx.fillText('increases →', mid + maxW / 2, 14);

  // Center line
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(mid, pad);
  ctx.lineTo(mid, H - pad + 5);
  ctx.stroke();

  features.forEach((f, i) => {
    const y = pad + 4 + i * (barH + 6);
    const barW = Math.abs(f.val) * maxW;
    const color = f.dir > 0 ? '#ef4444' : primary;

    ctx.fillStyle = color;
    ctx.globalAlpha = 0.5;
    if (f.dir > 0) {
      ctx.beginPath();
      ctx.roundRect(mid, y, barW, barH, 3);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.roundRect(mid - barW, y, barW, barH, 3);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    ctx.fillStyle = textC;
    ctx.font = '8px Inter, sans-serif';
    ctx.textAlign = f.dir > 0 ? 'left' : 'right';
    const labelX = f.dir > 0 ? mid + barW + 5 : mid - barW - 5;
    ctx.fillText(f.name, labelX, y + barH / 2 + 3);
  });
  ctx.textAlign = 'start';
}
