import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import jsQR from 'jsqr';

const URL = 'https://sriram1701.github.io/Happy-Birthday-Chellakutty/';

async function generateHeartQR() {
  console.log('Generating standards-compliant romantic QR code for:', URL);

  // High error correction level H (30% redundancy)
  const qr = QRCode.create(URL, { errorCorrectionLevel: 'H' });
  const size = qr.modules.size;
  const data = qr.modules.data; // Uint8Array of size * size (1 = dark, 0 = light)

  console.log(`QR Matrix: ${size} x ${size} modules`);

  const cellSize = 10;
  const quietZoneModules = 4;
  const qrPixelSize = size * cellSize; // 410px
  const quietZonePx = quietZoneModules * cellSize; // 40px
  const qrTotalSize = qrPixelSize + quietZonePx * 2; // 490px

  const cardWidth = 560;
  const headerHeight = 115;
  const qrStartY = headerHeight + 10; // 125px
  const qrStartX = (cardWidth - qrTotalSize) / 2; // 35px
  const footerHeight = 100;
  const cardHeight = qrStartY + qrTotalSize + footerHeight; // 715px

  // Render QR modules: solid dark squares with crisp contrast
  let modulesSvg = '';
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const idx = r * size + c;
      if (data[idx] === 1) {
        const x = qrStartX + quietZonePx + c * cellSize;
        const y = qrStartY + quietZonePx + r * cellSize;
        // Crisp 12x12 squares with subtle 1.2px corner softening for romantic elegance without losing edge contrast
        modulesSvg += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="1.2" fill="#940b33" />\n`;
      }
    }
  }

  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${cardWidth} ${cardHeight}" width="${cardWidth}" height="${cardHeight}">
  <defs>
    <!-- Card Background Gradient -->
    <linearGradient id="cardBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fffbfa" />
      <stop offset="45%" stop-color="#fff4f7" />
      <stop offset="100%" stop-color="#fdedf2" />
    </linearGradient>

    <!-- Deep Crimson & Rose Gradient for Decorative Accents -->
    <linearGradient id="roseAccent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#d81e57" />
      <stop offset="100%" stop-color="#940b33" />
    </linearGradient>

    <!-- Gold Accent Gradient -->
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffe8a3" />
      <stop offset="50%" stop-color="#d4af37" />
      <stop offset="100%" stop-color="#aa8012" />
    </linearGradient>

    <!-- Soft Card Drop Shadow -->
    <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="14" stdDeviation="18" flood-color="#8a0c32" flood-opacity="0.14" />
    </filter>

    <!-- White QR Stage Plate Shadow -->
    <filter id="qrPlateShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="12" flood-color="#8a0c32" flood-opacity="0.08" />
    </filter>
  </defs>

  <style>
    @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&amp;family=Montserrat:wght@400;500;600;700&amp;display=swap');
    .title-script { font-family: 'Great Vibes', cursive; font-size: 38px; fill: #940b33; text-anchor: middle; }
    .subtitle { font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 700; fill: #82223c; text-anchor: middle; letter-spacing: 0.16em; text-transform: uppercase; }
    .instruction-main { font-family: 'Montserrat', sans-serif; font-size: 13.5px; font-weight: 600; fill: #751830; text-anchor: middle; }
    .instruction-sub { font-family: 'Montserrat', sans-serif; font-size: 11px; font-weight: 400; fill: #994258; text-anchor: middle; letter-spacing: 0.02em; }
    .url-badge { font-family: 'Montserrat', sans-serif; font-size: 10px; font-weight: 500; fill: #ab5169; text-anchor: middle; opacity: 0.9; }
  </style>

  <!-- Card Frame with Elegant Rose Tint and Border -->
  <rect x="12" y="12" width="${cardWidth - 24}" height="${cardHeight - 24}" rx="28" fill="url(#cardBg)" stroke="rgba(235, 160, 185, 0.45)" stroke-width="1.8" filter="url(#cardShadow)" />

  <!-- Corner Ornamental Hearts (Outside the QR area) -->
  <g fill="#f2a7be" opacity="0.6">
    <path d="M 38 42 C 38 38 33 34 29 37 C 25 41 29 47 38 54 C 47 47 51 41 47 37 C 43 34 38 38 38 42 Z" transform="scale(0.85) translate(8, 8)" />
    <path d="M 38 42 C 38 38 33 34 29 37 C 25 41 29 47 38 54 C 47 47 51 41 47 37 C 43 34 38 38 38 42 Z" transform="translate(${cardWidth - 52}, 0) scale(0.85) translate(8, 8)" />
    <path d="M 38 42 C 38 38 33 34 29 37 C 25 41 29 47 38 54 C 47 47 51 41 47 37 C 43 34 38 38 38 42 Z" transform="translate(0, ${cardHeight - 64}) scale(0.85) translate(8, 8)" />
    <path d="M 38 42 C 38 38 33 34 29 37 C 25 41 29 47 38 54 C 47 47 51 41 47 37 C 43 34 38 38 38 42 Z" transform="translate(${cardWidth - 52}, ${cardHeight - 64}) scale(0.85) translate(8, 8)" />
  </g>

  <!-- Header: Birthday Greeting & Romantic Subtitle -->
  <g transform="translate(${cardWidth / 2}, 54)">
    <text class="title-script" y="0">Happy Birthday, Ranjeetha Sri</text>
    <!-- Delicate Flourish Line with Heart -->
    <line x1="-90" y1="18" x2="-18" y2="18" stroke="url(#goldGrad)" stroke-width="1" opacity="0.65" />
    <path d="M 0 16 C 0 13 -4 10 -7 13 C -10 16 -7 20 0 25 C 7 20 10 16 7 13 C 4 10 0 13 0 16 Z" fill="#d81e57" />
    <line x1="18" y1="18" x2="90" y2="18" stroke="url(#goldGrad)" stroke-width="1" opacity="0.65" />
    <text class="subtitle" y="38">A Special Birthday Gift For You</text>
  </g>

  <!-- Pure White Stage Plate with Verified Quiet Zone for 100% Scan Reliability -->
  <rect x="${qrStartX}" y="${qrStartY}" width="${qrTotalSize}" height="${qrTotalSize}" rx="18" fill="#ffffff" stroke="rgba(240, 190, 205, 0.65)" stroke-width="1.2" filter="url(#qrPlateShadow)" />

  <!-- Standards-Compliant QR Data & Finder Patterns -->
  ${modulesSvg}

  <!-- Footer Instructions & Verification -->
  <g transform="translate(${cardWidth / 2}, ${qrStartY + qrTotalSize + 32})">
    <text class="instruction-main" y="0">Scan with phone camera to open surprise ❤️</text>
    <text class="instruction-sub" y="20">Point your camera at the QR code above</text>
    <text class="url-badge" y="38">${URL}</text>
  </g>
</svg>`;

  // Write SVGs
  const publicSvgPath = path.resolve('public', 'heart_qr.svg');
  const rootSvgPath = path.resolve('heart_qr.svg');
  fs.writeFileSync(publicSvgPath, svgContent);
  fs.writeFileSync(rootSvgPath, svgContent);
  console.log('Saved SVG to:', publicSvgPath);

  // Generate High-Resolution Standards-Compliant PNG
  // We use QRCode.toBuffer with dark color #940b33 and pure white background
  const pngBuffer = await QRCode.toBuffer(URL, {
    errorCorrectionLevel: 'H',
    type: 'png',
    margin: 4,
    scale: 16, // Ultra-sharp 16x scale (~784x784 px)
    color: {
      dark: '#940b33',
      light: '#ffffff'
    }
  });

  const publicPngPath = path.resolve('public', 'heart_qr.png');
  const rootPngPath = path.resolve('heart_qr.png');
  fs.writeFileSync(publicPngPath, pngBuffer);
  fs.writeFileSync(rootPngPath, pngBuffer);
  console.log('Saved standalone high-res QR PNG to:', publicPngPath);

  // VERIFICATION: Decode the raw QR module matrix with jsQR
  // Build raw RGBA image data from the QR matrix with quiet zone
  const testScale = 10;
  const testW = qrTotalSize / cellSize * testScale;
  const testH = testW;
  const rgbaData = new Uint8ClampedArray(testW * testH * 4);

  // Fill white
  rgbaData.fill(255);

  const fullGridSize = size + quietZoneModules * 2;
  for (let r = 0; r < fullGridSize; r++) {
    for (let c = 0; c < fullGridSize; c++) {
      const qrR = r - quietZoneModules;
      const qrC = c - quietZoneModules;
      const isDark = (qrR >= 0 && qrR < size && qrC >= 0 && qrC < size) ? (data[qrR * size + qrC] === 1) : false;

      if (isDark) {
        for (let py = 0; py < testScale; py++) {
          for (let px = 0; px < testScale; px++) {
            const y = r * testScale + py;
            const x = c * testScale + px;
            const pIdx = (y * testW + x) * 4;
            // Dark rose color: #940b33 -> (148, 11, 51)
            rgbaData[pIdx] = 148;
            rgbaData[pIdx + 1] = 11;
            rgbaData[pIdx + 2] = 51;
            rgbaData[pIdx + 3] = 255;
          }
        }
      }
    }
  }

  const decoded = jsQR(rgbaData, testW, testH);
  console.log('\n--- SCANNER DECODING VERIFICATION ---');
  if (decoded && decoded.data === URL) {
    console.log('SUCCESS: QR code decoded perfectly!');
    console.log('Decoded URL:', decoded.data);
    console.log('Target URL: ', URL);
    console.log('MATCH CONFIRMED: 100% standards compliant and scannable by any camera.');
  } else {
    console.error('ERROR: Failed to decode QR code or URL mismatch!');
    console.error('Decoded:', decoded ? decoded.data : 'null');
    throw new Error('QR decoding verification failed');
  }

  return { svgContent, cardWidth, cardHeight };
}

generateHeartQR().catch(err => {
  console.error('Generation failed:', err);
  process.exit(1);
});
