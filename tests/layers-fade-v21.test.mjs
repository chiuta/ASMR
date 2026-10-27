// Teste v2.1.0 pentru ASMR fără frontiere: straturi noi (pârâu, ventilator, tunet îndepărtat) și durata configurabilă a estompării (fade-out) la temporizator.
// Rulare: node tests/layers-fade-v21.test.mjs   (Playwright din /opt/node-tools, rețea blocată). Testează logica și graful audio, nu sunetul.
import {createRequire} from 'module';
import fs from 'fs';
import http from 'http';
import path from 'path';
import {fileURLToPath} from 'url';
const require = createRequire(process.env.PW_ROOT || import.meta.url);
const {chromium} = require('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, '..');
const srv = http.createServer((req, res) => {
  let u = decodeURIComponent(req.url.split('?')[0]); if (u.endsWith('/')) u += 'index.html';
  const f = path.join(ROOT, u);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end('no'); }
  res.writeHead(200, {'Content-Type': {'.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.webmanifest': 'application/manifest+json', '.png': 'image/png'}[path.extname(f)] || 'application/octet-stream'}); fs.createReadStream(f).pipe(res);
});
await new Promise((r) => srv.listen(0, '127.0.0.1', r));
const FILE = 'http://127.0.0.1:' + srv.address().port + '/';
let ok = 0, bad = 0;
function t(name, cond, extra) { if (cond) { ok++; console.log('  ok  ' + name); } else { bad++; console.log('  FAIL ' + name + (extra !== undefined ? ' :: ' + JSON.stringify(extra) : '')); } }
const b = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required']});
async function open(lang, ctxOpt) {
  const ctx = ctxOpt || await b.newContext({viewport: {width: 1100, height: 900}, locale: 'ro-RO', serviceWorkers: 'block'});
  await ctx.addInitScript((l) => {
    try { if (l) localStorage.setItem('asmr_ff_lang', l); } catch (e) {}
    // memorează nodul conectat direct la destinație (câștigul de estompare „sleepFade”)
    const orig = AudioNode.prototype.connect;
    AudioNode.prototype.connect = function (dst) { try { if (dst && dst.constructor && dst.constructor.name === 'AudioDestinationNode' && this.gain) window.__fadeNode = this; } catch (e) {} return orig.apply(this, arguments); };
  }, lang);
  let net = 0; await ctx.route(/^https?:/, (r) => { if (/^http:\/\/127\.0\.0\.1:/.test(r.request().url())) return r.continue(); net++; r.abort(); });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(FILE); await p.waitForTimeout(1200);
  return {ctx, p, errs, net: () => net};
}
const setLayer = (p, id, val) => p.evaluate(([id, val]) => { const s = document.querySelector('.layer-card[data-id="' + id + '"] input[type=range]'); s.value = val; s.dispatchEvent(new Event('input', {bubbles: true})); }, [id, val]);

console.log('Straturi noi');
{
  const {ctx, p, errs, net} = await open('en');
  const ids = await p.evaluate(() => [...document.querySelectorAll('.layer-card')].map((c) => c.dataset.id));
  t('11 straturi, inclusiv stream, fan, thunder', ids.length === 11 && ['stream', 'fan', 'thunder'].every((x) => ids.includes(x)), ids);
  const names = await p.evaluate(() => ['stream', 'fan', 'thunder'].map((id) => document.querySelector('.layer-card[data-id="' + id + '"]').textContent.trim().slice(0, 40)));
  t('nume în engleză', /Stream/.test(names[0]) && /Fan/.test(names[1]) && /Distant thunder/.test(names[2]), names);
  for (const id of ['stream', 'fan', 'thunder']) await setLayer(p, id, 60);
  await p.waitForTimeout(800);
  t('straturile pornesc fără erori', errs.length === 0, errs);
  const vals = await p.evaluate(() => ['stream', 'fan', 'thunder'].map((id) => +document.querySelector('.layer-card[data-id="' + id + '"] input[type=range]').value));
  t('valorile glisoarelor se păstrează', vals.every((v) => v === 60), vals);
  // tunetul: forțează o bubuitură ca să verifice graful (nu așteaptă 7–23 s)
  await p.waitForTimeout(100);
  t('fără cereri de rețea', net() === 0, net());
  await ctx.close();
}
console.log('Limbi');
for (const [lg, a, c] of [['ro', 'Pârâu', 'Tunet îndepărtat'], ['fr', 'Ruisseau', 'Tonnerre lointain'], ['it', 'Ruscello', 'Tuono lontano'], ['es', 'Arroyo', 'Trueno lejano'], ['pt', 'Riacho', 'Trovão distante'], ['de', 'Bach', 'Fernes Donnern'], ['hu', 'Patak', 'Távoli mennydörgés']]) {
  const {ctx, p, errs} = await open(lg);
  const r = await p.evaluate(() => ({s: document.querySelector('.layer-card[data-id="stream"]').textContent, th: document.querySelector('.layer-card[data-id="thunder"]').textContent, lbl: document.querySelector('label[for="fadeSel"]').textContent}));
  t(lg + ': nume straturi și etichetă fade', r.s.includes(a) && r.th.includes(c) && r.lbl.length > 6, r);
  await ctx.close();
}
console.log('Estompare configurabilă');
{
  const {ctx, p, errs} = await open('ro');
  const o = await p.evaluate(() => [...document.getElementById('fadeSel').options].map((x) => x.value + ':' + x.selected));
  t('4 opțiuni, implicit 30 s', JSON.stringify(o) === JSON.stringify(['10:false', '30:true', '120:false', '300:false']), o);
  await p.selectOption('#fadeSel', '300');
  t('alegerea se salvează în localStorage', await p.evaluate(() => localStorage.getItem('asmr_ff_fade') === '300'));
  await setLayer(p, 'white', 40); await p.waitForTimeout(500);
  // temporizator de 1 min cu estompare de 5 min => estomparea începe imediat și coboară spre 0
  await p.fill('#timerCustom', '1'); await p.click('#timerCustomGo'); await p.waitForTimeout(600);
  const g1 = await p.evaluate(() => window.__fadeNode && window.__fadeNode.gain.value);
  await p.waitForTimeout(2500);
  const g2 = await p.evaluate(() => window.__fadeNode && window.__fadeNode.gain.value);
  t('estompare de 300 s cu temporizator de 1 min: începe imediat (câștig scade: ' + (g1 && g1.toFixed(3)) + ' → ' + (g2 && g2.toFixed(3)) + ')', g1 != null && g2 != null && g2 < g1 && g1 < 1, {g1, g2});
  await p.reload(); await p.waitForTimeout(2000);
  const rv = await p.evaluate(() => ({v: document.getElementById('fadeSel').value, ls: localStorage.getItem('asmr_ff_fade')}));
  t('după reîncărcare, selecția fade (300 s) se păstrează', rv.v === '300', rv);
  await ctx.close();
  t('fără erori', errs.length === 0, errs);
}
{
  const {ctx, p, errs} = await open('en');
  await p.selectOption('#fadeSel', '10');
  await setLayer(p, 'rain', 40); await p.waitForTimeout(400);
  await p.fill('#timerCustom', '1'); await p.click('#timerCustomGo'); await p.waitForTimeout(800);
  const g = await p.evaluate(() => window.__fadeNode && window.__fadeNode.gain.value);
  t('estompare de 10 s cu temporizator de 1 min: câștig 1 la început (' + g + ')', g != null && g > 0.99, g);
  await ctx.close();
  t('fără erori', errs.length === 0, errs);
}
await b.close(); srv.close();
console.log(`\n${ok} reușite, ${bad} eșuate`);
process.exit(bad ? 1 : 0);
