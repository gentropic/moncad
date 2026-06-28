// publish.mjs — wrap auditable's built moncad.html into the deployed PWA.
// This repo is the release surface: the PWA shell (manifest.webmanifest, sw.js,
// icon.svg) is owned here; the app itself is built in the auditable monorepo
// (`node build.js --target=moncad`) and lands here as moncad.html.
//
// Source of moncad.html, in order of preference:
//   1. a dir passed as argv[2] (CI: ./dl, where publish.yml would download the latest
//      auditable RELEASE asset) — keeps the deploy in sync with releases;
//   2. the committed moncad.html in this repo (the seed / dev-refreshed copy) —
//      so a plain push deploys without waiting on an auditable release.
//
// Produces index.html (moncad.html + PWA injection), served at gentropic.org/moncad/.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const here = path.dirname(fileURLToPath(import.meta.url));
const src = process.argv[2] ? path.resolve(process.argv[2]) : null;

function findMoncad() {
  for (const dir of [src, here]) {
    if (!dir) continue;
    const p = path.join(dir, 'moncad.html');
    if (fs.existsSync(p)) return p;
  }
  return null;
}

const PWA_INJECT =
  '<link rel="manifest" href="manifest.webmanifest">\n'
  + '<meta name="theme-color" content="#121212">\n'
  + '<script>if("serviceWorker" in navigator)addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));</script>\n';

const injectPwa = (html) => (/rel="manifest"/.test(html) ? html : html.replace(/<\/head>/i, PWA_INJECT + '</head>'));

const app = findMoncad();
if (!app) {
  console.error('publish: no moncad.html found.\n  build it: (in ../auditable) node build.js --target=moncad, then copy it here — or let CI download the release asset.');
  process.exit(1);
}
fs.writeFileSync(path.join(here, 'index.html'), injectPwa(fs.readFileSync(app, 'utf8')));
console.log(`published index.html from ${path.relative(here, app) || 'moncad.html'} (${(fs.statSync(app).size / 1024).toFixed(0)} KB)`);
