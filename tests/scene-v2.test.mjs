// Teste v2.1.0 pentru ASMR fără frontiere: scene sonore cu automații în timp (puncte, interpolare, link/QR, salvare).
// Rulare: node tests/scene-v2.test.mjs   (Playwright din /opt/node-tools, rețea blocată). Testează logica, nu sunetul.
import {createRequire} from 'module';
import path from 'path';
import {fileURLToPath} from 'url';
const require = createRequire(process.env.PW_ROOT || import.meta.url);
const {chromium} = require('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const FILE = 'file://' + path.resolve(here, '..', 'index.html');
let ok = 0, bad = 0;
function t(name, cond, extra) { if (cond) { ok++; console.log('  ok  ' + name); } else { bad++; console.log('  FAIL ' + name + (extra ? ' :: ' + extra : '')); } }
const b = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required']});
async function open(hash = '') {
  const ctx = await b.newContext({viewport: {width: 1100, height: 900}, locale: 'ro-RO'});
  let net = 0; await ctx.route(/^https?:/, (r) => { net++; r.abort(); });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(FILE + hash); await p.waitForTimeout(1500);
  return {ctx, p, errs, net: () => net};
}
async function setLayer(p, id, val) {
  await p.evaluate(([id, val]) => { const s = document.querySelector('.layer-card[data-id="' + id + '"] input[type=range]'); s.value = val; s.dispatchEvent(new Event('input', {bubbles: true})); }, [id, val]);
}
const slider = (p, id) => p.evaluate((id) => +document.querySelector('.layer-card[data-id="' + id + '"] input[type=range]').value, id);

console.log('Logică pură: interpolare, codificare, validare');
{
  const {ctx, p, errs, net} = await open();
  const R = await p.evaluate(() => {
    const S = ASMR_SCENE;
    const sc = S.norm({d: 600, p: [{t: 0, v: {rain: 20, fire: 80}}, {t: 100, v: {rain: 80, fire: 0}}]});
    const enc = S.encode(sc);
    return {
      a0: S.volumesAt(sc, 0), a50: S.volumesAt(sc, 50), a100: S.volumesAt(sc, 100), a150: S.volumesAt(sc, 150),
      enc, back: S.parse('#' + enc),
      mid: S.volumesAt(S.norm({d: 600, p: [{t: 20, v: {rain: 10}}, {t: 40, v: {rain: 50}}, {t: 80, v: {}}]}), 10),
      bad1: S.norm({d: 600, p: [{t: 0, v: {}}]}), bad2: S.norm({d: 10, p: [{t: 0, v: {}}, {t: 50, v: {}}]}),
      bad3: S.parse('#scene=600:0~rain-20'), bad4: S.parse('#scene=600:0~rain-20:100~rain'), bad5: S.parse('#scene=abc'),
      dup: S.norm({d: 600, p: [{t: 5, v: {}}, {t: 5, v: {rain: 3}}, {t: 9, v: {}}]}).p.length
    };
  });
  t('punctul 0 = mixul de început', R.a0.rain === 20 && R.a0.fire === 80);
  t('50% = media liniară', R.a50.rain === 50 && R.a50.fire === 40, JSON.stringify(R.a50));
  t('100% și peste = mixul final (se ține constant)', R.a100.rain === 80 && R.a100.fire === 0 && R.a150.rain === 80);
  t('înainte de primul punct se ține valoarea primului punct', R.mid.rain === 10, JSON.stringify(R.mid));
  t('codificare compactă', R.enc === 'scene=600:0~rain-20.fire-80:100~rain-80', R.enc);
  t('parse(encode(x)) păstrează scena', R.back && R.back.d === 600 && R.back.p.length === 2 && R.back.p[1].v.rain === 80);
  t('scene nevalide respinse (1 punct, durată mică, link malformat)', !R.bad1 && !R.bad2 && !R.bad3 && !R.bad4 && !R.bad5);
  t('aceeași poziție nu se dublează', R.dup === 2, R.dup);
  t('0 erori / 0 rețea', errs.length === 0 && net() === 0, errs.join('|'));
  await ctx.close();
}

console.log('UI: puncte, rulare cu timp simulat, salvare, link');
{
  const {ctx, p, errs} = await open();
  await p.fill('#scDur', '10'); await p.dispatchEvent('#scDur', 'change');
  await setLayer(p, 'rain', 20); await setLayer(p, 'fire', 80);
  await p.fill('#scPos', '0'); await p.click('#scAdd');
  await setLayer(p, 'rain', 80); await setLayer(p, 'fire', 0);
  await p.fill('#scPos', '100'); await p.click('#scAdd');
  t('două puncte afișate', (await p.locator('#scPoints li').count()) === 2);
  await p.fill('#scPos', '100'); await setLayer(p, 'rain', 50); await p.click('#scAdd');
  t('același procent înlocuiește punctul', (await p.locator('#scPoints li').count()) === 2);
  await setLayer(p, 'rain', 80); await p.click('#scAdd');
  await p.click('#scPlay');
  t('butonul devine „Oprește scena” (aria-pressed)', (await p.getAttribute('#scPlay', 'aria-pressed')) === 'true');
  const t0 = await p.evaluate(() => Date.now());
  await p.evaluate((t0) => { ASMR_SCENE.setT0(t0); ASMR_SCENE.tick(t0 + 300000); }, t0);   // 5 min din 10 = 50%
  t('la 50% ploaia = 50 și focul = 40', (await slider(p, 'rain')) === 50 && (await slider(p, 'fire')) === 40, (await slider(p, 'rain')) + '/' + (await slider(p, 'fire')));
  await p.evaluate((t0) => ASMR_SCENE.tick(t0 + 700000), t0);
  t('după durată: mix final și scena se oprește', (await slider(p, 'rain')) === 80 && (await slider(p, 'fire')) === 0 && (await p.getAttribute('#scPlay', 'aria-pressed')) === 'false');
  // salvare
  await p.fill('#scName', 'Seară'); await p.click('#scSave');
  t('scena salvată în localStorage', await p.evaluate(() => JSON.parse(localStorage.getItem('asmr_ff_scenes') || '[]').some((x) => x.name === 'Seară' && x.p.length === 2)));
  t('scena apare ca buton', (await p.locator('#scSaved .chip', {hasText: 'Seară'}).count()) === 1);
  // link
  await p.click('#scLink');
  const link = await p.inputValue('#mixLink').catch(() => '');
  t('linkul conține #scene=', /#scene=600:0~rain-20\.fire-80:100~rain-80$/.test(link), link);
  t('buton QR deschide dialog cu SVG', await (async () => { await p.click('#scQr'); const ok1 = (await p.locator('dialog.r8-dlg svg').count()) === 1; await p.keyboard.press('Escape'); return ok1; })());
  t('0 erori', errs.length === 0, errs.join('|'));
  await ctx.close();
}

console.log('Scenă din link și golire');
{
  const {ctx, p, errs} = await open('#scene=1200:0~rain-10:50~rain-60.fire-30:100~');
  t('buton „Scenă din link” prezent, nimic nu pornește singur', (await p.locator('#scLinkWrap .chip').count()) === 1 && (await slider(p, 'rain')) === 0);
  await p.click('#scLinkWrap .chip');
  t('încărcată: 3 puncte, 20 min', (await p.locator('#scPoints li').count()) === 3 && (await p.inputValue('#scDur')) === '20');
  await p.click('#scClear');
  t('golire', (await p.locator('#scPoints li button').count()) === 0);
  await p.click('#scPlay');
  t('fără puncte: nu pornește, mesaj', (await p.getAttribute('#scPlay', 'aria-pressed')) === 'false' && (await p.textContent('#scMsg')).length > 5);
  await p.selectOption('#langSelect', 'en');
  t('i18n EN', /Timed sound scenes/.test(await p.textContent('#scenePanel h2')));
  t('0 erori', errs.length === 0, errs.join('|'));
  await ctx.close();
}
await b.close();
console.log(`\n${ok} reușite, ${bad} eșuate`); process.exit(bad ? 1 : 0);
