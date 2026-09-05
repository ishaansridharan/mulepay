/**
 * Rebuild the BouncePay prototype into public/demo/ and apply the dark theme.
 *
 * The prototype lives in a sibling repo and ships a light Material You
 * palette. This script builds it with a relative base (so it can be served
 * from /demo/), then links scripts/demo-theme.css after its own stylesheet to
 * re-point its tokens at the site's dark palette.
 *
 * Run with: npm run build:demo
 */
import { execSync } from 'node:child_process';
import { copyFileSync, existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const site = resolve(here, '..');
const proto = resolve(site, '..', 'bouncepay');
const outDir = resolve(site, 'public', 'demo');
const themeSrc = resolve(here, 'demo-theme.css');
const THEME_FILE = 'theme-dark.css';

if (!existsSync(proto)) {
  console.error(`✗ Prototype not found at ${proto}`);
  console.error('  Expected it as a sibling of this repo. Nothing was changed.');
  process.exit(1);
}

console.log(`• Building prototype from ${proto}`);
execSync(
  `npx vite build --base=./ --outDir "${outDir}" --emptyOutDir`,
  { cwd: proto, stdio: 'inherit' }
);

// --emptyOutDir wipes the folder, so the theme is copied in after the build.
copyFileSync(themeSrc, resolve(outDir, THEME_FILE));
console.log(`• Copied ${THEME_FILE}`);

// The terminal's device id repeats across the merchant panel and adds nothing
// at a glance, so it is stripped from the markup and from the strings the app
// builds at runtime. Done post-build so a rebuild cannot reintroduce it.
const NOISE = [' (POS #BP-01)', ' • POS #BP-01'];
const stripNoise = (file) => {
  let text = readFileSync(file, 'utf8');
  let hits = 0;
  for (const phrase of NOISE) {
    while (text.includes(phrase)) { text = text.replace(phrase, ''); hits++; }
  }
  if (hits) { writeFileSync(file, text, 'utf8'); }
  return hits;
};

const indexPath = resolve(outDir, 'index.html');
const assetsDir = resolve(outDir, 'assets');
const jsFiles = existsSync(assetsDir)
  ? readdirSync(assetsDir).filter(f => f.endsWith('.js')).map(f => resolve(assetsDir, f))
  : [];
const stripped = [indexPath, ...jsFiles].reduce((n, f) => n + stripNoise(f), 0);
console.log(`• Stripped ${stripped} device-id reference(s)`);

let html = readFileSync(indexPath, 'utf8');

if (html.includes(THEME_FILE)) {
  console.log('• Theme already linked');
} else {
  // Must load after the prototype's own stylesheet to win the cascade.
  const appCss = html.match(/<link[^>]+rel="stylesheet"[^>]+assets\/[^>]*>/);
  if (!appCss) {
    console.error('✗ Could not find the prototype stylesheet link to anchor to.');
    process.exit(1);
  }
  html = html.replace(
    appCss[0],
    `${appCss[0]}\n  <link rel="stylesheet" href="./${THEME_FILE}" />`
  );
  writeFileSync(indexPath, html, 'utf8');
  console.log('• Linked the dark theme into index.html');
}

console.log('✓ Demo ready at public/demo/');
