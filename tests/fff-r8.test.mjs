// Teste R8 pentru ASMR fără frontiere 1.1.1: înregistrare WAV, QR pentru mix, ghid vocal.
// Rulare: node tests/fff-r8.test.mjs   (Playwright din /opt/node-tools, rețea blocată)
import {createRequire} from 'module';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
const require = createRequire('/opt/node-tools/package.json');
const {chromium} = require('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const FILE = 'file://' + path.resolve(here, '..', 'index.html');
const AXE = process.env.FFF_AXE || '/tmp/claude-0/-home-claude/78529928-3825-51c3-b9bd-0e81655ab6bc/scratchpad/sweep/node_modules/axe-core/axe.min.js';
let ok = 0, bad = 0;
function t(name, cond, extra) { if (cond) { ok++; console.log('  ok  ' + name); } else { bad++; console.log('  FAIL ' + name + (extra ? ' :: ' + extra : '')); } }

const b = await chromium.launch({executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required']});
async function open(w, h, init, opts = {}) {
  const ctx = await b.newContext({viewport: {width: w, height: h}, acceptDownloads: true, ...opts});
  let net = 0; await ctx.route(/^https?:/, (r) => { net++; r.abort(); });
  if (init) await ctx.addInitScript(init);
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', (e) => errs.push('pageerror ' + e.message));
  p.on('console', (m) => { if (/Content Security|Refused/i.test(m.text())) errs.push('csp ' + m.text().slice(0, 120)); });
  await p.goto(FILE); await p.waitForTimeout(3600);
  return {ctx, p, errs, net: () => net};
}
async function axe(w, h, prep, label) {
  const ctx = await b.newContext({viewport: {width: w, height: h}, bypassCSP: true}); await ctx.route(/^https?:/, (r) => r.abort());
  const p = await ctx.newPage(); await p.goto(FILE); await p.waitForTimeout(3600);
  await p.addScriptTag({content: fs.readFileSync(AXE, 'utf8')});
  if (prep) await prep(p);
  const v = await p.evaluate(async () => (await axe.run(document)).violations.map((x) => x.id + ':' + x.nodes.length));
  t('axe 0 violări ' + label + ' ' + w + 'px', v.length === 0, v.join(','));
  await ctx.close();
}
async function setLayer(p, id, val) {
  await p.evaluate(([id, val]) => { const s = document.querySelector('.layer-card[data-id="' + id + '"] input[type=range]'); s.value = val; s.dispatchEvent(new Event('input', {bubbles: true})); }, [id, val]);
}
const layerVal = (p, id) => p.evaluate((id) => +document.querySelector('.layer-card[data-id="' + id + '"] input[type=range]').value, id);

console.log('Pornire și versiune');
{
  const {ctx, p, errs, net} = await open(1280, 800);
  t('0 pageerror/CSP', errs.length === 0, errs.join('|'));
  t('0 cereri de rețea', net() === 0);
  t('versiune 1.1.1', await p.evaluate(() => document.querySelector('meta[name=application-version]').content === '1.1.1' && /v 1\.1\.1 · 2026-10-18/.test(document.getElementById('app-version').textContent)));
  t('kit prezent (core,label,bundle,qr,tts)', await p.evaluate(() => !!(window.FFF && FFF.label && FFF.bundle && FFF.qr && FFF.tts)));
  t('panou R8 vizibil', await p.locator('#r8Panel').isVisible());
  await ctx.close();
}

console.log('Înregistrare WAV');
{
  const {ctx, p, errs} = await open(1280, 800);
  await p.click('#r8RecBtn');
  t('fără sunet activ: refuză cu mesaj', /Nu există sunet/.test(await p.textContent('#r8RecMsg')));
  await setLayer(p, 'white', 60);
  await p.selectOption('#r8RecDur', '15');
  const dlP = p.waitForEvent('download', {timeout: 30000}); await p.click('#r8RecBtn');
  t('butonul devine „Oprește și salvează”', (await p.textContent('#r8RecBtn')) === 'Oprește și salvează' && (await p.getAttribute('#r8RecBtn', 'aria-pressed')) === 'true');
  const dl = await dlP;
  const f = '/tmp/asmr-rec-test.wav'; await dl.saveAs(f);
  const buf = fs.readFileSync(f);
  t('antet RIFF/WAVE', buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WAVE');
  const ch = buf.readUInt16LE(22), rate = buf.readUInt32LE(24), bits = buf.readUInt16LE(34), dlen = buf.readUInt32LE(40);
  const secs = dlen / (ch * 2) / rate;
  t('stereo 16 biți', ch === 2 && bits === 16, ch + '/' + bits);
  t('durată ≈ 15 s', Math.abs(secs - 15) < 0.6, secs.toFixed(2));
  let peak = 0; for (let i = 44; i < buf.length; i += 2) { const v = Math.abs(buf.readInt16LE(i)); if (v > peak) peak = v; }
  t('conține sunet real (vârf > 300)', peak > 300, String(peak));
  t('nume fișier asmr-mix-*.wav', /^asmr-mix-\d{8}-\d{4}\.wav$/.test(dl.suggestedFilename()), dl.suggestedFilename());
  t('mesaj de salvare', /Salvat: /.test(await p.textContent('#r8RecMsg')));
  fs.unlinkSync(f);
  t('0 erori', errs.length === 0, errs.join('|'));
  // oprire manuală
  await p.selectOption('#r8RecDur', '300');
  await p.click('#r8RecBtn'); await p.waitForTimeout(2500);
  const [dl2] = await Promise.all([p.waitForEvent('download', {timeout: 8000}), p.click('#r8RecBtn')]);
  const f2 = '/tmp/asmr-rec-test2.wav'; await dl2.saveAs(f2); const b2 = fs.readFileSync(f2);
  const s2 = b2.readUInt32LE(40) / 4 / b2.readUInt32LE(24);
  t('oprire manuală salvează părțile înregistrate (≈2,5 s)', s2 > 1.5 && s2 < 4.5, s2.toFixed(2)); fs.unlinkSync(f2);
  t('buton revine la „Înregistrează”', (await p.textContent('#r8RecBtn')) === 'Înregistrează');
  await ctx.close();
}

console.log('QR pentru mix');
{
  const {ctx, p, errs} = await open(1280, 800);
  await p.click('#r8QrBtn');
  t('fără straturi: mesaj, fără dialog', /Nu există niciun strat/.test(await p.textContent('#r8QrMsg')) && (await p.locator('dialog.r8-dlg').count()) === 0);
  await setLayer(p, 'rain', 55); await setLayer(p, 'wind', 20);
  await p.click('#r8QrBtn');
  t('dialog QR cu SVG', await p.locator('dialog.r8-dlg[open] svg').count() === 1);
  const text = await p.inputValue('dialog.r8-dlg textarea');
  t('textul conține mixul', /mix=rain~55\.wind~20/.test(text), text);
  t('fără adresă web: doar #mix=…', text.startsWith('#mix='), text);
  const png = await p.evaluate(async () => {
    const svg = document.querySelector('dialog.r8-dlg .r8-qr svg').outerHTML;
    const url = URL.createObjectURL(new Blob([svg], {type: 'image/svg+xml'}));
    const img = new Image(); await new Promise((r, j) => { img.onload = r; img.onerror = j; img.src = url; });
    const c = document.createElement('canvas'); c.width = 500; c.height = 500; const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, 500, 500); g.drawImage(img, 0, 0, 500, 500);
    const blob = await new Promise((r) => c.toBlob(r, 'image/png')); return Array.from(new Uint8Array(await blob.arrayBuffer()));
  });
  await p.keyboard.press('Escape');
  t('Escape închide dialogul', await p.locator('dialog.r8-dlg').count() === 0);
  await setLayer(p, 'rain', 0); await setLayer(p, 'wind', 0);
  await p.setInputFiles('#r8QrFile', {name: 'qr.png', mimeType: 'image/png', buffer: Buffer.from(png)});
  await p.waitForTimeout(800);
  t('scanarea imaginii aplică mixul', (await layerVal(p, 'rain')) === 55 && (await layerVal(p, 'wind')) === 20, (await p.textContent('#r8QrMsg')));
  // imagine fără QR
  await setLayer(p, 'rain', 0);
  const blank = await p.evaluate(async () => { const c = document.createElement('canvas'); c.width = 200; c.height = 200; const blob = await new Promise((r) => c.toBlob(r, 'image/png')); return Array.from(new Uint8Array(await blob.arrayBuffer())); });
  await p.setInputFiles('#r8QrFile', {name: 'gol.png', mimeType: 'image/png', buffer: Buffer.from(blank)});
  await p.waitForTimeout(600);
  t('imagine fără QR: mesaj, nimic aplicat', /Nu am găsit/.test(await p.textContent('#r8QrMsg')) && (await layerVal(p, 'rain')) === 0);
  t('0 erori', errs.length === 0, errs.join('|'));
  await ctx.close();
}

console.log('Ghid vocal de respirație');
{
  // text-only (fără voce în headless)
  const {ctx, p, errs} = await open(1280, 800);
  await p.selectOption('#r8BreathCycles', '4');
  await p.click('#r8BreathBtn');
  t('arată „Inspiră (1/4)”', /^Inspiră \(1\/4\)$/.test(await p.textContent('#r8BreathText')));
  t('aria-pressed=true', (await p.getAttribute('#r8BreathBtn', 'aria-pressed')) === 'true');
  await p.waitForTimeout(4300);
  t('după 4 s: „Expiră (1/4)”', /^Expiră \(1\/4\)$/.test(await p.textContent('#r8BreathText')), await p.textContent('#r8BreathText'));
  await p.click('#r8BreathBtn');
  t('oprire: text „Ghid oprit.”', (await p.textContent('#r8BreathText')) === 'Ghid oprit.');
  await ctx.close();
}
{
  // cu voce simulată (mock speechSynthesis) — verifică apelul real către FFF.tts
  const mock = () => {
    const spoken = []; window.__spoken = spoken;
    class U { constructor(t) { this.text = t; } }
    const voices = [{name: 'Test RO', lang: 'ro-RO', localService: true, default: true, voiceURI: 'test-ro'}];
    const synth = {speaking: false, paused: false, getVoices: () => voices, addEventListener() {}, removeEventListener() {}, cancel() {}, pause() {}, resume() {},
      speak(u) { spoken.push({text: u.text, lang: u.lang, rate: u.rate}); setTimeout(() => u.onstart && u.onstart(), 0); setTimeout(() => u.onend && u.onend(), 30); }};
    Object.defineProperty(window, 'speechSynthesis', {value: synth, configurable: true});
    window.SpeechSynthesisUtterance = U;
  };
  const {ctx, p, errs} = await open(1280, 800, mock);
  await p.selectOption('#r8BreathCycles', '4');
  await p.click('#r8BreathBtn'); await p.waitForTimeout(500);
  let sp = await p.evaluate(() => window.__spoken);
  t('rostește „Inspiră” în ro', sp.length >= 1 && sp[0].text === 'Inspiră' && /^ro/.test(sp[0].lang), JSON.stringify(sp));
  await p.waitForTimeout(4200);
  sp = await p.evaluate(() => window.__spoken);
  t('apoi „Expiră”, cu ritm încetinit', sp.length >= 2 && sp[1].text === 'Expiră' && sp[1].rate < 1, JSON.stringify(sp));
  await p.click('#r8BreathBtn'); await ctx.close();
}

console.log('Kit: etichetă și copie de siguranță');
{
  const {ctx, p, errs} = await open(1280, 800);
  await p.fill('#presetName', 'test r8'); await p.click('#savePreset');
  const keys = await p.evaluate(() => FFF.store.indexKeys());
  t('cheia presetărilor este indexată', keys.indexOf('asmr_ff_presets') >= 0, keys.join(','));
  const bundle = await p.evaluate(() => FFF.bundle.build());
  t('bundle conține presetările', bundle && bundle.app === 'asmr' && /test r8/.test(bundle.data.asmr_ff_presets || ''));
  await p.click('#app-version'); await p.waitForTimeout(300);
  t('dialog „Transparență” se deschide', await p.locator('dialog[open]').count() === 1);
  await p.keyboard.press('Escape');
  t('0 erori', errs.length === 0, errs.join('|'));
  await ctx.close();
}

console.log('Accesibilitate și dimensiuni');
for (const [w, h] of [[1280, 800], [360, 740]]) {
  await axe(w, h, null, 'pagină');
  await axe(w, h, async (p) => { await setLayer(p, 'rain', 40); await p.click('#r8QrBtn'); await p.waitForTimeout(200); }, 'dialog QR');
  await axe(w, h, async (p) => { await p.click('#app-version'); await p.waitForTimeout(300); }, 'dialog Transparență');
  const {ctx, p} = await open(w, h);
  t('fără depășire orizontală ' + w, await p.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth));
  await ctx.close();
}
console.log('Import pachet FFF: presetările se îmbină, nu se suprascriu');
{
  const {ctx, p, errs} = await open(1280, 800);
  const R = await p.evaluate(async () => {
    const mine = [{name: 'Al meu', layers: {}, binaural: null}, {name: 'Comun', layers: {}, binaural: null}];
    localStorage.setItem('asmr_ff_presets', JSON.stringify(mine));
    const inc = []; for (let i = 0; i < 60; i++) inc.push({name: 'Din fișier ' + i, layers: {}, binaural: null});
    inc.push({name: 'comun', layers: {}, binaural: 'alpha'});
    const env = {format: 'fff-bundle', schema: 1, app: 'asmr', version: '1.1.1', exported: new Date().toISOString(), data: {asmr_ff_presets: JSON.stringify(inc)}};
    const f = new File([JSON.stringify(env)], 'x.fff.json', {type: 'application/json'});
    const r = await FFF.bundle.import(f, {confirm: false, reload: false});
    const out = JSON.parse(localStorage.getItem('asmr_ff_presets'));
    return {r, n: out.length, names: out.map((x) => x.name), msg: document.getElementById('presetMsg').textContent};
  });
  t('import: presetarea proprie „Al meu” a rămas', R.names.includes('Al meu'), JSON.stringify(R).slice(0, 300));
  t('import: presetările din fișier au fost adăugate', R.names.includes('Din fișier 0'));
  t('import: același nume (fără litere mari) înlocuiește, nu dublează', R.names.filter((x) => x.toLowerCase() === 'comun').length === 1);
  t('import: plafon 50 respectat', R.n === 50, R.n);
  t('import: mesaj despre îmbinare', /îmbinate/.test(R.msg), R.msg);
  t('import: fără erori', errs.length === 0, errs.join('|'));
  await ctx.close();
}
await b.close();
console.log(`\n${ok} reușite, ${bad} eșuate`); process.exit(bad ? 1 : 0);
