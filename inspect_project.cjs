const fs = require('fs');

async function testPhotos() {
  const { BIRTHDAY_CONFIG } = await import('./birthday.config.js');
  console.log('Photos array length:', BIRTHDAY_CONFIG.photos.length);
  BIRTHDAY_CONFIG.photos.forEach((p, idx) => {
    const p1 = `images/${p.filename}`;
    const p2 = `public/images/${p.filename}`;
    const e1 = fs.existsSync(p1);
    const e2 = fs.existsSync(p2);
    console.log(`[${idx + 1}] ${p.filename}: images=${e1}, public/images=${e2}`);
  });
}
testPhotos();
