const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const context = vm.createContext({ window: {} });
for (const file of ['translations.js', 'studio-copy.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { filename: file });
}
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
assert.ok(html.includes('studio-copy.js?v=20260913-offers'), 'Updated translations need a cache version');
const sources = [
  'Kit de trabajo con IA',
  'Mapa del proceso, prompts y plantillas con revisión humana. Es un kit de uso manual; las integraciones y la ejecución automática se cotizan por separado.',
  'Un flujo concreto con una función central: formulario, dashboard o micro-app. El alcance, los usuarios y las integraciones se acuerdan antes de cotizar.'
];
const locales = ['en', 'de', 'fr', 'pt', 'it', 'ru', 'cs', 'zh', 'ja', 'he', 'ar'];
for (const source of sources) {
  assert.ok(html.includes(source), `Source missing from HTML: ${source}`);
  for (const locale of locales) {
    const translated = context.window.NEXO_TRANSLATIONS[locale][source];
    assert.equal(typeof translated, 'string', `${locale}: missing translation`);
    assert.ok(translated.trim().length > 0, `${locale}: empty translation`);
    assert.notEqual(translated, source, `${locale}: Spanish fallback`);
  }
}
assert.ok(!html.includes('<h3>Automatizacion IA</h3>'), 'Manual kit must not be titled as automatic integration');
for (const amount of [150, 350, 600, 120]) {
  assert.ok(html.includes(`Desde $${amount}</span>`), `Existing price changed: ${amount}`);
}
console.log('Offer copy: 3 Spanish sources, 33 translations and 4 unchanged prices verified.');
