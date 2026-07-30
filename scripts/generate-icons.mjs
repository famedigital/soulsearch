import sharp from 'sharp';
import { mkdirSync, readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const standardSvg = readFileSync(join(root, 'public/brand/soulsearch-emblem.svg'));
const maskableSvg = readFileSync(join(root, 'public/brand/soulsearch-emblem-maskable.svg'));

/** @type {{ out: string; size: number; svg: Buffer }[]} */
const outputs = [
  { out: 'public/favicon.png', size: 32, svg: standardSvg },
  { out: 'public/icons/icon-192.png', size: 192, svg: standardSvg },
  { out: 'public/icons/icon-512.png', size: 512, svg: standardSvg },
  { out: 'public/icons/apple-touch-icon.png', size: 180, svg: standardSvg },
  { out: 'public/admin-pwa/icons/icon-192.png', size: 192, svg: standardSvg },
  { out: 'public/admin-pwa/icons/icon-512.png', size: 512, svg: standardSvg },
  { out: 'public/admin-pwa/icons/icon-512-maskable.png', size: 512, svg: maskableSvg },
  { out: 'public/admin-pwa/icons/apple-touch-icon.png', size: 180, svg: standardSvg },
];

for (const { out, size, svg } of outputs) {
  const dest = join(root, out);
  mkdirSync(dirname(dest), { recursive: true });
  await sharp(svg).resize(size, size).png().toFile(dest);
  console.log(`✓ ${out} (${size}×${size})`);
}

console.log('\nAll icons generated.');
