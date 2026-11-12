/* ============================================================
   HAPPY BIRTHDAY — A CINEMATIC EXPERIENCE IN SIX CHAPTERS
   Vanilla Canvas 2D + GSAP 3 Orchestration + Centralized Config.

   Chapter 1: The Invitation (Cupid Bow & Heart Strike)
   Chapter 2: A Beautiful Beginning (Magical Memory Book)
   Chapter 3: Little Moments, Big Memories (10 Polaroid Cards)
   Chapter 4: Words From The Heart (Interactive Wax Letter)
   Chapter 5: Wishes Beyond Words (Celestial Wishes)
   Chapter 6: The Grand Finale (Blooming Heart Blossom Tree)
   ============================================================ */

import _gsap from 'gsap';
const gsap = (typeof window !== 'undefined' && window.gsap) ? window.gsap : _gsap;
import { BIRTHDAY_CONFIG } from './birthday.config.js';

/* Pen-stroke plugin for GSAP */
gsap.registerPlugin({
  name: 'drawn',
  init(target, value) {
    const len = target.getTotalLength();
    target.style.strokeDasharray = len;
    this.target = target; this.len = len; this.value = value;
  },
  render(ratio, data) {
    data.target.style.strokeDashoffset = data.len * (1 - data.value * ratio);
  },
});

const $ = (id) => document.getElementById(id);

/* Canvas & Finale Wish */
const canvas = $('tree');
const ctx    = canvas.getContext('2d');
const wishEl = $('wish');

/* Act 1 Invitation Elements (Guarded for minimal redesign) */
const hero       = $('hero');
const eyebrow    = $('eyebrow');
const hint       = $('hint');
const motes      = $('motes');
const target     = $('target');
const targetHeart= $('targetHeart');
const heartGlow  = target ? target.querySelector('.heart__glow') : null;
const aim        = $('aim');

const archery = $('archery');
const bow     = $('bow');
const arrow   = $('arrow');
const strL    = $('strL');
const strR    = $('strR');
const serving = $('serving');

const flood   = $('flood');
const field   = $('field');
const camera  = $('camera');
const fgrid   = $('fgrid');
const kEyebrow= $('kEyebrow');
const kSub    = $('kSub');
const barTop  = $('barTop');
const barBot  = $('barBot');
const ulineEl = $('uline');
const uline   = ulineEl ? ulineEl.querySelector('.uline__path') : null;
const bloom   = $('bloom');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isRecord     = new URLSearchParams(location.search).has('record');

if (isRecord) window.bdayCues = [];
let recT0 = 0;
function cue(name){ if (isRecord && recT0) window.bdayCues.push({ cue: name, t: (performance.now() - recT0) / 1000 }); }

/* ============================================================
   MATH & COLOR HELPERS
   ============================================================ */
const rand  = (a, b) => a + Math.random() * (b - a);
const pick  = (a)    => a[(Math.random() * a.length) | 0];
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp  = (a, b, t) => a + (b - a) * t;
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const easeOutBack  = (t) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };

function shade(hex, amt){
  const n = parseInt(hex.slice(1), 16);
  const r = clamp((n >> 16) + amt, 0, 255), g = clamp(((n >> 8) & 255) + amt, 0, 255), b = clamp((n & 255) + amt, 0, 255);
  return `rgb(${r | 0},${g | 0},${b | 0})`;
}

/* ============================================================
   CANVAS TREE ENGINE (Chapter 6 Grand Finale)
   ============================================================ */
const BLOSSOM = [
  { c0: '#ffe1ec', c1: '#ff80aa' },
  { c0: '#ffd0e0', c1: '#f4577f' },
  { c0: '#ffc4d2', c1: '#e23b67' },
  { c0: '#ffd9c4', c1: '#ff8a5b' },
  { c0: '#ffeec2', c1: '#f6b13e' },
  { c0: '#ffd2e6', c1: '#e84d9a' },
];

const T = {
  trunkStart: 0.10,
  branchSpan: 1.80,
  bloomT0:    1.25,
  bloomSpan:  2.00,
  petalT0:    2.45,
  noteStart:  0.45,
  done:       4.60,
};

const SS = 168;

function heartShape(c, x, top, w, h){
  c.beginPath();
  c.moveTo(x, top + h * 0.28);
  c.bezierCurveTo(x, top, x - w * 0.5, top, x - w * 0.5, top + h * 0.28);
  c.bezierCurveTo(x - w * 0.5, top + h * 0.60, x - w * 0.16, top + h * 0.80, x, top + h);
  c.bezierCurveTo(x + w * 0.16, top + h * 0.80, x + w * 0.5, top + h * 0.60, x + w * 0.5, top + h * 0.28);
  c.bezierCurveTo(x + w * 0.5, top, x, top, x, top + h * 0.28);
  c.closePath();
}

function makeBlossom({ c0, c1 }, soft){
  const cv = document.createElement('canvas'); cv.width = cv.height = SS;
  const c = cv.getContext('2d');
  const w = SS * 0.62, h = SS * 0.58, x = SS / 2, top = SS * 0.17;

  c.save();
  c.shadowColor = 'rgba(150,38,72,0.32)';
  c.shadowBlur = SS * 0.085; c.shadowOffsetY = SS * 0.05;
  c.fillStyle = c1; heartShape(c, x, top, w, h); c.fill();
  c.restore();

  const g = c.createRadialGradient(x - w * 0.20, top + h * 0.20, h * 0.04, x, top + h * 0.42, h * 0.92);
  g.addColorStop(0, c0); g.addColorStop(0.55, c1); g.addColorStop(1, shade(c1, -26));
  heartShape(c, x, top, w, h); c.fillStyle = g; c.fill();

  c.save(); heartShape(c, x, top, w, h); c.clip();
  const g2 = c.createLinearGradient(0, top, 0, top + h);
  g2.addColorStop(0, 'rgba(255,255,255,0.72)');
  g2.addColorStop(0.34, 'rgba(255,255,255,0)');
  c.fillStyle = g2; c.fillRect(0, 0, SS, SS);
  c.restore();

  c.save();
  c.fillStyle = 'rgba(255,255,255,0.65)';
  c.beginPath(); c.ellipse(x - w * 0.22, top + h * 0.32, w * 0.09, h * 0.055, -0.4, 0, Math.PI * 2); c.fill();
  c.restore();

  if (soft){
    const blurred = document.createElement('canvas'); blurred.width = blurred.height = SS;
    const bc = blurred.getContext('2d');
    bc.filter = 'blur(3px)'; bc.drawImage(cv, 0, 0); return blurred;
  }
  return cv;
}

function makeSparkle(){
  const cv = document.createElement('canvas'); cv.width = cv.height = 64;
  const c = cv.getContext('2d');
  const g = c.createRadialGradient(32, 32, 0, 32, 32, 28);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.25, 'rgba(255,230,170,0.85)');
  g.addColorStop(0.65, 'rgba(255,170,120,0.22)');
  g.addColorStop(1, 'rgba(255,170,120,0)');
  c.fillStyle = g; c.fillRect(0, 0, 64, 64);
  c.strokeStyle = 'rgba(255,255,255,0.95)'; c.lineWidth = 1.8;
  c.beginPath();
  c.moveTo(32, 8); c.lineTo(32, 56); c.moveTo(8, 32); c.lineTo(56, 32);
  c.moveTo(16, 16); c.lineTo(48, 48); c.moveTo(48, 16); c.lineTo(16, 48);
  c.stroke();
  return cv;
}

let SPR = { crisp: [], soft: [] }, SPARKLE = null;
function buildSprites(){
  SPR.crisp = BLOSSOM.map((b) => makeBlossom(b, false));
  SPR.soft  = BLOSSOM.map((b) => makeBlossom(b, true));
  SPARKLE   = makeSparkle();
}

function drawSprite(img, x, y, size, rot, alpha){
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, y);
  if (rot) ctx.rotate(rot);
  ctx.drawImage(img, -size / 2, -size / 2, size, size);
  ctx.restore();
}

let W = 0, H = 0, dpr = 1, cx = 0, cy = 0, canopyR = 0, groundY = 0;
let trunk = [], branches = [], hearts = [], petals = [], rested = [], floaters = [], twinkles = [];

function heartCurve(t){
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
  return { x: x / 17, y: y / 17 };
}

function buildScene(){
  cx = W * 0.52; cy = H * 0.44;
  canopyR = Math.min(W * 0.40, H * 0.38, 330);
  groundY = H * 0.94;
  buildBranches(); buildHearts(); buildFloaters();
  petals = []; rested = []; twinkles = [];
}

function buildBranches(){
  trunk = []; branches = [];
  const baseW = Math.max(16, canopyR * 0.088);
  const t0 = { x: cx, y: groundY }, t1 = { x: cx - canopyR * 0.04, y: cy + canopyR * 0.30 };
  const tMid = { x: cx - canopyR * 0.02, y: (t0.y + t1.y) * 0.52 };
  trunk.push({ p0: t0, p1: tMid, p2: t1, w0: baseW, w1: baseW * 0.62, t0: T.trunkStart, t1: T.trunkStart + 0.65 });

  const mainSpecs = [
    { a: -2.35, len: 0.88, w: 0.60, dt: 0.30 },
    { a: -1.85, len: 0.95, w: 0.64, dt: 0.35 },
    { a: -1.25, len: 0.95, w: 0.64, dt: 0.38 },
    { a: -0.75, len: 0.88, w: 0.60, dt: 0.42 },
    { a: -2.85, len: 0.68, w: 0.50, dt: 0.45 },
    { a: -0.28, len: 0.68, w: 0.50, dt: 0.48 },
  ];
  for (const s of mainSpecs){
    const b0 = { x: t1.x, y: t1.y };
    const r1 = canopyR * s.len * 0.55;
    const b1 = { x: b0.x + Math.cos(s.a) * r1 + rand(-10, 10), y: b0.y + Math.sin(s.a) * r1 };
    const r2 = canopyR * s.len;
    const b2 = { x: b0.x + Math.cos(s.a) * r2 + rand(-14, 14), y: b0.y + Math.sin(s.a) * r2 };
    const st = T.trunkStart + s.dt;
    branches.push({ p0: b0, p1: b1, p2: b2, w0: baseW * s.w, w1: baseW * 0.22, t0: st, t1: st + T.branchSpan * 0.65 });
  }
}

function buildHearts(){
  hearts = [];
  const N = Math.round(clamp(W * 0.38, 200, 360));
  for (let i = 0; i < N; i++){
    let hx = 0, hy = 0, ok = false;
    for (let tries = 0; tries < 28; tries++){
      const t = rand(0, Math.PI * 2);
      const pos = heartCurve(t);
      const r = Math.pow(Math.random(), 0.72);
      hx = cx + pos.x * canopyR * (0.16 + 0.88 * r) + rand(-9, 9);
      hy = cy + pos.y * canopyR * (0.16 + 0.88 * r) + rand(-9, 9);
      if (Math.hypot(hx - cx, hy - cy) < canopyR * 1.08){ ok = true; break; }
    }
    if (!ok) continue;
    const dist = Math.hypot(hx - cx, hy - cy) / canopyR;
    const ang = Math.atan2(hy - cy, hx - cx);
    const box = rand(15, 34) * (1 - dist * 0.22);
    const t0 = T.bloomT0 + clamp01(dist * 0.65 + (ang + Math.PI) / (Math.PI * 2) * 0.25 + rand(-0.1, 0.1)) * T.bloomSpan;
    hearts.push({ x: hx, y: hy, box, t0, idx: (Math.random() * BLOSSOM.length) | 0, rot: rand(-0.4, 0.4), sway: rand(0, 6.28), soft: Math.random() < 0.22 });
  }
  hearts.sort((a, b) => a.t0 - b.t0);
}

function buildFloaters(){
  floaters = [];
  for (let i = 0; i < 38; i++){
    floaters.push({
      x: rand(0, W), y: rand(H * 0.15, H * 0.95), r: rand(1.6, 4.2),
      vx: rand(-8, 8), vy: rand(-6, -18), a: rand(0.25, 0.65),
      t0: rand(0.8, 3.5), c: Math.random() < 0.5 ? 'rgba(255,230,170,' : 'rgba(255,160,190,',
    });
  }
}

function quad(b, t){
  const u = 1 - t;
  return { x: u * u * b.p0.x + 2 * u * t * b.p1.x + t * t * b.p2.x, y: u * u * b.p0.y + 2 * u * t * b.p1.y + t * t * b.p2.y };
}

function drawBackground(){
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#fffcf7'); g.addColorStop(0.42, '#fdeee2');
  g.addColorStop(0.78, '#f7d3c0'); g.addColorStop(1, '#ecc0ad');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}

function drawGodRays(t, k){
  if (k <= 0.01) return;
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  const rays = [
    { a: -1.35, w: 0.38, lum: 0.18 }, { a: -0.95, w: 0.44, lum: 0.24 },
    { a: -0.55, w: 0.36, lum: 0.20 }, { a: -0.15, w: 0.32, lum: 0.16 },
  ];
  for (const r of rays){
    const curA = r.a + Math.sin(t * 0.35 + r.a) * 0.05;
    const len = Math.max(W, H) * 1.25;
    const x2 = cx + Math.cos(curA) * len, y2 = cy + Math.sin(curA) * len;
    const g = ctx.createLinearGradient(cx, cy, x2, y2);
    const alpha = r.lum * k;
    g.addColorStop(0, `rgba(255,235,185,${alpha * 1.3})`);
    g.addColorStop(0.4, `rgba(255,200,160,${alpha})`);
    g.addColorStop(1, 'rgba(255,200,160,0)');
    ctx.fillStyle = g; ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(curA - r.w * 0.5) * len, cy + Math.sin(curA - r.w * 0.5) * len);
    ctx.lineTo(cx + Math.cos(curA + r.w * 0.5) * len, cy + Math.sin(curA + r.w * 0.5) * len);
    ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}

function drawGlow(t){
  const p = clamp01((t - T.bloomT0) / 1.2); if (p <= 0) return;
  const rad = canopyR * (1.1 + 0.15 * Math.sin(t * 0.8));
  const g = ctx.createRadialGradient(cx, cy, canopyR * 0.15, cx, cy, rad);
  g.addColorStop(0, `rgba(255,225,200,${0.38 * p})`);
  g.addColorStop(0.5, `rgba(255,160,180,${0.18 * p})`);
  g.addColorStop(1, 'rgba(255,160,180,0)');
  ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(cx, cy, rad, 0, Math.PI * 2); ctx.fill(); ctx.restore();
}

function drawBokeh(t, dt){
  if (t < T.bloomT0) return;
  ctx.save(); ctx.globalCompositeOperation = 'screen';
  for (const f of floaters){
    f.y += f.vy * dt; f.x += f.vx * dt;
    if (f.y < H * 0.1){ f.y = H * 0.95; f.x = rand(0, W); }
    ctx.fillStyle = `${f.c}${f.a})`;
    ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

function drawFloaters(t, dt, post){
  if (t < T.petalT0) return;
  ctx.save();
  for (const f of floaters){
    if (post && f.r <= 2.8) continue;
    if (!post && f.r > 2.8) continue;
    ctx.fillStyle = `${f.c}${f.a * 0.8})`;
    ctx.beginPath(); ctx.arc(f.x, f.y, f.r * 0.8, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

function drawBranches(t){
  ctx.lineCap = 'round';
  for (const b of [...trunk, ...branches]){
    const e = clamp01((t - b.t0) / (b.t1 - b.t0));
    if (e <= 0) continue;
    const steps = 12, last = Math.max(1, Math.ceil(steps * e));
    let prev = quad(b, 0);
    for (let i = 1; i <= last; i++){
      const tt = Math.min(e, i / steps), p = quad(b, tt);
      ctx.lineWidth = lerp(b.w0, b.w1, tt);
      ctx.strokeStyle = '#5a3020';
      ctx.beginPath(); ctx.moveTo(prev.x, prev.y); ctx.lineTo(p.x, p.y); ctx.stroke();
      prev = p;
    }
  }
}

function drawHearts(t){
  const breathe = 1 + Math.sin(t * 0.8) * 0.012;
  for (const h of hearts){
    const p = clamp01((t - h.t0) / 0.6); if (p <= 0) continue;
    const scale = Math.max(0, easeOutBack(p));
    let alpha = clamp01(p * 1.7); if (h.soft) alpha *= 0.8;
    const settled = clamp01((t - h.t0 - 0.6) / 0.7);
    const sway = settled * Math.sin(t * 1.5 + h.sway) * (h.box * 0.05);
    const rise = (1 - easeOutCubic(p)) * h.box * 0.45;
    const hx = cx + (h.x - cx) * breathe + sway;
    const hy = cy + (h.y - cy) * breathe - rise;
    drawSprite((h.soft ? SPR.soft : SPR.crisp)[h.idx], hx, hy, h.box * scale, h.rot + sway * 0.012, alpha);
  }
}

function updateTwinkles(t, dt){
  const active = t > T.bloomT0 + T.bloomSpan * 0.45;
  if (active && twinkles.length < 9 && Math.random() < 0.5){
    const h = hearts[(Math.random() * hearts.length) | 0];
    if (h) twinkles.push({ x: h.x, y: h.y, size: rand(0.6, 1.3) * (Math.min(W, H) * 0.05), age: 0, life: rand(0.7, 1.2), rot: rand(0, 6.28) });
  }
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = twinkles.length - 1; i >= 0; i--){
    const s = twinkles[i]; s.age += dt;
    const k = s.age / s.life;
    if (k >= 1){ twinkles.splice(i, 1); continue; }
    const a = Math.sin(k * Math.PI);
    drawSprite(SPARKLE, s.x, s.y, s.size * (0.6 + 0.4 * a), s.rot + k * 1.2, a);
  }
  ctx.restore();
}

function spawnPetal(){
  const h = hearts[(Math.random() * hearts.length) | 0]; if (!h) return;
  petals.push({
    x: h.x + rand(-8, 8), y: h.y + rand(-8, 8),
    vy: rand(14, 30), vx: rand(-8, 8), sway: rand(0.6, 1.4),
    phase: rand(0, 6.28), box: h.box * rand(0.34, 0.6),
    idx: h.idx, rot: rand(0, 6.28), vrot: rand(-1.4, 1.4),
    age: 0, land: groundY + rand(-6, H * 0.05),
  });
}

function drawPetals(t, dt){
  for (let i = petals.length - 1; i >= 0; i--){
    const p = petals[i]; p.age += dt; p.vy += 8 * dt;
    p.x += (p.vx + Math.sin(t * p.sway + p.phase) * 16) * dt;
    p.y += p.vy * dt; p.rot += p.vrot * dt;
    if (p.y >= p.land){
      rested.push({ x: clamp(p.x, 6, W - 6), y: p.land, box: p.box, idx: p.idx, rot: p.rot, a: rand(0.7, 0.95) });
      if (rested.length > 90) rested.shift();
      petals.splice(i, 1); continue;
    }
    const a = p.age < 0.3 ? p.age / 0.3 : 1;
    drawSprite(SPR.crisp[p.idx], p.x, p.y, p.box, p.rot, a);
  }
}

function drawRested(){
  for (const r of rested) drawSprite(SPR.crisp[r.idx], r.x, r.y, r.box, r.rot, r.a);
}

function showWish(on){ wishEl.classList.toggle('is-in', on); }

/* Tree rAF Engine */
let treeStartT = 0, treeLastT = 0, treeRAF = 0, lastPetal = 0, replayArmed = false;
window.bdayDone = false;

function treeFrame(now){
  if (!treeStartT){ treeStartT = now; treeLastT = now; }
  const t  = (now - treeStartT) / 1000;
  const dt = Math.min(0.05, (now - treeLastT) / 1000); treeLastT = now;

  const rays = clamp01((t - T.bloomT0) / T.bloomSpan);

  drawBackground();
  drawGodRays(t, rays);
  drawGlow(t);
  drawBokeh(t, dt);
  drawFloaters(t, dt, false);
  drawBranches(t);
  drawHearts(t);
  updateTwinkles(t, dt);
  if (t > T.petalT0 && now - lastPetal > 150){ spawnPetal(); spawnPetal(); lastPetal = now; }
  drawPetals(t, dt);
  drawRested();
  drawFloaters(t, dt, true);

  showWish(t >= T.noteStart);

  if (!window.bdayDone && t >= T.done) window.bdayDone = true;
  if (!replayArmed && t >= T.done + 1.0){
    replayArmed = true;
    const finaleBar = $('finaleBar');
    const finaleNav = $('finaleNav');
    if (finaleBar) finaleBar.hidden = false;
    if (finaleNav) finaleNav.hidden = false;
  }

  treeRAF = requestAnimationFrame(treeFrame);
}

function treeStart(){
  treeStartT = 0; treeLastT = 0; lastPetal = 0; replayArmed = false; window.bdayDone = false;
  cue('grow');
  buildScene();
  if (treeRAF) cancelAnimationFrame(treeRAF);
  treeRAF = requestAnimationFrame(treeFrame);
}

function treeStop(){
  if (treeRAF){ cancelAnimationFrame(treeRAF); treeRAF = 0; }
  ctx.clearRect(0, 0, W, H);
}

function drawFinal(){
  buildScene();
  drawBackground(); drawGodRays(0, 1); drawGlow(T.done); drawBokeh(0, 0); drawFloaters(99, 0, false);
  drawBranches(99); drawHearts(99);
  for (let i = 0; i < 40; i++){
    const h = hearts[(Math.random() * hearts.length) | 0];
    if (h) rested.push({ x: clamp(h.x + rand(-W * 0.3, W * 0.3), 6, W - 6), y: groundY + rand(-6, H * 0.05), box: h.box * 0.5, idx: h.idx, rot: rand(0, 6.28), a: 0.85 });
  }
  drawRested(); drawFloaters(99, 0, true);
  showWish(true);
  window.bdayDone = true;
  const finaleBar = $('finaleBar');
  const finaleNav = $('finaleNav');
  if (finaleBar) finaleBar.hidden = false;
  if (finaleNav) finaleNav.hidden = false;
}

/* ============================================================
   CHAPTER 1: THE INVITATION (Archery + Arrow + Flood)
   ============================================================ */
function splitWord(el){
  if (!el) return [];
  const chars = [...el.textContent];
  el.textContent = '';
  return chars.map((ch) => {
    const s = document.createElement('span');
    s.className = 'hl__ch';
    s.textContent = ch;
    el.appendChild(s);
    return s;
  });
}
const wLine1 = $('wLine1'), wLine2 = $('wLine2');
const kChars = (wLine1 && wLine2) ? [...splitWord(wLine1), ...splitWord(wLine2)] : [];

function buildMotes(){
  if (!motes) return;
  motes.innerHTML = '';
  const count = 18;
  for (let i = 0; i < count; i++){
    const m = document.createElement('span');
    m.className = 'mote';
    const sz = rand(6, 26);
    m.style.width = sz + 'px'; m.style.height = sz + 'px';
    m.style.left = rand(5, 95) + '%'; m.style.top = rand(10, 90) + '%';
    motes.appendChild(m);
    gsap.to(m, {
      x: rand(-40, 40), y: rand(-50, 50),
      duration: rand(5, 11), repeat: -1, yoyo: true, ease: 'sine.inOut', delay: rand(0, 4),
    });
    gsap.to(m, {
      opacity: rand(0.2, 0.75), duration: rand(2.5, 5), repeat: -1, yoyo: true, ease: 'sine.inOut', delay: rand(0, 3),
    });
  }
}

const REST_NOCK = 96;
const nockProxy = { val: REST_NOCK };
function applyNock(){
  const y = nockProxy.val;
  if (strL) { strL.setAttribute('x2', '230'); strL.setAttribute('y2', y); }
  if (strR) { strR.setAttribute('x2', '230'); strR.setAttribute('y2', y); }
  if (serving) serving.setAttribute('cy', y);
}

let aimRad = 0, pullUX = 0, pullUY = 0, maxDraw = 60, curDraw = 0;
let arrowBaseX = 0, arrowBaseY = 0, svgScale = 1, gripX = 0, gripY = 0;

function refreshRig(){
  const winW = window.innerWidth;
  const winH = window.innerHeight;
  if (!target || !archery) return;

  const tR = target.getBoundingClientRect();
  const tcx = (tR && tR.width > 0) ? (tR.left + tR.width / 2) : (winW / 2);
  const tcy = (tR && tR.height > 0) ? (tR.top + tR.height / 2) : (winH * 0.33);

  // Temporarily reset transform so measurements are never skewed by prior rotation
  gsap.set(archery, { rotation: 0, scale: 1 });

  const wArchery = archery.offsetWidth || 140;
  svgScale = Math.max(wArchery / 460, 0.2);
  const gripLX = wArchery * 0.50;
  const gripLY = 241 * svgScale;

  gripX = clamp(winW * 0.20, 70, 240);
  gripY = clamp(winH * 0.80, winH - 220, winH - 80);

  const dx = tcx - gripX;
  const dy = tcy - gripY;
  const angleToHeart = Math.atan2(dy, dx);
  aimRad = angleToHeart + Math.PI / 2;

  // Vector pointing AWAY from the heart (the pull-back axis)
  pullUX = -Math.cos(angleToHeart);
  pullUY = -Math.sin(angleToHeart);

  const nockLX = wArchery * 0.50;
  const nockLY = 96 * svgScale;

  const arrowW = wArchery * 0.175;
  const arrowScale = arrowW / 64;
  const arrowNockX = 32 * arrowScale;
  const arrowNockY = 205 * arrowScale;

  arrowBaseX = nockLX - arrowNockX;
  arrowBaseY = nockLY - arrowNockY;

  archery.style.left = (gripX - gripLX) + 'px';
  archery.style.top  = (gripY - gripLY) + 'px';

  gsap.set(archery, {
    transformOrigin: `${gripLX}px ${gripLY}px`,
    rotation: aimRad * 180 / Math.PI,
  });
  gsap.set(arrow, { x: arrowBaseX, y: arrowBaseY, rotation: 0 });

  maxDraw = Math.min(300 * svgScale * 0.72, H * 0.16, 132);
  curDraw = 0;
}

function setDraw(d){
  if (!arrow) return;
  curDraw = clamp(d, 0, maxDraw);
  gsap.set(arrow, { x: arrowBaseX, y: arrowBaseY + curDraw });
  nockProxy.val = REST_NOCK + curDraw / svgScale;
  applyNock();
  if (aim) gsap.set(aim, { opacity: 0.65 * (curDraw / maxDraw) });
}

let beatTL = null;
function startBeat(){
  gsap.set(targetHeart, { scale: 1 });
  gsap.set(heartGlow, { scale: 1, opacity: 0.7 });
  beatTL = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });
  beatTL.to(targetHeart, { scale: 1.07, duration: 0.13, ease: 'power2.out' }, 0)
        .to(heartGlow,   { scale: 1.15, opacity: 0.9, duration: 0.13, ease: 'power2.out' }, 0)
        .to(targetHeart, { scale: 1.0, duration: 0.2, ease: 'power2.in' }, 0.13)
        .to(targetHeart, { scale: 1.05, duration: 0.12, ease: 'power2.out' }, 0.3)
        .to(targetHeart, { scale: 1.0, duration: 0.5, ease: 'power2.inOut' }, 0.42)
        .to(heartGlow,   { scale: 1.0, opacity: 0.7, duration: 0.7, ease: 'power2.inOut' }, 0.3);
}
function stopBeat(){ if (beatTL){ beatTL.kill(); beatTL = null; } gsap.set(targetHeart, { scale: 1 }); }

function miniHeartSVG(fill){
  return `<svg viewBox="0 0 24 22" width="100%" height="100%"><path d="M12 20C5.5 15 1.5 11.4 1.5 6.9 1.5 3.6 4 1.5 7 1.5c2 0 3.4 1.1 5 3 1.6-1.9 3-3 5-3 3 0 5.5 2.1 5.5 5.4C23.5 11.4 19.5 15 12 20Z" fill="${fill}"/></svg>`;
}

function burstHearts(){
  const r = target.getBoundingClientRect();
  const hr = hero.getBoundingClientRect();
  const ox = r.left - hr.left + r.width / 2;
  const oy = r.top - hr.top + r.height * 0.42;
  const cols = ['#ff6f97', '#ffb14e', '#ff8fae', '#ffd36a', '#e23b67'];
  const frag = document.createDocumentFragment();
  const nodes = [];
  for (let i = 0; i < 12; i++){
    const heart = i < 8;
    const el = document.createElement('span');
    el.className = 'burst';
    const s = heart ? rand(12, 22) : rand(4, 8);
    el.style.cssText = `position:absolute;left:${ox}px;top:${oy}px;width:${s}px;height:${s}px;margin:${-s / 2}px 0 0 ${-s / 2}px;pointer-events:none;z-index:4;`;
    if (heart) el.innerHTML = miniHeartSVG(pick(cols));
    else { el.style.borderRadius = '50%'; el.style.background = 'radial-gradient(circle,#fff,rgba(255,210,150,0) 70%)'; }
    frag.appendChild(el); nodes.push({ el, heart });
  }
  hero.appendChild(frag);
  nodes.forEach(({ el, heart }) => {
    const ang = rand(-Math.PI, 0);
    const dist = rand(heart ? 70 : 40, heart ? 190 : 120);
    gsap.to(el, {
      x: Math.cos(ang) * dist, y: Math.sin(ang) * dist - rand(10, 50),
      rotation: rand(-120, 120), scale: heart ? rand(0.7, 1.2) : rand(0.4, 1),
      duration: rand(0.7, 1.15), ease: 'power2.out',
    });
    gsap.to(el, { opacity: 0, duration: 0.5, delay: rand(0.35, 0.6), ease: 'power1.in', onComplete: () => el.remove() });
  });
}

function shotGeom(){
  const tipEl = $('tip');
  const tipR = tipEl ? tipEl.getBoundingClientRect() : null;
  const tRect = target.getBoundingClientRect();
  const tcx = tRect.left + tRect.width / 2, tcy = tRect.top + tRect.height / 2;

  let tipX = 0, tipY = 0;
  if (tipR && tipR.width > 0 && tipR.left > 0){
    tipX = tipR.left + tipR.width / 2;
    tipY = tipR.top + tipR.height / 2;
  } else {
    // Robust geometric fallback based on screen grip position and arrow length
    const arrowW = archery.offsetWidth * 0.175;
    const arrowLen = arrowW * (220 / 64);
    const ang = aimRad - Math.PI / 2;
    tipX = gripX + Math.cos(ang) * (arrowLen * 0.85);
    tipY = gripY + Math.sin(ang) * (arrowLen * 0.85);
  }

  const flightDist = Math.hypot(tcx - tipX, tcy - tipY);
  const fallPx = Math.min(H * 0.26, H - tcy - tRect.height * 0.4);
  const impactX = tcx, impactY = tcy + fallPx;
  const distC = Math.hypot(Math.max(impactX, W - impactX), Math.max(impactY, H - impactY));
  const reach = Math.hypot(W / 2, H / 2);
  return {
    arrowStartY: arrowBaseY + curDraw,
    arrowFlyY:   arrowBaseY + curDraw - flightDist,
    drawnNock:   REST_NOCK + curDraw / svgScale,
    fallPx, fx: impactX - W / 2, fy: impactY - H / 2,
    floodScale: (distC * 1.12) / 70, bloomScale: (reach * 1.2) / 30,
  };
}

let filmTL = null;
function buildFilm(m){
  const t = gsap.timeline({
    paused: true,
    onComplete: () => {
      // Climax of Chapter 1: Reveal Continue prompt
      const ch1Continue = $('ch1ContinueWrap');
      if (ch1Continue) {
        ch1Continue.hidden = false;
        ch1Continue.style.opacity = '1';
      }
    },
  });

  t.set(target, { y: 0, scaleX: 1, scaleY: 1, opacity: 1 })
   .set(arrow, { opacity: 1, x: arrowBaseX, y: m.arrowStartY, scaleY: 1 })
   .set([flood, bloom], { autoAlpha: 0, scale: 0.001, x: 0, y: 0 })
   .set(flood, { x: m.fx, y: m.fy })
   .set(field, { autoAlpha: 1 })
   .set('.blob', { opacity: 0 })
   .set(camera, { scale: 1, yPercent: 0 })
   .set(fgrid, { xPercent: 0, yPercent: 0 })
   .set(barTop, { yPercent: -100 })
   .set(barBot, { yPercent: 100 })
   .set(kEyebrow, { opacity: 0, y: 12 })
   .set(kSub, { opacity: 0, y: 12 })
   .set(kChars, { transformPerspective: 620, transformOrigin: '50% 100%', yPercent: 135, rotationX: -82 })
   .set(uline, { drawn: 0 });

  t.fromTo(nockProxy, { val: m.drawnNock }, { val: REST_NOCK, duration: 0.5, ease: 'elastic.out(1,0.34)', onUpdate: applyNock }, 0)
   .to(arrow, { y: m.arrowFlyY, duration: 0.26, ease: 'power2.in' }, 0)
   .to(arrow, { scaleY: 1.16, duration: 0.14, ease: 'power2.in' }, 0)
   .to(arrow, { scaleY: 1.0, duration: 0.1, ease: 'power1.out' }, 0.16)
   .to(aim, { opacity: 0, duration: 0.18 }, 0)
   .to([eyebrow, hint], { opacity: 0, duration: 0.2, ease: 'power1.out' }, 0);

  t.add(burstHearts, 0.26)
   .to(target, { x: 7, y: -9, duration: 0.06, ease: 'power2.out' }, 0.26)
   .to(target, { x: 0, y: 0, duration: 0.32, ease: 'power2.out' }, 0.32)
   .to(target, { scale: 1.14, duration: 0.06, ease: 'power2.out' }, 0.26)
   .to(target, { scale: 1.0, duration: 0.3, ease: 'power2.inOut' }, 0.32)
   .to(arrow, { y: m.arrowFlyY - 14, duration: 0.06, ease: 'power2.out' }, 0.26)
   .to(arrow, { y: m.arrowFlyY - 8, duration: 0.32, ease: 'power2.out' }, 0.32);

  const fallT0 = 0.65;
  t.to(target, { y: m.fallPx, rotation: -7, duration: 0.62, ease: 'power2.in' }, fallT0)
   .to(target, { scaleX: 0.96, scaleY: 1.04, duration: 0.62, ease: 'power1.in' }, fallT0)
   .to(arrow,  { y: m.arrowFlyY - 8 + m.fallPx, rotation: -7, duration: 0.62, ease: 'power2.in' }, fallT0)
   .to(targetHeart, { filter: 'drop-shadow(0 20px 30px rgba(120,6,38,.55))', duration: 0.62 }, fallT0);

  const burstT0 = fallT0 + 0.60;
  t.set(target, { opacity: 0 }, burstT0)
   .set(arrow,  { opacity: 0 }, burstT0)
   .to(flood,   { autoAlpha: 1, scale: m.floodScale, duration: 0.72, ease: 'power3.inOut' }, burstT0)
   .set(field,  { autoAlpha: 1 }, burstT0 + 0.32)
   .set(hero,   { autoAlpha: 0 }, burstT0 + 0.72)
   .to(barTop,  { yPercent: 0, duration: 0.7, ease: 'power3.out' }, burstT0 + 0.35)
   .to(barBot,  { yPercent: 0, duration: 0.7, ease: 'power3.out' }, burstT0 + 0.35)
   .to('.blob--1', { opacity: 0.7, duration: 1.2, ease: 'power2.out' }, burstT0 + 0.4)
   .to('.blob--2', { opacity: 0.55, duration: 1.2, ease: 'power2.out' }, burstT0 + 0.5)
   .to('.blob--3', { opacity: 0.65, duration: 1.2, ease: 'power2.out' }, burstT0 + 0.6);

  const wishT0 = burstT0 + 0.78;
  t.to(kEyebrow, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, wishT0)
   .to(kChars, {
      yPercent: 0, rotationX: 0,
      duration: 0.78, ease: 'back.out(1.55)',
      stagger: { each: 0.038, from: 'start' },
    }, wishT0 + 0.18)
   .to(uline, { drawn: 1, duration: 0.95, ease: 'power2.out' }, wishT0 + 0.72)
   .to(kSub,   { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out' }, wishT0 + 0.95)
   .to(camera, { scale: 1.055, duration: 2.2, ease: 'none' }, wishT0)
   .to(fgrid,  { yPercent: -4, duration: 2.2, ease: 'none' }, wishT0)
   .add(() => {
     const ch1Continue = $('ch1ContinueWrap');
     if (ch1Continue) {
       ch1Continue.hidden = false;
       gsap.fromTo(ch1Continue, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
     }
   }, wishT0 + 1.2);

  return t;
}

let played = false, drawing = false, startPX = 0, startPY = 0, startDraw = 0, hasDragged = false;

function fire(){
  if (played) return;
  played = true; drawing = false; stopBeat();
  cue('release'); cue('whoosh');
  filmTL = buildFilm(shotGeom());
  filmTL.play(0);
}

function springBack(){
  const from = curDraw;
  gsap.to({ d: from }, {
    d: 0,
    duration: 0.55,
    ease: 'elastic.out(1,0.4)',
    onUpdate() { setDraw(this.targets()[0].d); }
  });
}

function autoFire(){
  if (played) return;
  recT0 = performance.now(); cue('draw');
  gsap.to({ d: curDraw }, {
    d: maxDraw * 0.94, duration: 0.62, ease: 'power2.inOut',
    onUpdate() { setDraw(this.targets()[0].d); },
    onComplete: () => gsap.delayedCall(0.16, fire),
  });
}

function onPointerDown(e){
  if (played) return;
  drawing = true;
  hasDragged = false;
  startPX = e.clientX;
  startPY = e.clientY;
  startDraw = curDraw;
  window.addEventListener('pointermove', onPointerMove, { passive: false });
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerUp);
  e.preventDefault();
}

function onPointerMove(e){
  if (!drawing) return;
  const dx = e.clientX - startPX;
  const dy = e.clientY - startPY;
  if (Math.hypot(dx, dy) > 8) hasDragged = true;

  // Project drag vector onto the pull-back axis (away from heart)
  const proj = dx * pullUX + dy * pullUY;
  setDraw(startDraw + proj);
}

function onPointerUp(e){
  if (!drawing) return;
  drawing = false;
  window.removeEventListener('pointermove', onPointerMove);
  window.removeEventListener('pointerup', onPointerUp);
  window.removeEventListener('pointercancel', onPointerUp);

  if (curDraw > maxDraw * 0.22){
    fire();
  } else if (!hasDragged){
    // If the user tapped / clicked without dragging, auto-draw and fire!
    autoFire();
  } else {
    springBack();
  }
}

if (archery){
  archery.addEventListener('pointerdown', onPointerDown);
  archery.addEventListener('keydown', (e) => {
    if (played) return;
    if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); autoFire(); }
  });
}

if (hint){
  hint.addEventListener('click', () => { if (!played) autoFire(); });
}

if (target){
  target.addEventListener('click', () => { if (!played) autoFire(); });
}

/* ============================================================
   CHAPTER 1: SIMPLE & ELEGANT BIRTHDAY HOMEPAGE
   Target Heart (Top) + Interactive Golden Bow & Arrow (Bottom)
   ============================================================ */
let cupidInitialized = false;

function initCupidCenterpiece(){
  const centerpiece = $('cupidCenterpiece');
  const arrowCarrier = $('cupidArrowCarrier');
  const heartGroup = $('cupidHeartGroup');
  const pulseGlow = $('cupidPulseGlow');
  const bowString = $('cupidBowString');
  const instruction = $('cupidInstruction');
  const ch1NextBtn = $('ch1NextBtn');
  if (!centerpiece || !arrowCarrier || !heartGroup) return;

  let isPulling = false;
  let hasHit = false;
  let isFlying = false;
  let dragStartY = 0;
  let currentPull = 0;

  // Initial resting state: arrow on bowstring at bottom
  gsap.set(arrowCarrier, { x: 0, y: 0, opacity: 1 });
  if (bowString) bowString.setAttribute('d', 'M 82 360 L 170 372 L 258 360');
  if (instruction && !hasHit) instruction.innerHTML = 'PULL TO RELEASE';

  if (arrowCarrier.dataset.hasCupidListener === 'true') return;
  arrowCarrier.dataset.hasCupidListener = 'true';

  function updateBowstring(dy){
    if (!bowString) return;
    const nockY = 372 + dy;
    bowString.setAttribute('d', `M 82 360 L 170 ${nockY} L 258 360`);
  }

  function launchArrow(){
    if (hasHit || isFlying) return;
    isFlying = true;
    isPulling = false;

    // Bowstring snap animation
    if (bowString){
      gsap.timeline()
        .to(bowString, {
          duration: 0.08,
          onUpdate: () => bowString.setAttribute('d', 'M 82 360 L 170 354 L 258 360')
        })
        .to(bowString, {
          duration: 0.25,
          ease: 'elastic.out(1, 0.4)',
          onUpdate: () => bowString.setAttribute('d', 'M 82 360 L 170 372 L 258 360')
        });
    }

    // Arrow travels swiftly upwards toward the target heart center (y: -165px)
    gsap.to(arrowCarrier, {
      y: -165,
      duration: 0.32,
      ease: 'power3.in',
      onComplete: () => {
        isFlying = false;
        hasHit = true;

        // Heart impact recoil & elastic bounce
        gsap.timeline({
          onComplete: () => {
            // Reveal Continue button and unlock Page 2 ONLY AFTER the full heart impact animation finishes
            completeChapter('chapter1');
          }
        })
          .to(heartGroup, {
            scale: 1.25,
            duration: 0.16,
            ease: 'back.out(2)',
            transformOrigin: '170px 82px'
          })
          .to(heartGroup, {
            scale: 1,
            duration: 0.55,
            ease: 'elastic.out(1, 0.45)',
            transformOrigin: '170px 82px'
          });

        // Glowing shockwave behind heart
        if (pulseGlow){
          gsap.fromTo(pulseGlow,
            { scale: 0.85, opacity: 0.25 },
            { scale: 1.55, opacity: 0.95, duration: 0.4, yoyo: true, repeat: 1, ease: 'power2.out' }
          );
        }

        // Sparkles and celebration burst right on the heart impact point
        const rect = centerpiece.getBoundingClientRect();
        const burstX = rect.left + rect.width * 0.5;
        const burstY = rect.top + rect.height * 0.22;
        spawnCelebrationBurst(burstX, burstY);

        if (instruction){
          instruction.innerHTML = '✨ Bullseye! Happy Birthday Ranjeetha Sri! ❤️';
          gsap.fromTo(instruction, { scale: 0.95 }, { scale: 1, duration: 0.35, ease: 'back.out(2)' });
        }

        tryPlayMusic();
      }
    });
  }
  window.launchCupidArrow = launchArrow;

  // Pointer interactions on Arrow Carrier
  arrowCarrier.style.cursor = 'grab';
  arrowCarrier.style.touchAction = 'none';

  function onPointerStart(e){
    if (isFlying) return;
    if (hasHit){
      // Allow replaying: reset arrow back to bow
      hasHit = false;
      gsap.to(arrowCarrier, { y: 0, duration: 0.35, ease: 'power2.out' });
      if (instruction) instruction.innerHTML = 'PULL TO RELEASE';
      return;
    }
    isPulling = true;
    dragStartY = e.clientY;
    currentPull = 0;
    arrowCarrier.style.cursor = 'grabbing';
    try { arrowCarrier.setPointerCapture(e.pointerId); } catch (_) {}
    document.body.style.overflow = 'hidden';
  }

  arrowCarrier.addEventListener('pointerdown', onPointerStart);

  const bowFrame = $('cupidBowFrame');
  if (bowFrame){
    bowFrame.style.cursor = 'grab';
    bowFrame.addEventListener('pointerdown', onPointerStart);
  }

  window.addEventListener('pointermove', (e) => {
    if (!isPulling || hasHit || isFlying) return;
    const deltaY = e.clientY - dragStartY;
    // Allow pulling downward up to 65px
    const pull = Math.max(0, Math.min(65, deltaY));
    currentPull = pull;

    gsap.set(arrowCarrier, { y: pull });
    updateBowstring(pull);

    if (instruction){
      if (pull >= 10){
        instruction.innerHTML = 'RELEASE TO SHOOT! 🎯';
      } else {
        instruction.innerHTML = 'PULL DOWNWARD 🏹';
      }
    }
  });

  function onPointerEnd(e){
    if (!isPulling) return;
    isPulling = false;
    arrowCarrier.style.cursor = 'grab';
    document.body.style.overflow = '';
    try {
      if (arrowCarrier.hasPointerCapture && arrowCarrier.hasPointerCapture(e.pointerId)){
        arrowCarrier.releasePointerCapture(e.pointerId);
      }
    } catch (_) {}

    if (!hasHit && !isFlying){
      if (currentPull >= 10){
        launchArrow();
      } else {
        // Return smoothly to resting bowstring
        gsap.to(arrowCarrier, {
          y: 0,
          duration: 0.28,
          ease: 'elastic.out(1, 0.45)',
          onUpdate: () => updateBowstring(gsap.getProperty(arrowCarrier, 'y')),
          onComplete: () => {
            updateBowstring(0);
            if (instruction) instruction.innerHTML = 'PULL TO RELEASE';
          }
        });
        currentPull = 0;
      }
    }
  }

  window.addEventListener('pointerup', onPointerEnd);
  window.addEventListener('pointercancel', onPointerEnd);

  // Heart gentle beat on click if not shot yet
  heartGroup.style.cursor = 'pointer';
  heartGroup.addEventListener('click', () => {
    if (!hasHit){
      gsap.to(heartGroup, {
        scale: 1.08,
        duration: 0.15,
        yoyo: true,
        repeat: 1,
        ease: 'power2.out',
        transformOrigin: '170px 82px'
      });
      if (instruction) instruction.innerHTML = 'PULL THE ARROW DOWN &amp; RELEASE! 🏹';
    }
  });
}

function enterChapter1(){
  initCupidCenterpiece();
}

function resetChapter1(){
  initCupidCenterpiece();
}

/* ============================================================
   GLOBAL INTERACTIVE PAGE COMPLETION & NAVIGATION SYSTEM
   (Strict task completion required before next page unlocks)
   ============================================================ */
const PAGE_ORDER = ['chapter1', 'chapterCake', 'chapter2', 'chapter3', 'chapter4', 'chapter5', 'chapter6'];
const completedPages = new Set();
let highestUnlockedPageIndex = 0; // Starts at index 0 (chapter1)

function isPageUnlocked(pageId){
  const idx = PAGE_ORDER.indexOf(pageId);
  return idx !== -1 && idx <= highestUnlockedPageIndex;
}

function unlockPage(pageId){
  const idx = PAGE_ORDER.indexOf(pageId);
  if (idx > highestUnlockedPageIndex){
    highestUnlockedPageIndex = idx;
  }
  const el = $(pageId);
  if (el){
    el.classList.remove('is-locked');
  }
  // Initialize target page when unlocked
  if (pageId === 'chapterCake') enterChapterCake();
  if (pageId === 'chapter2') enterChapter2();
  if (pageId === 'chapter3') initChapter3();
  if (pageId === 'chapter4') enterChapter4();
  if (pageId === 'chapter5') enterChapter5();
  if (pageId === 'chapter6') enterChapter6();
}

function navigateToPage(targetPageId){
  unlockPage(targetPageId);
  const targetEl = $(targetPageId);
  if (targetEl){
    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function completeChapter(stepKey){
  completedPages.add(stepKey);

  let btnId = null;
  let nextPageId = null;

  if (stepKey === 1 || stepKey === 'chapter1'){
    btnId = 'ch1NextBtn';
    nextPageId = 'chapterCake';
    completedPages.add(1);
    completedPages.add('chapter1');
  } else if (stepKey === 2 || stepKey === 'cake' || stepKey === 'chapterCake'){
    btnId = 'cakeNextBtn';
    nextPageId = 'chapter2';
    completedPages.add(2);
    completedPages.add('chapterCake');
  } else if (stepKey === 3 || stepKey === 'chapter2'){
    btnId = 'ch2NextBtn';
    nextPageId = 'chapter3';
    completedPages.add(3);
    completedPages.add('chapter2');
  } else if (stepKey === 4 || stepKey === 'chapter3'){
    btnId = 'ch3NextBtn';
    nextPageId = 'chapter4';
    completedPages.add(4);
    completedPages.add('chapter3');
  } else if (stepKey === 5 || stepKey === 'chapter4'){
    btnId = 'ch4NextBtn';
    nextPageId = 'chapter5';
    completedPages.add(5);
    completedPages.add('chapter4');
  } else if (stepKey === 6 || stepKey === 'chapter5'){
    btnId = 'ch5NextBtn';
    nextPageId = 'chapter6';
    completedPages.add(6);
    completedPages.add('chapter5');
  }

  // Reveal Continue button only when completed
  if (btnId){
    const nextBtn = $(btnId);
    if (nextBtn && nextBtn.classList.contains('is-gated')){
      nextBtn.classList.remove('is-gated');
      if (window.gsap){
        gsap.fromTo(nextBtn,
          { opacity: 0, y: 14, scale: 0.94 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.8)' }
        );
      }
    }
  }

  // Pre-unlock the next section in the DOM so it becomes accessible
  if (nextPageId){
    unlockPage(nextPageId);
  }
}
window.completeChapter = completeChapter;
window.navigateToPage = navigateToPage;

// Backward compatibility aliases
function unlockChapter(num){
  if (num === 1) unlockPage('chapter1');
  else if (num === 2) unlockPage('chapterCake');
  else if (num === 3) unlockPage('chapter2');
  else if (num === 4) unlockPage('chapter3');
  else if (num === 5) unlockPage('chapter4');
  else if (num === 6) unlockPage('chapter5');
  else if (num === 7) unlockPage('chapter6');
}

function scrollToChapter(targetNum){
  const targetId = PAGE_ORDER[targetNum - 1];
  if (targetId) navigateToPage(targetId);
}

function onContinueFrom(currentNum){
  const nextId = PAGE_ORDER[currentNum];
  if (nextId) navigateToPage(nextId);
}

function onBackFrom(currentNum){
  const prevId = PAGE_ORDER[currentNum - 2];
  if (prevId) navigateToPage(prevId);
}

/* ============================================================
   PAGE 2: REALISTIC BIRTHDAY CAKE CUTTING ANIMATION
   (Two-stage reveal: whole cake first, then hand & knife enter)
   ============================================================ */
let isCakeCut = false;
let isDraggingKnife = false;
let knifeDragStartY = 0;
let knifeCurrentY = 0;
let knifeHasMoved = false;
let cakeHasEntered = false;

function enterChapterCake(){
  if (cakeHasEntered) return;
  cakeHasEntered = true;

  const knifeRig = $('knifeRig');
  const cakeStage = $('cakeStage');
  const cakeInstruction = $('cakeInstruction');
  const cakeSliceGuide = $('cakeSliceGuide');

  // Stage 1: Display complete, uncut cake - no hand/knife initially
  if (knifeRig && window.gsap){
    gsap.set(knifeRig, { opacity: 0, x: 95 });
  } else if (knifeRig){
    knifeRig.style.opacity = '0';
  }

  if (cakeInstruction){
    cakeInstruction.textContent = "Let's Cut the Cake! 🎂";
  }

  if (cakeStage && window.gsap){
    gsap.fromTo(cakeStage,
      { opacity: 0, scale: 0.94, y: 16 },
      { opacity: 1, scale: 1, y: 0, duration: 0.85, ease: 'power2.out' }
    );
  }

  // Stage 2: Hand and knife smoothly enter after initial cake reveal
  setTimeout(() => {
    if (isCakeCut) return;
    if (knifeRig && window.gsap){
      gsap.to(knifeRig, {
        opacity: 1,
        x: 0,
        duration: 0.9,
        ease: 'power3.out'
      });
    } else if (knifeRig){
      knifeRig.style.opacity = '1';
    }

    if (cakeInstruction && !isCakeCut){
      cakeInstruction.textContent = "Drag the knife to cut the cake ❤️";
      if (window.gsap){
        gsap.fromTo(cakeInstruction,
          { opacity: 0.4, y: -4 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
        );
      }
    }
  }, 750);
}

function initCakeCutting(){
  const knifeRig = $('knifeRig');
  const cakeStage = $('cakeStage');
  const cakeHalfLeft = $('cakeHalfLeft');
  const cakeHalfRight = $('cakeHalfRight');
  const leftCutFace = $('leftCutFace');
  const rightCutFace = $('rightCutFace');
  const cakeInstruction = $('cakeInstruction');
  const cakeSliceGuide = $('cakeSliceGuide');
  const cakeNextBtn = $('cakeNextBtn');
  const cakeReplayBtn = $('cakeReplayBtn');
  const cakeCutTriggerBtn = $('cakeCutTriggerBtn');

  if (!knifeRig || !cakeStage) return;

  // Initial hidden state for hand and knife before enterChapterCake is invoked
  if (window.gsap){
    gsap.set(knifeRig, { opacity: 0, x: 95 });
  } else {
    knifeRig.style.opacity = '0';
  }

  function performCut(){
    if (isCakeCut) return;
    isCakeCut = true;
    isDraggingKnife = false;
    document.body.style.overflow = '';

    // Plunge knife down smoothly through the cake along the CUT HERE line
    if (window.gsap){
      gsap.to(knifeRig, {
        y: 128,
        duration: 0.45,
        ease: 'power2.inOut',
        onComplete: () => {
          gsap.to(knifeRig, { y: 78, opacity: 0.82, duration: 0.7, ease: 'power2.out' });
        }
      });

      // Animate cake halves parting smoothly to reveal interior
      gsap.to(cakeHalfLeft, {
        x: -32,
        rotation: -2.2,
        duration: 0.9,
        ease: 'power2.out'
      });
      gsap.to(cakeHalfRight, {
        x: 32,
        rotation: 2.2,
        duration: 0.9,
        ease: 'power2.out'
      });

      // Reveal inner moist sponge & strawberry cream cross sections
      if (leftCutFace && rightCutFace){
        gsap.to([leftCutFace, rightCutFace], { opacity: 1, duration: 0.4, delay: 0.08 });
      }

      // Hide the CUT HERE guide and action trigger
      if (cakeSliceGuide){
        gsap.to(cakeSliceGuide, { opacity: 0, duration: 0.3, onComplete: () => { cakeSliceGuide.style.display = 'none'; } });
      }
      if (cakeCutTriggerBtn){
        gsap.to(cakeCutTriggerBtn, { opacity: 0, scale: 0.9, duration: 0.35, onComplete: () => { cakeCutTriggerBtn.style.display = 'none'; } });
      }
    } else {
      knifeRig.style.transform = 'translateY(78px)';
      if (cakeHalfLeft) cakeHalfLeft.style.transform = 'translateX(-32px)';
      if (cakeHalfRight) cakeHalfRight.style.transform = 'translateX(32px)';
      if (leftCutFace) leftCutFace.style.opacity = '1';
      if (rightCutFace) rightCutFace.style.opacity = '1';
      if (cakeSliceGuide) cakeSliceGuide.style.display = 'none';
      if (cakeCutTriggerBtn) cakeCutTriggerBtn.style.display = 'none';
    }

    // Celebration message: "Happy Birthday, Ranjeetha Sri! ❤️"
    if (cakeInstruction){
      cakeInstruction.innerHTML = '<span class="cake-congrats">Happy Birthday, Ranjeetha Sri! ❤️</span>';
      if (window.gsap){
        gsap.fromTo(cakeInstruction,
          { opacity: 0, scale: 0.88, y: 8 },
          { opacity: 1, scale: 1, y: 0, duration: 0.65, ease: 'back.out(2)' }
        );
      }
    }

    // Celebration burst around the cake
    const rect = cakeStage.getBoundingClientRect();
    const burstX = rect.left + rect.width * 0.5;
    const burstY = rect.top + rect.height * 0.55;
    spawnCelebrationBurst(burstX, burstY);

    // Show replay button
    if (cakeReplayBtn){
      cakeReplayBtn.classList.add('is-active');
      if (window.gsap){
        gsap.fromTo(cakeReplayBtn, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.4, delay: 0.2, ease: 'power2.out' });
      }
    }

    // Complete Page 2 task and unlock Page 3 (chapter2: A Beautiful Beginning)
    completeChapter('chapterCake');
  }

  function resetCake(){
    isCakeCut = false;
    knifeCurrentY = 0;
    knifeHasMoved = false;

    if (cakeReplayBtn){
      cakeReplayBtn.classList.remove('is-active');
    }

    if (cakeCutTriggerBtn){
      cakeCutTriggerBtn.style.display = 'inline-flex';
      cakeCutTriggerBtn.style.opacity = '1';
    }

    if (window.gsap){
      gsap.to(cakeHalfLeft, { x: 0, rotation: 0, duration: 0.5, ease: 'power2.inOut' });
      gsap.to(cakeHalfRight, { x: 0, rotation: 0, duration: 0.5, ease: 'power2.inOut' });
      if (leftCutFace && rightCutFace){
        gsap.to([leftCutFace, rightCutFace], { opacity: 0, duration: 0.25 });
      }
      gsap.to(knifeRig, { y: 0, x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' });
      if (cakeSliceGuide){
        cakeSliceGuide.style.display = 'block';
        gsap.to(cakeSliceGuide, { opacity: 1, duration: 0.35 });
      }
    } else {
      if (cakeHalfLeft) cakeHalfLeft.style.transform = '';
      if (cakeHalfRight) cakeHalfRight.style.transform = '';
      knifeRig.style.transform = '';
      knifeRig.style.opacity = '1';
      if (cakeSliceGuide) cakeSliceGuide.style.display = 'block';
    }

    if (cakeInstruction){
      cakeInstruction.textContent = "Drag the knife to cut the cake ❤️";
    }
  }

  // Pointer drag interaction (Desktop and Mobile)
  knifeRig.addEventListener('pointerdown', (e) => {
    if (isCakeCut) return;
    isDraggingKnife = true;
    knifeHasMoved = false;
    knifeDragStartY = e.clientY - knifeCurrentY;
    document.body.style.overflow = 'hidden'; // Lock scrolling during active knife dragging

    try {
      knifeRig.setPointerCapture(e.pointerId);
    } catch (_) {}
  });

  window.addEventListener('pointermove', (e) => {
    if (!isDraggingKnife || isCakeCut) return;
    const dy = e.clientY - knifeDragStartY;
    if (Math.abs(dy) > 4) knifeHasMoved = true;
    knifeCurrentY = Math.max(0, Math.min(dy, 125));

    if (window.gsap){
      gsap.set(knifeRig, { y: knifeCurrentY });
    } else {
      knifeRig.style.transform = `translateY(${knifeCurrentY}px)`;
    }

    if (knifeCurrentY >= 68){
      performCut();
    }
  });

  function onPointerEnd(e){
    if (!isDraggingKnife) return;
    isDraggingKnife = false;
    document.body.style.overflow = ''; // Restore normal scrolling immediately after release

    try {
      if (knifeRig.hasPointerCapture && knifeRig.hasPointerCapture(e.pointerId)){
        knifeRig.releasePointerCapture(e.pointerId);
      }
    } catch (_) {}

    if (!isCakeCut){
      if (!knifeHasMoved || knifeCurrentY < 20){
        performCut();
      } else {
        if (window.gsap){
          gsap.to(knifeRig, { y: 0, duration: 0.35, ease: 'power2.out' });
        } else {
          knifeRig.style.transform = '';
        }
        knifeCurrentY = 0;
      }
    }
  }

  window.addEventListener('pointerup', onPointerEnd);
  window.addEventListener('pointercancel', onPointerEnd);

  // Tappable "Cut the Cake 🎂" action trigger button
  if (cakeCutTriggerBtn){
    cakeCutTriggerBtn.addEventListener('click', () => {
      if (!isCakeCut){
        performCut();
      }
    });
  }

  // Click on stage fallback
  cakeStage.addEventListener('click', (e) => {
    if (!isCakeCut && !knifeHasMoved && e.target !== cakeReplayBtn && e.target !== cakeNextBtn){
      performCut();
    }
  });

  if (cakeReplayBtn){
    cakeReplayBtn.addEventListener('click', resetCake);
  }
}

/* ============================================================
   PAGE 3: A BEAUTIFUL BEGINNING (Magical Memory Book)
   ============================================================ */
function enterChapter2(){
  const l1 = $('storyLine1'), l2 = $('storyLine2'), l3 = $('storyLine3');
  const msgs = BIRTHDAY_CONFIG.beginningStory;
  if (l1 && msgs[0]) l1.textContent = `“${msgs[0]}”`;
  if (l2 && msgs[1]) l2.textContent = `“${msgs[1]}”`;
  if (l3 && msgs[2]) l3.textContent = `“${msgs[2]}”`;

  [l1, l2, l3].forEach((el) => { if (el) el.classList.remove('is-revealed'); });

  let allLinesRevealed = false;

  // Reveal sequential greeting messages completely
  setTimeout(() => { if (l1) l1.classList.add('is-revealed'); }, 500);
  setTimeout(() => { if (l2) l2.classList.add('is-revealed'); }, 1800);
  setTimeout(() => {
    if (l3) l3.classList.add('is-revealed');
    allLinesRevealed = true;
    const confirmWrap = $('storyConfirmWrap');
    if (confirmWrap){
      confirmWrap.style.display = 'block';
      if (window.gsap){
        gsap.fromTo(confirmWrap, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 });
      }
    }
  }, 3200);

  function confirmStoryRead(){
    if (!allLinesRevealed){
      [l1, l2, l3].forEach((el) => { if (el) el.classList.add('is-revealed'); });
      allLinesRevealed = true;
    }
    const confirmBtn = $('storyConfirmBtn');
    if (confirmBtn){
      confirmBtn.innerHTML = '<span>Cherished with love ✨</span>';
      confirmBtn.disabled = true;
    }
    // Only after full message is revealed and confirmed
    completeChapter('chapter2');
  }

  const confirmBtn = $('storyConfirmBtn');
  if (confirmBtn){
    confirmBtn.addEventListener('click', confirmStoryRead);
  }

  // Tapping the memory book also confirms reading
  const book = $('memoryBook');
  if (book){
    book.addEventListener('click', (e) => {
      if (e.target.closest('#storyConfirmBtn')) return;
      confirmStoryRead();
    });
  }

  // Allow tapping any collage photo to bring it forward
  const collageCards = document.querySelectorAll('.book-collage__card');
  collageCards.forEach((card) => {
    card.addEventListener('click', (e) => {
      e.stopPropagation();
      collageCards.forEach(c => c.style.zIndex = '1');
      card.style.zIndex = '12';
    });
  });
}

/* ============================================================
   PAGE 4: LITTLE MOMENTS, BIG MEMORIES (17 Personal Photos)
   ============================================================ */
let chapter3Initialized = false;
const viewedMemories = new Set();

function markMemoryViewed(idx){
  if (idx < 0 || idx >= BIRTHDAY_CONFIG.photos.length) return;
  viewedMemories.add(idx);
  completeChapter('chapter3');
}
window.markMemoryViewed = markMemoryViewed;

function initChapter3(){
  if (chapter3Initialized) return;
  chapter3Initialized = true;

  // Ensure Chapter 3 is unlocked for smooth navigation
  completeChapter('chapter3');

  const grid = $('polaroidGrid');
  if (!grid) return;

  grid.innerHTML = BIRTHDAY_CONFIG.photos.map((item, idx) => `
    <article class="polaroid-card" data-index="${idx}" data-stage="${item.stageKey || ''}" tabindex="0" role="button" aria-label="Open ${item.title}">
      <div class="polaroid-tape" aria-hidden="true"></div>
      <div class="polaroid-photo">
        <img src="./images/${item.filename}" alt="${item.title}" loading="lazy" onerror="if(!this.dataset.retry){this.dataset.retry='1';this.src='./public/images/${item.filename}';}" style="${item.objectPosition ? `object-position: ${item.objectPosition};` : ''}" />
      </div>
      <div class="polaroid-caption">
        <div style="display:flex; align-items:center; justify-content:space-between; gap:8px; margin-bottom:6px;">
          <span class="polaroid-num" style="margin-bottom:0;">Memory #${item.id < 10 ? '0' + item.id : item.id}</span>
          <span class="polaroid-stage-tag" style="margin-bottom:0;">${item.stage}</span>
        </div>
        <h3 class="polaroid-title">${item.title}</h3>
        <p class="polaroid-desc">${item.caption}</p>
      </div>
    </article>
  `).join('');

  grid.querySelectorAll('.polaroid-card').forEach((card) => {
    const idx = parseInt(card.getAttribute('data-index'), 10);
    card.addEventListener('click', () => {
      markMemoryViewed(idx);
      openLightbox(idx);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        markMemoryViewed(idx);
        openLightbox(idx);
      }
    });
  });

  // Track each photo as it actually enters the visible viewport
  if ('IntersectionObserver' in window){
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting){
          const idx = parseInt(entry.target.getAttribute('data-index'), 10);
          if (!isNaN(idx)) markMemoryViewed(idx);
        }
      });
    }, { threshold: 0.25 });

    grid.querySelectorAll('.polaroid-card').forEach(card => cardObserver.observe(card));
  }
}

function enterChapter3(){
  initChapter3();
}

/* Lightbox Modal */
const lightbox         = $('lightbox');
const lightboxBackdrop = $('lightboxBackdrop');
const lightboxCloseBtn = $('lightboxCloseBtn');
const lightboxImg      = $('lightboxImg');
const lightboxBadge    = $('lightboxBadge');
const lightboxTitle    = $('lightboxTitle');
const lightboxDesc     = $('lightboxDesc');
const lightboxPrevBtn  = $('lightboxPrevBtn');
const lightboxNextBtn  = $('lightboxNextBtn');

let currentMemoryIdx = 0;

function updateLightboxContent(idx){
  const item = BIRTHDAY_CONFIG.photos[idx];
  if (!item) return;
  currentMemoryIdx = idx;
  markMemoryViewed(idx);

  if (lightboxImg){
    lightboxImg.src = `./images/${item.filename}`;
    lightboxImg.onerror = () => {
      if (!lightboxImg.dataset.retry) {
        lightboxImg.dataset.retry = '1';
        lightboxImg.src = `./public/images/${item.filename}`;
      }
    };
    lightboxImg.alt = `${item.title} - Memory ${item.id}`;
  }
  if (lightboxBadge) lightboxBadge.textContent = `${item.stage} • Memory ${item.id} of ${BIRTHDAY_CONFIG.photos.length}`;
  if (lightboxTitle) lightboxTitle.textContent = item.title;
  if (lightboxDesc)  lightboxDesc.textContent  = item.caption;
}

function openLightbox(index){
  updateLightboxContent(index);
  if (lightbox){
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    lightbox.focus();
  }
}

function closeLightbox(){
  if (lightbox){
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
  }
}

function prevMemory(){
  const nextIdx = (currentMemoryIdx - 1 + BIRTHDAY_CONFIG.photos.length) % BIRTHDAY_CONFIG.photos.length;
  updateLightboxContent(nextIdx);
}

function nextMemory(){
  const nextIdx = (currentMemoryIdx + 1) % BIRTHDAY_CONFIG.photos.length;
  updateLightboxContent(nextIdx);
}

if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
if (lightboxPrevBtn)  lightboxPrevBtn.addEventListener('click', prevMemory);
if (lightboxNextBtn)  lightboxNextBtn.addEventListener('click', nextMemory);

window.addEventListener('keydown', (e) => {
  if (!lightbox || !lightbox.classList.contains('is-open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') prevMemory();
  if (e.key === 'ArrowRight') nextMemory();
});

// Mobile touch swipe gestures for lightbox navigation
let lbTouchStartX = 0;
let lbTouchStartY = 0;
if (lightbox){
  lightbox.addEventListener('touchstart', (e) => {
    lbTouchStartX = e.changedTouches[0].screenX;
    lbTouchStartY = e.changedTouches[0].screenY;
  }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    const diffX = e.changedTouches[0].screenX - lbTouchStartX;
    const diffY = e.changedTouches[0].screenY - lbTouchStartY;
    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)){
      if (diffX < 0) nextMemory();
      else prevMemory();
    }
  }, { passive: true });
}

/* ============================================================
   CHAPTER 4: WORDS FROM THE HEART (Personal Heartfelt Letter)
   ============================================================ */
let isLetterRead = false;
let wasMusicPlayingBeforeLetter = false;

function initChapter4(){
  const salutation = $('letterSalutation');
  if (salutation && BIRTHDAY_CONFIG.letter.salutation){
    salutation.textContent = BIRTHDAY_CONFIG.letter.salutation;
  }

  const paragraphsWrap = $('letterParagraphs');
  if (paragraphsWrap && BIRTHDAY_CONFIG.letter.paragraphs){
    paragraphsWrap.innerHTML = BIRTHDAY_CONFIG.letter.paragraphs
      .map(p => `<p>${p}</p>`)
      .join('');
  }

  // Observe end of letter sentinel to verify reading to the actual end
  const endSentinel = $('letterEndSentinel');
  if (endSentinel && 'IntersectionObserver' in window){
    const letterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting){
          // Short reading-completion delay before unlocking Continue
          setTimeout(() => {
            completeChapter('chapter4');
          }, 1800);
          letterObserver.disconnect();
        }
      });
    }, { threshold: 0.1 });
    letterObserver.observe(endSentinel);
  }
}

function enterChapter4(){
  initChapter4();
  // Silent reading experience: pause YouTube music while reading the letter
  if (!isLetterRead && isMusicPlaying){
    wasMusicPlayingBeforeLetter = true;
    pauseMusic();
  }
}

/* ============================================================
   PAGE 6: WISHES BEYOND WORDS (Celestial Wishes)
   ============================================================ */
let chapter5Initialized = false;

function initChapter5(){
  if (chapter5Initialized) return;
  chapter5Initialized = true;

  const grid = $('wishesGrid');
  if (!grid) return;

  grid.innerHTML = BIRTHDAY_CONFIG.wishes.map((w, idx) => `
    <article class="wish-card" data-index="${idx}">
      <span class="wish-icon">${w.icon}</span>
      <h3 class="wish-title">${w.title}</h3>
      <p class="wish-text">&ldquo;${w.text}&rdquo;</p>
    </article>
  `).join('');

  // Track wish cards as they enter the visible viewport
  if ('IntersectionObserver' in window){
    const wishCards = grid.querySelectorAll('.wish-card');
    const wishObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting){
          entry.target.classList.add('is-viewed');
        }
      });
    }, { threshold: 0.2 });
    wishCards.forEach(c => wishObserver.observe(c));

    // Observe end of wishes sentinel to verify reaching the end
    const endSentinel = $('wishesEndSentinel');
    if (endSentinel){
      const wishesEndObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting){
            setTimeout(() => {
              completeChapter('chapter5');
            }, 1000);
            wishesEndObserver.disconnect();
          }
        });
      }, { threshold: 0.1 });
      wishesEndObserver.observe(endSentinel);
    }
  }
}

function enterChapter5(){
  initChapter5();
  gsap.fromTo('.wish-card',
    { opacity: 0, y: 24, scale: 0.95 },
    { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.14, ease: 'power2.out' }
  );
}

/* ============================================================
   NAVIGATION BUTTON ATTACHMENTS (Strict Sequential Navigation)
   ============================================================ */
// Page 1: Cupid Arrow Invitation
const ch1NextBtn = $('ch1NextBtn');
if (ch1NextBtn){
  ch1NextBtn.addEventListener('click', () => navigateToPage('chapterCake'));
}

// Page 2: Birthday Cake Cutting
const cakePrevBtn = $('cakePrevBtn');
if (cakePrevBtn){
  cakePrevBtn.addEventListener('click', () => navigateToPage('chapter1'));
}
const cakeNextBtn = $('cakeNextBtn');
if (cakeNextBtn){
  cakeNextBtn.addEventListener('click', () => navigateToPage('chapter2'));
}

// Page 3: Birthday Greeting (A Beautiful Beginning)
const ch2PrevBtn = $('ch2PrevBtn');
if (ch2PrevBtn){
  ch2PrevBtn.addEventListener('click', () => navigateToPage('chapterCake'));
}
const ch2NextBtn = $('ch2NextBtn');
if (ch2NextBtn){
  ch2NextBtn.addEventListener('click', () => navigateToPage('chapter3'));
}

// Page 4: Memories / Photo Gallery
const ch3PrevBtn = $('ch3PrevBtn');
if (ch3PrevBtn){
  ch3PrevBtn.addEventListener('click', () => navigateToPage('chapter2'));
}
const ch3NextBtn = $('ch3NextBtn');
if (ch3NextBtn){
  ch3NextBtn.addEventListener('click', () => navigateToPage('chapter4'));
}

// Page 5: Personal Letter
const ch4PrevBtn = $('ch4PrevBtn');
if (ch4PrevBtn){
  ch4PrevBtn.addEventListener('click', () => navigateToPage('chapter3'));
}
const ch4NextBtn = $('ch4NextBtn');
if (ch4NextBtn){
  ch4NextBtn.addEventListener('click', () => {
    isLetterRead = true;
    if (wasMusicPlayingBeforeLetter){
      tryPlayMusic();
    }
    navigateToPage('chapter5');
  });
}

// Page 6: Celestial Wishes
const ch5PrevBtn = $('ch5PrevBtn');
if (ch5PrevBtn){
  ch5PrevBtn.addEventListener('click', () => navigateToPage('chapter4'));
}
const ch5NextBtn = $('ch5NextBtn');
if (ch5NextBtn){
  ch5NextBtn.addEventListener('click', () => navigateToPage('chapter6'));
}

// Page 7: Grand Finale
const ch6PrevBtn = $('ch6PrevBtn');
if (ch6PrevBtn){
  ch6PrevBtn.addEventListener('click', () => navigateToPage('chapter5'));
}

/* ============================================================
   CHAPTER 6: THE GRAND FINALE (Heart Blossom Tree)
   ============================================================ */
function enterChapter6(){
  resize();
  treeStart();

  const wEyebrow = $('wEyebrow');
  const wHero    = $('wHero');
  const wSub     = $('wSub');
  if (wEyebrow) wEyebrow.textContent = BIRTHDAY_CONFIG.finale.eyebrow;
  if (wHero)    wHero.textContent    = BIRTHDAY_CONFIG.finale.heroText;
  if (wSub)     wSub.textContent     = BIRTHDAY_CONFIG.finale.subText;
}

/* ============================================================
   PLAYFUL LOVE QUESTION INTERACTION (Chapter 6 Grand Finale)
   ============================================================ */
function initLoveQuestion(){
  const btnYes      = $('btnYes');
  const btnNo       = $('btnNo');
  const promptArea  = $('lovePromptArea');
  const finalReveal = $('loveFinalReveal');
  const replayBtn   = $('replayAllBtn');

  if (!btnYes || !btnNo) return;

  // Pre-calculated safe playful dodging offsets (px) so NO playfully glides away without leaving screen
  const DODGE_OFFSETS = [
    { x: 55,  y: -36 },
    { x: -50, y: -42 },
    { x: 45,  y: 36 },
    { x: -45, y: 38 },
    { x: 65,  y: 8 },
    { x: -60, y: -20 },
    { x: 30,  y: -48 },
    { x: -35, y: 46 },
    { x: 52,  y: -22 },
    { x: -48, y: 22 },
  ];
  let currentDodgeIdx = -1;

  function dodgeNo(e){
    if (e && (e.type === 'touchstart' || e.type === 'pointerdown')){
      if (e.cancelable) e.preventDefault();
    }
    let nextIdx;
    do {
      nextIdx = Math.floor(Math.random() * DODGE_OFFSETS.length);
    } while (nextIdx === currentDodgeIdx && DODGE_OFFSETS.length > 1);

    currentDodgeIdx = nextIdx;
    const offset = DODGE_OFFSETS[nextIdx];

    if (window.gsap){
      gsap.to(btnNo, {
        x: offset.x,
        y: offset.y,
        duration: 0.28,
        ease: 'power2.out',
      });
    } else {
      btnNo.style.transform = `translate(${offset.x}px, ${offset.y}px)`;
    }
  }

  // Pointer hover on desktop for NO (playfully dodges cursor)
  btnNo.addEventListener('pointerenter', dodgeNo);
  btnNo.addEventListener('mouseenter', dodgeNo);
  // Touch / pointer interaction on mobile for NO (playfully dodges finger)
  btnNo.addEventListener('touchstart', dodgeNo, { passive: false });
  btnNo.addEventListener('pointerdown', dodgeNo);

  // If user tries to click NO, dodge away and NEVER trigger celebration
  btnNo.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dodgeNo(e);
  });

  // Clicking YES is stable, clickable, and triggers the final celebration!
  btnYes.addEventListener('click', (e) => {
    e.preventDefault();
    triggerFinalLoveReveal();
  });

  function triggerFinalLoveReveal(){
    spawnCelebrationBurst();
    setTimeout(spawnCelebrationBurst, 400);

    if (window.gsap && promptArea && finalReveal){
      gsap.to(promptArea, {
        opacity: 0,
        y: -10,
        duration: 0.35,
        ease: 'power2.in',
        onComplete: () => {
          promptArea.hidden = true;
          finalReveal.hidden = false;
          finalReveal.removeAttribute('hidden');
          gsap.fromTo(finalReveal,
            { opacity: 0, y: 16, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.4)' }
          );
        }
      });
    } else {
      if (promptArea) promptArea.hidden = true;
      if (finalReveal){
        finalReveal.hidden = false;
        finalReveal.removeAttribute('hidden');
      }
    }
  }

  if (replayBtn){
    replayBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// Initialize all sections for seamless continuous vertical scrolling
initCakeCutting();
initChapter3();
initChapter4();
initChapter5();
initLoveQuestion();

const continuousScrollObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting){
      const id = entry.target.id;
      if (id === 'chapterCake') enterChapterCake();
      if (id === 'chapter2') enterChapter2();
      if (id === 'chapter4') enterChapter4();
      if (id === 'chapter5') enterChapter5();
      if (id === 'chapter6') enterChapter6();
    }
  });
}, { threshold: 0.12 });

// Lock all subsequent pages on initial load, leaving only Chapter 1 accessible
PAGE_ORDER.forEach((id, idx) => {
  const el = $(id);
  if (!el) return;
  if (idx === 0){
    el.classList.remove('is-locked');
  } else {
    el.classList.add('is-locked');
  }
});

['chapterCake', 'chapter2', 'chapter3', 'chapter4', 'chapter5', 'chapter6'].forEach((id) => {
  const el = $(id);
  if (el) continuousScrollObserver.observe(el);
});

/* ============================================================
   CONFETTI & CELEBRATION LOVE BURST
   ============================================================ */
const confettiCanvas = $('confettiCanvas');
let confettiCtx      = confettiCanvas ? confettiCanvas.getContext('2d') : null;
let confettiParticles = [];
let confettiRAF      = 0;

function resizeConfetti(){
  if (!confettiCanvas) return;
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeConfetti);
resizeConfetti();

const CONFETTI_COLORS = ['#ff5f86', '#ffd0e0', '#ffcf6a', '#e8a23d', '#ffffff', '#e23b67', '#ff8fae'];

function spawnCelebrationBurst(customX, customY){
  if (!confettiCtx) return;
  const count = 56;
  const startX = typeof customX === 'number' ? customX : window.innerWidth * 0.5;
  const startY = typeof customY === 'number' ? customY : window.innerHeight * 0.55;

  for (let i = 0; i < count; i++){
    const angle = rand(0, Math.PI * 2);
    const speed = rand(8, 26);
    confettiParticles.push({
      x: startX + rand(-40, 40),
      y: startY + rand(-30, 30),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 6,
      size: rand(6, 15),
      color: pick(CONFETTI_COLORS),
      rot: rand(0, 6.28),
      vrot: rand(-0.15, 0.15),
      shape: Math.random() < 0.5 ? 'heart' : 'petal',
      life: rand(2.2, 3.6),
      age: 0,
    });
  }

  if (!confettiRAF) renderConfetti();
}

function renderConfetti(){
  if (!confettiCtx) return;
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  for (let i = confettiParticles.length - 1; i >= 0; i--){
    const p = confettiParticles[i];
    p.age += 0.016;
    p.vy += 0.42;
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vrot;

    const alpha = clamp01(1 - p.age / p.life);
    if (alpha <= 0){ confettiParticles.splice(i, 1); continue; }

    confettiCtx.save();
    confettiCtx.globalAlpha = alpha;
    confettiCtx.translate(p.x, p.y);
    confettiCtx.rotate(p.rot);
    confettiCtx.fillStyle = p.color;

    if (p.shape === 'heart'){
      confettiCtx.font = `${p.size * 1.5}px serif`;
      confettiCtx.textAlign = 'center';
      confettiCtx.textBaseline = 'middle';
      confettiCtx.fillText('♥', 0, 0);
    } else {
      confettiCtx.beginPath();
      confettiCtx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
      confettiCtx.fill();
    }
    confettiCtx.restore();
  }

  if (confettiParticles.length > 0){
    confettiRAF = requestAnimationFrame(renderConfetti);
  } else {
    confettiRAF = 0;
  }
}

/* ============================================================
   BACKGROUND MUSIC ENGINE (Persistent & Seamless)
   ============================================================ */
const musicWidget  = $('musicWidget');
const musicPillBtn = $('musicPillBtn') || $('musicPlayBtn');
const iconPlay     = $('iconPlay');
const iconPause    = $('iconPause');
const musicLabel   = $('musicLabel');
const musicSub     = $('musicSub');
const bgAudio      = $('bgAudio');

let isMusicPlaying = false;
let ytPlayer       = null;
let ytReady        = false;
let ytStartedOnce  = false;
let playRequested  = false;

function setMusicUIState(playing){
  isMusicPlaying = playing;
  if (musicWidget) musicWidget.classList.toggle('is-playing', playing);
  if (iconPlay && iconPause){
    iconPlay.hidden = playing;
    iconPause.hidden = !playing;
  }
  if (musicSub){
    musicSub.textContent = playing ? 'Click to Stop' : 'Click to Play';
  }
}

function initYouTubePlayer(){
  const videoId   = (BIRTHDAY_CONFIG.music && BIRTHDAY_CONFIG.music.youtubeVideoId) || 'hNXs3ny2adA';
  const startTime = (BIRTHDAY_CONFIG.music && BIRTHDAY_CONFIG.music.startTime) || 15;

  window.onYouTubeIframeAPIReady = function(){
    try {
      ytPlayer = new YT.Player('ytPlayer', {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          start: startTime,
          controls: 0,
          enablejsapi: 1,
          playsinline: 1,
          rel: 0,
          modestbranding: 1
        },
        events: {
          onReady: (event) => {
            ytReady = true;
            const vol = (BIRTHDAY_CONFIG.music && BIRTHDAY_CONFIG.music.defaultVolume) || 85;
            try {
              event.target.unMute();
              event.target.setVolume(vol);
            } catch (_) {}
            if (musicLabel) musicLabel.textContent = (BIRTHDAY_CONFIG.music && BIRTHDAY_CONFIG.music.title) || 'Birthday Song';
            if (playRequested && !isMusicPlaying){
              tryPlayMusic();
            }
          },
          onStateChange: (event) => {
            // YT.PlayerState.PLAYING = 1, PAUSED = 2, ENDED = 0
            if (event.data === 1){
              setMusicUIState(true);
              if (bgAudio && !bgAudio.paused) bgAudio.pause();
            } else if (event.data === 2 || event.data === 0){
              if (isMusicPlaying && !bgAudio.paused){
                // Native audio is playing fallback
              } else {
                setMusicUIState(false);
              }
            }
          },
          onError: () => {
            tryFallbackAudio();
          }
        }
      });
    } catch (_) {}
  };

  if (window.YT && window.YT.Player){
    window.onYouTubeIframeAPIReady();
  }
}

function tryPlayMusic(){
  playRequested = true;
  let ytAttempted = false;

  if (ytPlayer && ytReady){
    try {
      if (typeof ytPlayer.unMute === 'function') ytPlayer.unMute();
      if (!ytStartedOnce){
        ytStartedOnce = true;
        const startTime = (BIRTHDAY_CONFIG.music && BIRTHDAY_CONFIG.music.startTime) || 15;
        ytPlayer.seekTo(startTime, true);
      }
      ytPlayer.playVideo();
      ytAttempted = true;
      setMusicUIState(true);

      // On mobile devices, check if YouTube actually starts playing within 1.2s; if blocked, activate fallback
      setTimeout(() => {
        if (!isMusicPlaying){
          tryFallbackAudio();
        }
      }, 1200);
      return;
    } catch (_) {}
  }

  if (!ytAttempted){
    tryFallbackAudio();
  }
}

function tryFallbackAudio(){
  if (bgAudio){
    if (!bgAudio.src) bgAudio.src = './music/song.mp3';
    bgAudio.volume = 0.85;
    const p = bgAudio.play();
    if (p !== undefined){
      p.then(() => {
        setMusicUIState(true);
      }).catch(() => {
        setMusicUIState(false);
      });
    }
  }
}

function pauseMusic(){
  playRequested = false;
  if (ytPlayer && ytReady){
    try { ytPlayer.pauseVideo(); } catch (_) {}
  }
  if (bgAudio && !bgAudio.paused) bgAudio.pause();
  setMusicUIState(false);
}

function toggleMusic(){
  if (isMusicPlaying) pauseMusic();
  else tryPlayMusic();
}

if (musicPillBtn){
  let lastTapTime = 0;
  const onMusicToggle = (e) => {
    const now = Date.now();
    if (now - lastTapTime < 350) return; // Debounce double tap
    lastTapTime = now;
    e.preventDefault();
    e.stopPropagation();
    toggleMusic();
  };
  musicPillBtn.addEventListener('click', onMusicToggle);
  musicPillBtn.addEventListener('touchend', onMusicToggle);
}

const unlockAudioOnGesture = () => {
  if (!isMusicPlaying && !playRequested){
    tryPlayMusic();
  }
};
window.addEventListener('pointerdown', unlockAudioOnGesture, { passive: true });
window.addEventListener('touchstart', unlockAudioOnGesture, { passive: true });
window.addEventListener('keydown', unlockAudioOnGesture, { passive: true });

initYouTubePlayer();

/* ============================================================
   SIZING & BOOTSTRAP
   ============================================================ */
function resize(){
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  const stage = $('treeStage');
  let sW = (stage && stage.clientWidth > 40) ? stage.clientWidth : 0;
  let sH = (stage && stage.clientHeight > 40) ? stage.clientHeight : 0;
  if (!sW || !sH){
    sW = Math.round(Math.min(window.innerWidth - 32, 540));
    sH = Math.round(clamp(window.innerHeight * 0.44, 280, 420));
  }
  W = sW;
  H = sH;
  if (canvas && ctx){
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  buildSprites();
  buildScene();
  if (reduceMotion){ drawFinal(); return; }
  refreshRig();
  setDraw(0);
}

let resizeRAF = 0;
window.addEventListener('resize', () => {
  if (resizeRAF) return;
  resizeRAF = requestAnimationFrame(() => { resizeRAF = 0; resize(); });
});

resize();

if (reduceMotion){
  drawFinal();
} else {
  buildMotes();
  document.fonts && document.fonts.ready.then(() => { refreshRig(); setDraw(0); });
  unlockChapter(1);
  enterChapter1();
}

if (isRecord){
  window.bdayAPI = {
    start(){ autoFire(); },
    replay(){ switchChapter(1); },
  };
}
