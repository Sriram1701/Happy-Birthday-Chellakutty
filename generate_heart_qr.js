import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

const URL = 'https://sriram1701.github.io/Happy-Birthday-Chellakutty/';

async function generateHeartQR() {
  const qr = QRCode.create(URL, { errorCorrectionLevel: 'H' });
  const size = qr.modules.size; // 41
  const data = qr.modules.data; // Uint8Array of size * size

  const cellSize = 14;
  const padding = 56;
  const qrPixelSize = size * cellSize;
  const cardWidth = qrPixelSize + padding * 2; // ~686px
  const cardHeight = cardWidth + 140; // extra space for header & footer

  const centerCell = Math.floor(size / 2);
  const heartRadiusCells = 4.8; // center heart exclusion zone

  // Helper to check if a module is inside a finder pattern
  function isFinderPattern(r, c) {
    if (r < 7 && c < 7) return true; // Top-left
    if (r < 7 && c >= size - 7) return true; // Top-right
    if (r >= size - 7 && c < 7) return true; // Bottom-left
    return false;
  }

  // Helper to check if a module is in the center heart exclusion zone
  function isCenterHeart(r, c) {
    const dr = r - centerCell;
    const dc = c - centerCell;
    // Normalized coords (-1 to 1)
    const x = dc / heartRadiusCells;
    const y = -dr / heartRadiusCells; // SVG y is inverted
    // Heart implicit equation: (x^2 + y^2 - 1)^3 - x^2 * y^3 <= 0
    // Simplified distance check:
    return Math.hypot(dr, dc) <= heartRadiusCells;
  }

  let modulesSvg = '';

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const idx = r * size + c;
      const isDark = data[idx] === 1;

      if (!isDark) continue;
      if (isFinderPattern(r, c)) continue; // Rendered separately for custom romantic look
      if (isCenterHeart(r, c)) continue; // Keep center clear for heart logo

      const x = padding + c * cellSize;
      const y = padding + 80 + r * cellSize;
      const cx = x + cellSize / 2;
      const cy = y + cellSize / 2;
      const radius = cellSize * 0.44;

      // Render rounded module dot
      modulesSvg += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${radius.toFixed(1)}" fill="url(#qrDotGrad)" />\n`;
    }
  }

  // Romantic Custom Finder Eyes (Top-Left, Top-Right, Bottom-Left)
  function renderFinderPattern(x, y) {
    const outerSize = 7 * cellSize;
    const innerSize = 5 * cellSize;
    const centerSize = 3 * cellSize;

    const ox = x;
    const oy = y;
    const ix = x + cellSize;
    const iy = y + cellSize;
    const cx = x + 2 * cellSize;
    const cy = y + 2 * cellSize;

    return `
      <!-- Outer Rounded Box -->
      <rect x="${ox}" y="${oy}" width="${outerSize}" height="${outerSize}" rx="${cellSize * 1.5}" fill="url(#finderOuterGrad)" />
      <!-- White Ring -->
      <rect x="${ix}" y="${iy}" width="${innerSize}" height="${innerSize}" rx="${cellSize}" fill="#ffffff" />
      <!-- Inner Heart Core -->
      <g transform="translate(${cx + centerSize / 2}, ${cy + centerSize / 2}) scale(${centerSize / 38})">
        <path d="M 0 14 C 0 8 -9 2 -14 7 C -20 13 -14 23 0 34 C 14 23 20 13 14 7 C 9 2 0 8 0 14 Z" 
              transform="translate(0, -20)" fill="url(#finderHeartGrad)" />
      </g>
    `;
  }

  const tlFinder = renderFinderPattern(padding, padding + 80);
  const trFinder = renderFinderPattern(padding + (size - 7) * cellSize, padding + 80);
  const blFinder = renderFinderPattern(padding, padding + 80 + (size - 7) * cellSize);

  // Center Heart Position
  const heartCenterX = padding + (size / 2) * cellSize;
  const heartCenterY = padding + 80 + (size / 2) * cellSize;
  const heartScale = (cellSize * 10) / 100;

  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${cardWidth} ${cardHeight}" width="100%" height="100%">
  <defs>
    <!-- Card Background Gradient -->
    <linearGradient id="cardBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fffbfa" />
      <stop offset="50%" stop-color="#fff3f6" />
      <stop offset="100%" stop-color="#fcedf2" />
    </linearGradient>

    <!-- QR Dot Gradient -->
    <linearGradient id="qrDotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#e6235b" />
      <stop offset="100%" stop-color="#990f38" />
    </linearGradient>

    <!-- Finder Outer Gradient -->
    <linearGradient id="finderOuterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#d81e57" />
      <stop offset="100%" stop-color="#8a0c32" />
    </linearGradient>

    <!-- Finder Heart Gradient -->
    <linearGradient id="finderHeartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff4d7e" />
      <stop offset="100%" stop-color="#c41045" />
    </linearGradient>

    <!-- Center Heart Gradient -->
    <linearGradient id="centerHeartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff4a7d" />
      <stop offset="60%" stop-color="#d81e57" />
      <stop offset="100%" stop-color="#940e36" />
    </linearGradient>

    <!-- Gold Border Gradient -->
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffe8a3" />
      <stop offset="50%" stop-color="#d4af37" />
      <stop offset="100%" stop-color="#aa8012" />
    </linearGradient>

    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>

    <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="12" stdDeviation="20" flood-color="#8a0c32" flood-opacity="0.16" />
    </filter>
  </defs>

  <style>
    @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&amp;family=Montserrat:wght@400;600;700&amp;display=swap');
    .title-script { font-family: 'Great Vibes', cursive; font-size: 42px; fill: #b81446; text-anchor: middle; }
    .subtitle { font-family: 'Montserrat', sans-serif; font-size: 14px; font-weight: 600; fill: #7a3048; text-anchor: middle; letter-spacing: 0.12em; text-transform: uppercase; }
    .caption { font-family: 'Montserrat', sans-serif; font-size: 13px; font-weight: 600; fill: #a33857; text-anchor: middle; letter-spacing: 0.08em; }
    .url-text { font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 400; fill: #b56c82; text-anchor: middle; opacity: 0.9; }
  </style>

  <!-- Card Background with Shadow -->
  <rect x="16" y="16" width="${cardWidth - 32}" height="${cardHeight - 32}" rx="32" fill="url(#cardBg)" stroke="rgba(255, 182, 204, 0.5)" stroke-width="2" filter="url(#cardShadow)" />

  <!-- Delicate Romantic Decorative Corner Hearts -->
  <g fill="#f7b7cb" opacity="0.6">
    <path d="M 44 48 C 44 44 38 40 34 43 C 30 47 34 53 44 60 C 54 53 58 47 54 43 C 50 40 44 44 44 48 Z" />
    <path d="M ${cardWidth - 44} 48 C ${cardWidth - 44} 44 ${cardWidth - 50} 40 ${cardWidth - 54} 43 C ${cardWidth - 58} 47 ${cardWidth - 54} 53 ${cardWidth - 44} 60 C ${cardWidth - 34} 53 ${cardWidth - 30} 47 ${cardWidth - 34} 43 C ${cardWidth - 38} 40 ${cardWidth - 44} 44 ${cardWidth - 44} 48 Z" />
  </g>

  <!-- Header Text -->
  <text x="${cardWidth / 2}" y="52" class="title-script">Happy Birthday, Ranjeetha Sri</text>
  <text x="${cardWidth / 2}" y="76" class="subtitle">A Special Gift For You</text>

  <!-- QR Code White Stage Plate -->
  <rect x="${padding - 14}" y="${padding + 66}" width="${qrPixelSize + 28}" height="${qrPixelSize + 28}" rx="24" fill="#ffffff" stroke="rgba(255, 200, 218, 0.8)" stroke-width="1.5" />

  <!-- Outer QR Modules -->
  ${modulesSvg}

  <!-- Romantic Finder Eyes -->
  ${tlFinder}
  ${trFinder}
  ${blFinder}

  <!-- Center Floating Heart Emblem -->
  <g transform="translate(${heartCenterX}, ${heartCenterY}) scale(${heartScale})" filter="url(#softGlow)">
    <!-- Heart Glow Backing -->
    <path d="M 0 38 C 0 16 -34 -4 -56 16 C -82 42 -56 78 0 120 C 56 78 82 42 56 16 C 34 -4 0 16 0 38 Z"
          transform="translate(0, -68)" fill="#ffffff" opacity="0.95" />
    <path d="M 0 38 C 0 16 -34 -4 -56 16 C -82 42 -56 78 0 120 C 56 78 82 42 56 16 C 34 -4 0 16 0 38 Z"
          transform="translate(0, -68)" fill="url(#centerHeartGrad)" stroke="url(#goldGrad)" stroke-width="4.5" />

    <!-- Center Heart Shine -->
    <ellipse cx="-22" cy="-26" rx="14" ry="8" transform="rotate(-30 -22 -26)" fill="#ffffff" opacity="0.45" />

    <!-- Romantic Heart Inscription -->
    <text x="0" y="-8" font-family="'Great Vibes', cursive" font-size="28" fill="#ffffff" text-anchor="middle" font-weight="bold">Love</text>
    <circle cx="0" cy="18" r="3.5" fill="#ffe599" />
  </g>

  <!-- Bottom Instructions & URL -->
  <g transform="translate(0, ${cardHeight - 65})">
    <text x="${cardWidth / 2}" y="0" class="caption">Scan with phone camera to open surprise ❤️</text>
    <text x="${cardWidth / 2}" y="22" class="url-text">${URL}</text>
  </g>
</svg>
`;

  return { svgContent, cardWidth, cardHeight };
}

generateHeartQR().then(({ svgContent }) => {
  const outputPath = path.resolve('public', 'heart_qr.svg');
  const rootOutputPath = path.resolve('heart_qr.svg');
  fs.writeFileSync(outputPath, svgContent);
  fs.writeFileSync(rootOutputPath, svgContent);
  console.log('Heart QR SVG generated successfully at:', outputPath);
});
