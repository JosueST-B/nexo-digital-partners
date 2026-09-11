const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

async function main() {
  const root = path.resolve(__dirname, '..');
  const output = path.join(root, 'verification');
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  const context = await browser.newContext();
  const errors = [];
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  const url = process.env.NEXO_TEST_URL || pathToFileURL(path.join(root, 'index.html')).href;
  try {
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const missing = await page.evaluate(() => {
      const keys = new Set();
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (node.parentElement.closest('script,style,[translate="no"],[aria-hidden="true"]')) continue;
        const key = (originalText.get(node) || node.textContent).replace(/\s+/g, ' ').trim();
        if (key && !/^(\$|WhatsApp:|josuepug@|Idioma \/ Language)/.test(key)) keys.add(key);
      }
      return Object.fromEntries(Object.entries(window.NEXO_TRANSLATIONS).filter(([lang]) => lang !== 'es').map(([lang, dictionary]) => [lang, [...keys].filter(key => !dictionary[key])]).filter(([, values]) => values.length));
    });
    console.log('TRANSLATION_GAPS', JSON.stringify(missing));
    assert.equal(Object.keys(missing).length, 0, 'All visible copy must have translations');
    const badAnchors = await page.locator('a[href^="#"]').evaluateAll(links => links.map(a => a.getAttribute('href')).filter(href => !document.getElementById(href.slice(1))));
    assert.deepEqual(badAnchors, []);
    for (const width of [1440, 768, 390, 320]) {
      await page.setViewportSize({ width, height: width > 900 ? 960 : 844 });
      for (const lang of ['es','en','de','fr','pt','it','ru','cs','zh','ja','he','ar']) {
        await page.selectOption('#language-select', lang);
        assert.equal(await page.locator('html').getAttribute('lang'), lang);
        assert.equal(await page.locator('html').getAttribute('dir'), ['he','ar'].includes(lang) ? 'rtl' : 'ltr');
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
        assert.equal(overflow, false, `Horizontal overflow: ${lang} at ${width}`);
      }
    }
    await page.selectOption('#language-select','es');
    await page.setViewportSize({ width: 1440, height: 960 });
    await page.screenshot({ path: path.join(output,'desktop.png') });
    await page.locator('#casos').evaluate(e => e.scrollIntoView({ block:'start', behavior:'instant' }));
    await page.locator('.portfolio-card img').evaluateAll(async images => {
      await Promise.all(images.slice(0,2).map(img => img.decode()));
    });
    await page.screenshot({ path: path.join(output,'projects.png') });
    assert.equal(await page.locator('.portfolio-card:visible').count(), 5);
    await page.locator('[data-filter="ops"]').click();
    assert.equal(await page.locator('.portfolio-card:visible').count(), 1);
    assert.equal(await page.locator('[data-filter="ops"]').getAttribute('aria-pressed'), 'true');
    await page.locator('[data-preview="medstock"]').click();
    assert.equal(await page.locator('#project-dialog').isVisible(), true);
    assert.equal(await page.locator('#preview-title').innerText(),'MedStock');
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#project-dialog').isVisible(), false);
    assert.equal(await page.locator('[data-preview="medstock"]').evaluate(e => e === document.activeElement), true);
    await page.locator('[data-filter="all"]').click();
    const images = await page.locator('.portfolio-card img').evaluateAll(images => images.filter(img => !img.complete || img.naturalWidth === 0).map(img => img.src));
    assert.deepEqual(images,[]);
    await page.locator('.pricing-grid [data-project="automation"]').click();
    assert.equal(await page.locator('[name="project"]').inputValue(),'automation');
    await page.locator('[name="name"]').fill('Prueba <script> & Nexo');
    await page.locator('[name="contact"]').fill('test@example.com');
    await page.locator('[name="message"]').fill('Un formulario con A&B, español y 日本語.');
    const pageCount = context.pages().length;
    await page.locator('button[type="submit"]').click();
    assert.equal(context.pages().length,pageCount,'Preparing must not send or open another tab');
    assert.equal(await page.locator('#request-result').isVisible(),true);
    const whatsapp = new URL(await page.locator('#whatsapp-result').getAttribute('href'));
    assert.equal(whatsapp.hostname,'wa.me');
    assert.equal(whatsapp.pathname,'/593987411592');
    assert.match(whatsapp.searchParams.get('text'), /Prueba <script> & Nexo/);
    assert.match(whatsapp.searchParams.get('text'), /Un formulario con A&B, español y 日本語\./);
    assert.match(await page.locator('#email-result').getAttribute('href'), /^mailto:josuepug@gmail.com\?/);
    await page.selectOption('#language-select','en');
    assert.match(new URL(await page.locator('#whatsapp-result').getAttribute('href')).searchParams.get('text'), /Hello Nexo/);
    await page.locator('[name="message"]').fill('Changed request');
    assert.equal(await page.locator('#request-result').isVisible(),false);
    await page.selectOption('#language-select','es');
    await page.locator('#contacto').scrollIntoViewIfNeeded();
    await page.screenshot({ path:path.join(output,'contact.png') });
    await page.setViewportSize({ width:390,height:844 });
    await page.evaluate(() => scrollTo({ top:0,behavior:'instant' }));
    await page.screenshot({ path:path.join(output,'mobile.png') });
    await page.locator('#menu-button').click();
    assert.equal(await page.locator('#menu-button').getAttribute('aria-expanded'),'true');
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#menu-button').getAttribute('aria-expanded'),'false');
    await page.selectOption('#language-select','de');
    await page.reload();
    assert.equal(await page.locator('html').getAttribute('lang'),'de');
    assert.deepEqual(errors,[]);
    const noStorage = await browser.newContext();
    await noStorage.addInitScript(() => Object.defineProperty(window,'localStorage',{ get() { throw new Error('Storage denied'); } }));
    const privatePage = await noStorage.newPage();
    const privateErrors=[];
    privatePage.on('pageerror',e=>privateErrors.push(e.message));
    await privatePage.goto(url,{ waitUntil:'load' });
    await privatePage.selectOption('#language-select','en');
    assert.equal(await privatePage.locator('html').getAttribute('lang'),'en');
    assert.deepEqual(privateErrors,[]);
    await noStorage.close();
    console.log('PASS: 48 language/viewport combinations, image previews, filters, scope selection, form URLs, no automatic sending, persistence, blocked storage, mobile navigation.');
  } finally { await browser.close(); }
}
main().catch(error => { console.error(error); process.exitCode=1; });
