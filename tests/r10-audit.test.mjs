// Teste r10 pentru ASMR 1.2.5: linkuri #mix= ostile (chei moștenite din Object nu trec validarea).
// Rulare: node tests/r10-audit.test.mjs   (Playwright din /opt/node-tools; rețea externă blocată)
import {createRequire} from 'module';
import path from 'path';
import {fileURLToPath} from 'url';
const require = createRequire('/opt/node-tools/package.json');
const {chromium} = require('playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const FILE = 'file://' + path.resolve(here, '..', 'index.html');
let ok = 0, bad = 0;
function t(name, cond, extra) { if (cond) { ok++; console.log('  ok  ' + name); } else { bad++; console.log('  FAIL ' + name + (extra ? ' :: ' + JSON.stringify(extra) : '')); } }
const b = await chromium.launch({executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox']});
async function open(hash) {
  const ctx = await b.newContext({viewport: {width: 390, height: 800}});
  await ctx.route(/^https?:/, (r) => r.abort());
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(FILE + hash); await p.waitForTimeout(1500);
  return {ctx, p, errs};
}
async function apply(p) {
  const has = await p.evaluate(() => !!document.querySelector('#linkMixWrap button'));
  if (has) { await p.evaluate(() => document.querySelector('#linkMixWrap button').click()); await p.waitForTimeout(600); }
  return has;
}
for (const h of ['#mix=rain~50&b=toString', '#mix=rain~50&b=constructor', '#mix=hasOwnProperty~9&b=valueOf']) {
  const {ctx, p, errs} = await open(h);
  await apply(p);
  t(h + ': fără erori la aplicare', errs.length === 0, errs);
  t(h + ': banda binaurală rămâne validă', await p.evaluate(() => ['delta', 'theta', 'alpha', 'beta'].includes(document.getElementById('binauralBand').value)));
  await ctx.close();
}
{
  const {ctx, p} = await open('#mix=constructor~50.__proto__~5');
  t('#mix= doar cu chei moștenite: nu apare butonul „Redă mixul”', (await apply(p)) === false);
  await ctx.close();
}
{
  const {ctx, p, errs} = await open('#mix=rain~50&b=alpha');
  t('#mix= valid: butonul apare, stratul și banda se aplică', (await apply(p)) === true && await p.evaluate(() => document.querySelector('.layer-card[data-id="rain"] input[type=range]').value === '50' && document.getElementById('binauralBand').value === 'alpha') && errs.length === 0, errs);
  await ctx.close();
}
await b.close();
console.log('\n' + ok + ' reușite, ' + bad + ' eșuate'); process.exit(bad ? 1 : 0);
