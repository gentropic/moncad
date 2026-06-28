# moncad

A small **2D CAD instrument** with GCU sensibilities — draft with real **DXF
round-trip** and **frame-correct (UTM) coordinates**, on a WebGL2 board you operate by
command and read by panel. Offline, networkless, single file.

_Not live yet — this repo is being scaffolded as the deploy surface._ Intended home:
**https://gentropic.org/moncad**.

## What this repo is

The **deploy surface** only — the PWA shell (`manifest.webmanifest`, `sw.js`,
`icon.svg`) lives here. The app itself is built in the
[auditable](https://github.com/gentropic/auditable) monorepo
(`ext/frame` + `ext/dxf` + `tools/moncad`); its single-file build (`node build.js
--target=moncad`) lands here as `moncad.html`.

`publish.mjs` wraps `moncad.html` into `index.html` (PWA injection). A GitHub Pages
workflow will deploy it once the tool is ready to go live (not added yet).

## Updating

- **Dev refresh:** in `../auditable`, `node build.js --target=moncad`, copy
  `moncad.html` here, then `node publish.mjs` → `index.html`.
- **Service worker:** `node build-sw.mjs` regenerates `sw.js` from `@gcu/sw`
  (needs `../auditable` checked out); the result is committed.

## Notes

- No `file_handlers` registered: moncad reads/writes DXF but does not *own* `.dxf`
  (reads ≠ claims). A handler lands when moncad has its own document format.

MIT © Arthur Endlein Correia / Geoscientific Chaos Union.
