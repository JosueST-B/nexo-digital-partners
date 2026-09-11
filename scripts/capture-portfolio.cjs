const { chromium } = require('playwright');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

async function main() {
  const root = path.resolve(__dirname, '..');
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1 });
  try {
    for (const [name, location] of [
      ['medstock', '../insumos-medicos-inventario/index.html'],
      ['volia', '../volia-sitio-web/index.html'],
      ['inner-oraculum', '../inner-oraculum-sitio-web/index.html'],
      ['scriptorium', 'https://josuest-b.github.io/scriptorium-language-studio/'],
      ['psyche-lab', 'https://josuest-b.github.io/psyche-lab-sitio-web/']
    ]) {
      const page = await context.newPage();
      const url = location.startsWith('https:') ? location : pathToFileURL(path.resolve(root, location)).href;
      const response = await page.goto(url, { waitUntil: 'networkidle' });
      if (response && !response.ok()) throw new Error(`${name}: HTTP ${response.status()}`);
      await page.evaluate(() => document.fonts.ready);
      if (name === 'inner-oraculum') await page.locator('#preloader').waitFor({ state: 'hidden', timeout: 10000 });
      await page.screenshot({ path: path.join(root, 'assets/portfolio', `${name}-screen.png`) });
      console.log(JSON.stringify({ name, title: await page.title(), source: location, image: `${name}-screen.png` }));
      await page.close();
    }
  } finally {
    await browser.close();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
