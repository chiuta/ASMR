// Teste v2.2.0 pentru ASMR fără frontiere: „Sunetul meu” (fișier audio local, în buclă, cu limitator, doar în sesiune).
// Rulare: node tests/layers-fade-v21.test.mjs   (Playwright din /opt/node-tools, rețea blocată). Testează logica și graful audio, nu sunetul.
import {createRequire} from 'module';
import fs from 'fs';
import http from 'http';
import os from 'os';
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

function wav(sr, secs, fn) {
  const n = Math.round(sr * secs), buf = Buffer.alloc(44 + n * 2);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + n * 2, 4); buf.write('WAVEfmt ', 8); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(sr, 24); buf.writeUInt32LE(sr * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) buf.writeInt16LE(Math.round(fn(i)), 44 + i * 2);
  return buf;
}
const tmp = (nm, bf) => { const f = path.join(os.tmpdir(), nm + process.pid); fs.writeFileSync(f, bf); return f; };
const good = tmp('asmr-own-good.wav', wav(22050, 2, (i) => 12000 * Math.sin(2 * Math.PI * 440 * i / 22050)));
const junk = tmp('asmr-own-junk.wav', Buffer.from('nu sunt audio '.repeat(50)));
const big = tmp('asmr-own-big.wav', Buffer.alloc(26 * 1024 * 1024, 1));
const long = tmp('asmr-own-long.wav', wav(8000, 330, () => 0));

console.log('Sunetul meu: stare inițială');
{
  const {ctx, p, errs, net} = await open('ro');
  t('secțiunea există, titlul în română', /Sunetul meu/.test(await p.textContent('.ownsound h2')));
  t('card ascuns, glisor dezactivat, „Elimină” dezactivat', (await p.isHidden('#ownCard')) && (await p.isDisabled('#ownVol')) && (await p.isDisabled('#ownClear')));
  t('cele 11 straturi rămân neschimbate', (await p.locator('.layer-card').count()) === 11);
  t('0 erori / 0 rețea', errs.length === 0 && net() === 0, errs);
  await ctx.close();
}

console.log('Sunetul meu: încărcare, volum, limitator, buclă, oprire, eliminare');
{
  const {ctx, p, errs, net} = await open('en');
  await p.setInputFiles('#ownFile', junk);
  await p.waitForFunction(() => document.getElementById('ownMsg').textContent.length > 0, null, {timeout: 20000});
  t('fișier ne-audio: mesaj de eroare, nimic încărcat', /Could not decode/.test(await p.textContent('#ownMsg')) && (await p.evaluate(() => !ASMR_OWN.state().loaded)));
  await p.setInputFiles('#ownFile', big);
  await p.waitForFunction(() => /larger than 25 MB/.test(document.getElementById('ownMsg').textContent), null, {timeout: 20000});
  t('peste 25 MB: refuzat înainte de decodare', await p.evaluate(() => !ASMR_OWN.state().loaded));
  await p.setInputFiles('#ownFile', long);
  await p.waitForFunction(() => /longer than 5 minutes/.test(document.getElementById('ownMsg').textContent), null, {timeout: 30000});
  t('peste 5 minute: refuzat', await p.evaluate(() => !ASMR_OWN.state().loaded));
  await p.setInputFiles('#ownFile', good);
  await p.waitForFunction(() => ASMR_OWN.state().loaded, null, {timeout: 20000});
  const S = await p.evaluate(() => { const s = ASMR_OWN.state(); return {name: s.name, dur: s.dur, vol: s.volume, loop: s.loop, thr: s.limiter.threshold.value, ratio: s.limiter.ratio.value, wave: document.getElementById('waveform').classList.contains('active')}; });
  t('încărcat: nume, ~2 s, volum 50, buclă', /asmr-own-good/.test(S.name) && Math.abs(S.dur - 2) < 0.1 && S.vol === 50 && S.loop, S);
  t('limitator în lanț (prag −12 dB, raport 20)', Math.abs(S.thr + 12) < 0.01 && S.ratio === 20, S);
  t('forma de undă devine activă', S.wave);
  t('card vizibil, mesaj „Loaded”, „Remove” activ', (await p.isVisible('#ownCard')) && /Loaded: .*asmr-own-good/.test(await p.textContent('#ownMsg')) && !(await p.isDisabled('#ownClear')));
  await p.evaluate(() => { const s = document.getElementById('ownVol'); s.value = 80; s.dispatchEvent(new Event('input', {bubbles: true})); });
  await p.waitForTimeout(700);
  const g = await p.evaluate(() => ASMR_OWN.state().gain.gain.value);
  t('volum 80 % → câștig ≈ 0,8', Math.abs(g - 0.8) < 0.05, g);
  t('cardurile de straturi: tot 11; nimic salvat cu sunetul în localStorage', (await p.locator('.layer-card').count()) === 11 && await p.evaluate(() => Object.keys(localStorage).every((k) => localStorage.getItem(k).length < 20000 && !/own/i.test(k))));
  await p.click('#stopAll');
  await p.waitForTimeout(300);
  t('„Oprește toate straturile” aduce sunetul meu la 0', await p.evaluate(() => ASMR_OWN.state().volume === 0 && !ASMR_OWN.active()));
  await p.evaluate(() => { const s = document.getElementById('ownVol'); s.value = 40; s.dispatchEvent(new Event('input', {bubbles: true})); });
  t('revine la volum > 0 → activ', await p.evaluate(() => ASMR_OWN.active()));
  await p.click('#ownClear');
  t('eliminare: card ascuns, nimic încărcat, glisor dezactivat', (await p.isHidden('#ownCard')) && await p.evaluate(() => !ASMR_OWN.state().loaded) && (await p.isDisabled('#ownVol')));
  t('0 erori / 0 rețea', errs.length === 0 && net() === 0, errs);
  await ctx.close();
}

console.log('Sunetul meu: limbi');
{
  const {ctx, p, errs} = await open('de');
  t('germană: textele noi cad pe engleză', /My sound/.test(await p.textContent('.ownsound h2')) && /Choose an audio file/.test(await p.textContent('#ownPick')));
  t('germană: restul aplicației rămâne tradus', !/Stop all layers/.test(await p.textContent('#stopAll')));
  await p.selectOption('#langSelect', 'ro').catch(() => {});
  t('0 erori', errs.length === 0, errs);
  await ctx.close();
}
await b.close(); srv.close();
for (const f of [good, junk, big, long]) fs.unlinkSync(f);
console.log(`\n${ok} reușite, ${bad} eșuate`);
process.exit(bad ? 1 : 0);
