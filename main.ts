// Hearth Ledger — the entrypoint the grader runs (Node 22, standard library
// only). The site is this directory's app/ folder: plain static files a browser
// opens at app/index.html (ES modules, CSS, no build step), its content held
// in its own files, so nothing it runs, styles or shows loads over the
// network. This program hands it in: it copies app/ and screenshots/ from
// beside this file into the output directory and writes dossier.json, the
// summary the judge reads (the screenshots, the first load's files and bytes,
// and the source), using the vendored make.fun library. Leave
// vendor/makefun-frontend.ts as it is: the scorer requires dossier.json to be
// byte for byte what its own copy writes.
//
// Serve the site locally with `node serve.ts`, then open http://localhost:8080.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The entry is not shippable without its front page; fail loudly instead of
// handing in an empty app/ directory.
const indexHtml = join(here, 'app', 'index.html');
if (!existsSync(indexHtml) || !statSync(indexHtml).isFile()) {
  throw new Error('app/index.html is missing — nothing to hand in');
}

// The gate wants 3 or 4 screenshots; refuse early with a plain message
// instead of letting buildDossier fail halfway through the handover.
const shotsDir = join(here, 'screenshots');
const shotCount = existsSync(shotsDir)
  ? readdirSync(shotsDir).filter((name) => /\.(png|jpe?g)$/i.test(name)).length
  : 0;
if (shotCount < 3 || shotCount > 4) {
  throw new Error(`screenshots/ holds ${shotCount} images; the gate needs 3 or 4`);
}

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the
// bytes; the others refuse an entry the scorer would refuse (more than 4
// screenshots or one over 256 KiB; more than 993 files and directories in
// app/ or 16 MiB of app files: app/ counts beside /output's own 1000-entry
// cap, its screenshots/ and dossier.json).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);

console.log(
  `Hearth Ledger handed in: ${shotCount} screenshot${shotCount === 1 ? '' : 's'} and dossier.json written to ${out}`,
);
