/* ============================================================
   HERO SCENE — Three.js 3D Software/AI Environment
   ============================================================ */

import { prefersReducedMotion, isTouchDevice, throttle } from './utils.js';

export function initHeroScene() {
  const container = document.getElementById('hero-canvas');
  if (!container || typeof THREE === 'undefined') return;

  const reduced = prefersReducedMotion();
  const isTouch = isTouchDevice();
  const isMobile = window.innerWidth < 768;

  /* ── Scene Setup ───────────────────────────────────────── */
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(0, 0, 30);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  /* ── Materials ─────────────────────────────────────────── */
  const primaryMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.25, wireframe: true });
  const accentMat = new THREE.MeshBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.2, wireframe: true });
  const cyanMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.2, wireframe: true });
  const lineMat = new THREE.LineBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.12 });
  const dotMat = new THREE.MeshBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.6 });
  const purpleDotMat = new THREE.MeshBasicMaterial({ color: 0xa78bfa, transparent: true, opacity: 0.5 });

  const objects = [];

  /* ── Helper: Create random position ────────────────────── */
  const rp = (range) => (Math.random() - 0.5) * range;

  /* ── Code Panels (floating wireframe rectangles) ────────── */
  const panelCount = isMobile ? 3 : 6;
  for (let i = 0; i < panelCount; i++) {
    const w = 2 + Math.random() * 3;
    const h = 1.5 + Math.random() * 2;
    const geo = new THREE.PlaneGeometry(w, h, 2, 2);
    const panel = new THREE.Mesh(geo, primaryMat.clone());
    panel.position.set(rp(40), rp(24), rp(16) - 5);
    panel.rotation.set(rp(0.3), rp(0.3), rp(0.1));
    panel.material.opacity = 0.1 + Math.random() * 0.15;
    scene.add(panel);
    objects.push({ mesh: panel, floatSpeed: 0.3 + Math.random() * 0.5, floatAmp: 0.3 + Math.random() * 0.6, phase: Math.random() * Math.PI * 2 });
  }

  /* ── Neural Network Nodes ──────────────────────────────── */
  const nodeGeo = new THREE.SphereGeometry(0.15, 8, 8);
  const nodePositions = [];
  const nnCount = isMobile ? 10 : 22;
  for (let i = 0; i < nnCount; i++) {
    const x = rp(36);
    const y = rp(22);
    const z = rp(14) - 4;
    nodePositions.push(new THREE.Vector3(x, y, z));
    const node = new THREE.Mesh(nodeGeo, (i % 3 === 0) ? purpleDotMat.clone() : dotMat.clone());
    node.position.set(x, y, z);
    scene.add(node);
    objects.push({ mesh: node, floatSpeed: 0.4 + Math.random() * 0.4, floatAmp: 0.2 + Math.random() * 0.4, phase: Math.random() * Math.PI * 2 });
  }

  /* ── Neural Network Connections ────────────────────────── */
  const connCount = isMobile ? 6 : 14;
  for (let i = 0; i < connCount; i++) {
    const a = nodePositions[Math.floor(Math.random() * nodePositions.length)];
    const b = nodePositions[Math.floor(Math.random() * nodePositions.length)];
    if (a === b) continue;
    const points = [a, b];
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geo, lineMat.clone());
    line.material.opacity = 0.06 + Math.random() * 0.08;
    scene.add(line);
  }

  /* ── Database Cylinders ────────────────────────────────── */
  if (!isMobile) {
    const cylGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.8, 8, 1, false);
    for (let i = 0; i < 3; i++) {
      const cyl = new THREE.Mesh(cylGeo, cyanMat.clone());
      cyl.position.set(rp(30), rp(18), rp(10) - 6);
      cyl.rotation.x = rp(0.3);
      cyl.material.opacity = 0.12 + Math.random() * 0.1;
      scene.add(cyl);
      objects.push({ mesh: cyl, floatSpeed: 0.25 + Math.random() * 0.3, floatAmp: 0.3 + Math.random() * 0.4, phase: Math.random() * Math.PI * 2 });
    }
  }

  /* ── Software Architecture Blocks ──────────────────────── */
  if (!isMobile) {
    const boxGeo = new THREE.BoxGeometry(1.2, 0.8, 0.3, 1, 1, 1);
    for (let i = 0; i < 4; i++) {
      const box = new THREE.Mesh(boxGeo, accentMat.clone());
      box.position.set(rp(35), rp(20), rp(12) - 6);
      box.rotation.set(rp(0.4), rp(0.4), rp(0.2));
      box.material.opacity = 0.1 + Math.random() * 0.12;
      scene.add(box);
      objects.push({ mesh: box, floatSpeed: 0.2 + Math.random() * 0.4, floatAmp: 0.25 + Math.random() * 0.5, phase: Math.random() * Math.PI * 2 });
    }
  }

  /* ── Particle Field ────────────────────────────────────── */
  const particleCount = isMobile ? 60 : 180;
  const pGeo = new THREE.BufferGeometry();
  const pPositions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    pPositions[i * 3] = rp(60);
    pPositions[i * 3 + 1] = rp(40);
    pPositions[i * 3 + 2] = rp(30) - 10;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
  const pMat = new THREE.PointsMaterial({ color: 0x60a5fa, size: 0.08, transparent: true, opacity: 0.35 });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  /* ── Mouse Parallax ────────────────────────────────────── */
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;

  if (!isTouch && !reduced) {
    const onMouseMove = throttle((e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, 16);
    window.addEventListener('mousemove', onMouseMove, { passive: true });
  }

  /* ── Animation Loop ────────────────────────────────────── */
  let time = 0;
  let animId;

  function animate() {
    animId = requestAnimationFrame(animate);
    time += 0.008;

    // Smooth parallax
    targetX += (mouseX * 3 - targetX) * 0.03;
    targetY += (-mouseY * 2 - targetY) * 0.03;
    camera.position.x = targetX;
    camera.position.y = targetY;
    camera.lookAt(0, 0, 0);

    // Float objects
    if (!reduced) {
      objects.forEach((o) => {
        o.mesh.position.y += Math.sin(time * o.floatSpeed + o.phase) * 0.003 * o.floatAmp;
        o.mesh.rotation.y += 0.001;
      });
      particles.rotation.y += 0.0003;
    }

    renderer.render(scene, camera);
  }

  // Only animate when hero is visible
  const heroSection = document.getElementById('hero');
  const heroObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      if (!animId) animate();
    } else {
      if (animId) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    }
  }, { threshold: 0.05 });

  if (heroSection) heroObserver.observe(heroSection);
  else animate();

  /* ── Resize ────────────────────────────────────────────── */
  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}
