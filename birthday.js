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

import gsap from 'gsap';
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

/* Act 1 Invitation Elements */
const hero       = $('hero');
const eyebrow    = $('eyebrow');
const hint       = $('hint');
const motes      = $('motes');
const target     = $('target');
const targetHeart= $('targetHeart');
const heartGlow  = target.querySelector('.heart__glow');
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
const uline   = $('uline').querySelector('.uline__path');
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
  if (!treeRAF) treeRAF = requestAnimationFrame(treeFrame);
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
const kChars = [...splitWord($('wLine1')), ...splitWord($('wLine2'))];

function buildMotes(){
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
  strL.setAttribute('x2', '230'); strL.setAttribute('y2', y);
  strR.setAttribute('x2', '230'); strR.setAttribute('y2', y);
  serving.setAttribute('cy', y);
}

let aimRad = 0, pullUX = 0, pullUY = 0, maxDraw = 60, curDraw = 0;
let arrowBaseX = 0, arrowBaseY = 0, svgScale = 1, gripX = 0, gripY = 0;

function refreshRig(){
  W = window.innerWidth;
  H = window.innerHeight;

  const tR = target.getBoundingClientRect();
  const tcx = (tR && tR.width > 0) ? (tR.left + tR.width / 2) : (W / 2);
  const tcy = (tR && tR.height > 0) ? (tR.top + tR.height / 2) : (H * 0.33);

  // Temporarily reset transform so measurements are never skewed by prior rotation
  gsap.set(archery, { rotation: 0, scale: 1 });

  const wArchery = archery.offsetWidth || 140;
  svgScale = Math.max(wArchery / 460, 0.2);
  const gripLX = wArchery * 0.50;
  const gripLY = 241 * svgScale;

  gripX = clamp(W * 0.20, 70, 240);
  gripY = clamp(H * 0.80, H - 220, H - 80);

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
  curDraw = clamp(d, 0, maxDraw);
  gsap.set(arrow, { x: arrowBaseX, y: arrowBaseY + curDraw });
  nockProxy.val = REST_NOCK + curDraw / svgScale;
  applyNock();
  gsap.set(aim, { opacity: 0.65 * (curDraw / maxDraw) });
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
      // Climax of Chapter 1: Reveal Chapter 2 prompt
      const ch1Continue = $('ch1ContinueWrap');
      if (ch1Continue) {
        ch1Continue.hidden = false;
        gsap.fromTo(ch1Continue, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });
      }
    },
  });

  t.set(target, { y: 0, scaleX: 1, scaleY: 1, opacity: 1 })
   .set(arrow, { opacity: 1, x: arrowBaseX, y: m.arrowStartY, scaleY: 1 })
   .set([flood, bloom], { autoAlpha: 0, scale: 0.001, x: 0, y: 0 })
   .set(flood, { x: m.fx, y: m.fy })
   .set(field, { autoAlpha: 0 })
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
   .to(camera, { scale: 1.055, duration: 4.2, ease: 'none' }, wishT0)
   .to(fgrid,  { yPercent: -4, duration: 4.2, ease: 'none' }, wishT0);

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

archery.addEventListener('pointerdown', onPointerDown);

if (hint){
  hint.addEventListener('click', () => { if (!played) autoFire(); });
}

if (target){
  target.addEventListener('click', () => { if (!played) autoFire(); });
}

archery.addEventListener('keydown', (e) => {
  if (played) return;
  if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); autoFire(); }
});

function enterChapter1(){
  gsap.set(hero, { autoAlpha: 1 });
  gsap.set([flood, bloom], { autoAlpha: 0 });
  gsap.set(field, { autoAlpha: 0 });
  refreshRig();
  setDraw(0);
  gsap.set([eyebrow, hint], { opacity: 0, y: 14 });
  gsap.set(target, { opacity: 0, y: 10, scaleX: 0.9, scaleY: 0.9 });
  gsap.set(archery, { opacity: 0, scale: 0.85 });
  gsap.set(heartGlow, { opacity: 0, scale: 1 });
  gsap.set(arrow, { opacity: 1 });

  const tl = gsap.timeline({ onComplete: startBeat });
  tl.to(target,   { opacity: 1, y: 0, scaleX: 1, scaleY: 1, duration: 0.8, ease: 'power3.out' }, 0.1)
    .to(heartGlow,{ opacity: 0.7, duration: 0.8, ease: 'power2.out' }, 0.2)
    .to(archery,  { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' }, 0.28)
    .to(eyebrow,  { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.4)
    .to(hint,     { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.7);
}

function resetChapter1(){
  if (filmTL){ filmTL.pause(0); }
  gsap.set(hero, { autoAlpha: 1 });
  gsap.set([flood, bloom], { autoAlpha: 0 });
  gsap.set(field, { autoAlpha: 0 });
  gsap.set(arrow, { opacity: 1, scaleY: 1 });
  const ch1Continue = $('ch1ContinueWrap');
  if (ch1Continue) ch1Continue.hidden = true;
  played = false;
  enterChapter1();
}

/* ============================================================
   CHAPTER NAVIGATION SYSTEM (Chapters 1 to 6)
   ============================================================ */
let activeChapter = 1;
const CHAPTER_TITLES = [
  'Chapter I • The Invitation',
  'Chapter II • A Beautiful Beginning',
  'Chapter III • Little Moments, Big Memories',
  'Chapter IV • Words From The Heart',
  'Chapter V • Wishes Beyond Words',
  'Chapter VI • The Grand Finale',
];

function switchChapter(targetNum){
  if (targetNum === activeChapter || targetNum < 1 || targetNum > 6) return;
  const currentEl = $(`chapter${activeChapter}`);
  const targetEl  = $(`chapter${targetNum}`);
  if (!targetEl) return;

  const prevNum = activeChapter;
  activeChapter = targetNum;

  // Update Tracker UI
  const trackerTitle = $('chapterTrackerTitle');
  if (trackerTitle && CHAPTER_TITLES[activeChapter - 1]){
    trackerTitle.textContent = CHAPTER_TITLES[activeChapter - 1];
  }

  document.querySelectorAll('.chapter-dot').forEach((dot) => {
    const num = parseInt(dot.getAttribute('data-chapter'), 10);
    const isActive = num === activeChapter;
    dot.classList.toggle('is-active', isActive);
    dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  // Cross-fade chapters smoothly with GSAP
  if (currentEl && currentEl !== targetEl){
    gsap.to(currentEl, {
      opacity: 0,
      duration: 0.35,
      ease: 'power2.inOut',
      onComplete: () => {
        currentEl.classList.remove('is-active');
        currentEl.style.display = 'none';
        if (prevNum === 6) treeStop();
      },
    });
  }

  targetEl.style.display = (targetNum === 1 || targetNum === 6) ? 'block' : 'flex';
  targetEl.classList.add('is-active');
  gsap.fromTo(targetEl, { opacity: 0 }, { opacity: 1, duration: 0.5, delay: 0.05, ease: 'power2.out' });

  // Trigger chapter-specific logic
  if (activeChapter === 1){
    resetChapter1();
  } else if (activeChapter === 2){
    enterChapter2();
  } else if (activeChapter === 3){
    enterChapter3();
  } else if (activeChapter === 4){
    enterChapter4();
  } else if (activeChapter === 5){
    enterChapter5();
  } else if (activeChapter === 6){
    enterChapter6();
  }
}

// Bind Chapter Dots
document.querySelectorAll('.chapter-dot').forEach((dot) => {
  dot.addEventListener('click', () => {
    const num = parseInt(dot.getAttribute('data-chapter'), 10);
    switchChapter(num);
  });
});

/* ============================================================
   CHAPTER 2: A BEAUTIFUL BEGINNING
   ============================================================ */
function enterChapter2(){
  const l1 = $('storyLine1'), l2 = $('storyLine2'), l3 = $('storyLine3');
  const msgs = BIRTHDAY_CONFIG.beginningStory;
  if (l1 && msgs[0]) l1.textContent = `“${msgs[0]}”`;
  if (l2 && msgs[1]) l2.textContent = `“${msgs[1]}”`;
  if (l3 && msgs[2]) l3.textContent = `“${msgs[2]}”`;

  [l1, l2, l3].forEach((el) => { if (el) el.classList.remove('is-revealed'); });

  setTimeout(() => { if (l1) l1.classList.add('is-revealed'); }, 500);
  setTimeout(() => { if (l2) l2.classList.add('is-revealed'); }, 2000);
  setTimeout(() => { if (l3) l3.classList.add('is-revealed'); }, 3500);
}

const ch1NextBtn = $('ch1NextBtn');
if (ch1NextBtn) ch1NextBtn.addEventListener('click', () => switchChapter(2));

const ch2PrevBtn = $('ch2PrevBtn');
if (ch2PrevBtn) ch2PrevBtn.addEventListener('click', () => switchChapter(1));

const ch2NextBtn = $('ch2NextBtn');
if (ch2NextBtn) ch2NextBtn.addEventListener('click', () => switchChapter(3));

/* ============================================================
   CHAPTER 3: LITTLE MOMENTS, BIG MEMORIES (Polaroids + Lightbox)
   ============================================================ */
let chapter3Initialized = false;

function initChapter3(){
  if (chapter3Initialized) return;
  chapter3Initialized = true;

  const grid = $('polaroidGrid');
  if (!grid) return;

  grid.innerHTML = BIRTHDAY_CONFIG.photos.map((item, idx) => `
    <article class="polaroid-card" data-index="${idx}" data-stage="${item.stageKey || ''}" tabindex="0" role="button" aria-label="Open ${item.title}">
      <div class="polaroid-tape" aria-hidden="true"></div>
      <div class="polaroid-photo">
        <img src="./images/${item.filename}" alt="${item.title}" loading="lazy" />
        <div class="polaroid-overlay">
          <span class="polaroid-zoom-badge">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.4" style="margin-right:4px;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
            View Memory
          </span>
        </div>
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
    card.addEventListener('click', () => openLightbox(idx));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); openLightbox(idx); }
    });
  });

  // Stage Filter Buttons
  const stagePills = document.querySelectorAll('#galleryStages .stage-pill');
  stagePills.forEach(pill => {
    pill.addEventListener('click', () => {
      stagePills.forEach(p => p.classList.remove('is-active'));
      pill.classList.add('is-active');
      const selected = pill.getAttribute('data-stage');
      grid.querySelectorAll('.polaroid-card').forEach(card => {
        const cardStage = card.getAttribute('data-stage');
        if (selected === 'all' || cardStage === selected){
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
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

  if (lightboxImg){
    lightboxImg.src = `./images/${item.filename}`;
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

const ch3PrevBtn = $('ch3PrevBtn');
if (ch3PrevBtn) ch3PrevBtn.addEventListener('click', () => switchChapter(2));

const ch3NextBtn = $('ch3NextBtn');
if (ch3NextBtn) ch3NextBtn.addEventListener('click', () => switchChapter(4));

/* ============================================================
   CHAPTER 4: WORDS FROM THE HEART (Interactive Letter)
   ============================================================ */
let envelopeOpened = false;

function initChapter4(){
  const recipient = $('envelopeRecipient');
  if (recipient) recipient.textContent = `For ${BIRTHDAY_CONFIG.recipientName}`;

  const salutation = $('letterSalutation');
  if (salutation) salutation.textContent = BIRTHDAY_CONFIG.letter.salutation;

  const quote = $('letterQuote');
  if (quote) quote.textContent = BIRTHDAY_CONFIG.letter.highlightQuote;

  const closing = $('letterClosing');
  if (closing) closing.textContent = BIRTHDAY_CONFIG.letter.closing;

  const signature = $('letterSignature');
  if (signature) signature.textContent = BIRTHDAY_CONFIG.letter.signature;

  const body = $('letterBody');
  if (body){
    body.innerHTML = BIRTHDAY_CONFIG.letter.paragraphs.map(p => `<p>${p}</p>`).join('');
  }
}

function openEnvelope(){
  if (envelopeOpened) return;
  envelopeOpened = true;

  const card = $('envelopeCard');
  const parchment = $('letterParchment');

  gsap.to('#envelopeSeal', { scale: 1.25, opacity: 0, duration: 0.4 });
  gsap.to('#envelopeFlap', { rotateX: 180, transformOrigin: 'top center', duration: 0.6, ease: 'power2.inOut' });

  setTimeout(() => {
    if (card) card.hidden = true;
    if (parchment){
      parchment.hidden = false;
      gsap.fromTo(parchment, { opacity: 0, y: 30, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.2)' });
    }
  }, 450);
}

const envelopeCard = $('envelopeCard');
if (envelopeCard){
  envelopeCard.addEventListener('click', openEnvelope);
  envelopeCard.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); openEnvelope(); }
  });
}

function enterChapter4(){
  initChapter4();
}

const ch4PrevBtn = $('ch4PrevBtn');
if (ch4PrevBtn) ch4PrevBtn.addEventListener('click', () => switchChapter(3));

const ch4NextBtn = $('ch4NextBtn');
if (ch4NextBtn) ch4NextBtn.addEventListener('click', () => switchChapter(5));

/* ============================================================
   CHAPTER 5: WISHES BEYOND WORDS (Celestial Wishes)
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
}

function enterChapter5(){
  initChapter5();
  gsap.fromTo('.wish-card',
    { opacity: 0, y: 24, scale: 0.95 },
    { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.14, ease: 'power2.out' }
  );
}

const ch5PrevBtn = $('ch5PrevBtn');
if (ch5PrevBtn) ch5PrevBtn.addEventListener('click', () => switchChapter(4));

const ch5NextBtn = $('ch5NextBtn');
if (ch5NextBtn) ch5NextBtn.addEventListener('click', () => switchChapter(6));

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

const replayAllBtn = $('replayAllBtn');
if (replayAllBtn){
  replayAllBtn.addEventListener('click', () => {
    switchChapter(1);
  });
}

const ch6PrevBtn = $('ch6PrevBtn');
if (ch6PrevBtn) ch6PrevBtn.addEventListener('click', () => switchChapter(5));

/* ============================================================
   CONFETTI & CELEBRATION LOVE BURST
   ============================================================ */
const celebrateBtn   = $('celebrateBtn');
const celebrateCount = $('celebrateCount');
const confettiCanvas = $('confettiCanvas');
let confettiCtx      = confettiCanvas ? confettiCanvas.getContext('2d') : null;
let confettiParticles = [];
let confettiRAF      = 0;
let wishesCount      = 0;

function resizeConfetti(){
  if (!confettiCanvas) return;
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeConfetti);
resizeConfetti();

const CONFETTI_COLORS = ['#ff5f86', '#ffd0e0', '#ffcf6a', '#e8a23d', '#ffffff', '#e23b67', '#ff8fae'];

function spawnCelebrationBurst(){
  if (!confettiCtx) return;
  const count = 52;
  const startX = window.innerWidth * 0.78;
  const startY = window.innerHeight * 0.88;

  for (let i = 0; i < count; i++){
    const angle = rand(Math.PI * 0.9, Math.PI * 2.1);
    const speed = rand(10, 28);
    confettiParticles.push({
      x: startX + rand(-50, 50),
      y: startY + rand(-30, 30),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 8,
      size: rand(6, 15),
      color: pick(CONFETTI_COLORS),
      rot: rand(0, 6.28),
      vrot: rand(-0.15, 0.15),
      shape: Math.random() < 0.45 ? 'heart' : 'petal',
      life: rand(2.0, 3.4),
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

if (celebrateBtn){
  celebrateBtn.addEventListener('click', () => {
    wishesCount++;
    if (celebrateCount){
      celebrateCount.textContent = `${wishesCount} ${wishesCount === 1 ? 'wish' : 'wishes'} sent ♥`;
    }
    spawnCelebrationBurst();
  });
}

/* ============================================================
   BACKGROUND MUSIC ENGINE (Persistent & Seamless)
   ============================================================ */
const musicWidget  = $('musicWidget');
const musicPlayBtn = $('musicPlayBtn');
const musicMuteBtn = $('musicMuteBtn');
const iconPlay     = $('iconPlay');
const iconPause    = $('iconPause');
const iconVolHigh  = $('iconVolHigh');
const iconVolMuted = $('iconVolMuted');
const musicLabel   = $('musicLabel');
const musicSub     = $('musicSub');
const bgAudio      = $('bgAudio');

let isMusicPlaying = false;
let isMusicMuted   = false;
let ytPlayer       = null;
let ytReady        = false;
let ytStartedOnce  = false;

function setMusicUIState(playing){
  isMusicPlaying = playing;
  if (musicWidget) musicWidget.classList.toggle('is-playing', playing);
  if (iconPlay && iconPause){
    iconPlay.hidden = playing;
    iconPause.hidden = !playing;
  }
  if (musicSub){
    musicSub.textContent = playing ? 'Playing (00:15)' : 'Click to Play';
  }
}

function initYouTubePlayer(){
  const videoId   = BIRTHDAY_CONFIG.music.youtubeVideoId || 'hNXs3ny2adA';
  const startTime = BIRTHDAY_CONFIG.music.startTime || 15;

  window.onYouTubeIframeAPIReady = function(){
    try {
      ytPlayer = new YT.Player('ytPlayer', {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          start: startTime,
          controls: 1,
          enablejsapi: 1,
          playsinline: 1,
          rel: 0,
          modestbranding: 1,
          origin: window.location.origin
        },
        events: {
          onReady: (event) => {
            ytReady = true;
            const vol = BIRTHDAY_CONFIG.music.defaultVolume || 85;
            event.target.setVolume(vol);
            if (musicLabel) musicLabel.textContent = BIRTHDAY_CONFIG.music.title || 'Birthday Song';
          },
          onStateChange: (event) => {
            // YT.PlayerState.PLAYING = 1, PAUSED = 2, ENDED = 0
            if (event.data === 1){
              setMusicUIState(true);
            } else if (event.data === 2 || event.data === 0){
              setMusicUIState(false);
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
  if (ytPlayer && ytReady){
    try {
      if (!ytStartedOnce){
        ytStartedOnce = true;
        const startTime = BIRTHDAY_CONFIG.music.startTime || 15;
        ytPlayer.seekTo(startTime, true);
      }
      ytPlayer.playVideo();
      setMusicUIState(true);
      return;
    } catch (_) {}
  }
  tryFallbackAudio();
}

function tryFallbackAudio(){
  if (bgAudio && bgAudio.src){
    bgAudio.volume = isMusicMuted ? 0 : 0.75;
    const p = bgAudio.play();
    if (p !== undefined){
      p.then(() => setMusicUIState(true)).catch(() => setMusicUIState(false));
    }
  }
}

function pauseMusic(){
  if (ytPlayer && ytReady){
    try { ytPlayer.pauseVideo(); } catch (_) {}
  }
  if (bgAudio) bgAudio.pause();
  setMusicUIState(false);
}

function toggleMusic(){
  if (isMusicPlaying) pauseMusic();
  else tryPlayMusic();
}

function toggleMute(){
  isMusicMuted = !isMusicMuted;
  if (ytPlayer && ytReady){
    try {
      if (isMusicMuted) ytPlayer.mute();
      else ytPlayer.unMute();
    } catch (_) {}
  }
  if (bgAudio) bgAudio.volume = isMusicMuted ? 0 : 0.75;
  if (iconVolHigh && iconVolMuted){
    iconVolHigh.hidden = isMusicMuted;
    iconVolMuted.hidden = !isMusicMuted;
  }
}

if (musicPlayBtn) musicPlayBtn.addEventListener('click', toggleMusic);
if (musicMuteBtn) musicMuteBtn.addEventListener('click', toggleMute);

const unlockAudioOnGesture = () => {
  if (!isMusicPlaying) tryPlayMusic();
  window.removeEventListener('pointerdown', unlockAudioOnGesture);
  window.removeEventListener('keydown', unlockAudioOnGesture);
};
window.addEventListener('pointerdown', unlockAudioOnGesture, { passive: true });
window.addEventListener('keydown', unlockAudioOnGesture, { passive: true });

initYouTubePlayer();

/* ============================================================
   SIZING & BOOTSTRAP
   ============================================================ */
function resize(){
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  buildSprites();
  buildScene();
  if (reduceMotion){ drawFinal(); return; }
  refreshRig(); setDraw(0);
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
  enterChapter1();
}

if (isRecord){
  window.bdayAPI = {
    start(){ autoFire(); },
    replay(){ switchChapter(1); },
  };
}
