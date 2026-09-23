const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
assert.equal((html.match(/class="portfolio-card"/g) || []).length, 8);
assert.ok(html.indexOf('portfolio-copy.js?') < html.indexOf('src="script.js'));
assert.ok(!html.includes('josuest-b.github.io'), 'Current public links must use the new account');
for (const id of ['volia-control', 'psicocalc', 'formcraft', 'scriptorium', 'psyche-lab']) {
  const filename = `assets/portfolio/${id}-20260923.jpg`;
  assert.ok(html.includes(filename), `Missing current capture: ${id}`);
  const image = fs.readFileSync(path.join(root, filename));
  assert.equal(image.subarray(0, 3).toString('hex'), 'ffd8ff');
  assert.ok(image.length > 10000, 'Capture must contain real image data');
}
assert.ok(html.includes('Ejemplo ficticio; no acredita validación clínica.'));
assert.ok(html.includes('El envío real requiere configurar un servicio.'));
assert.ok(html.includes('Captura sin registros privados.'));
console.log('PASS: eight portfolio entries, current captures, links, copy loading and scope disclaimers.');
