const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname,'..');
const main = fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const id of ['medstock','volia','volia-control']){
  assert.ok(main.includes(`href="demos/${id}/"`),id+' portfolio link');
  const dir=path.join(root,'demos',id),html=fs.readFileSync(path.join(dir,'index.html'),'utf8');
  assert.match(html,/DEMO/);
  assert.match(html,/noindex/);
  for(const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)){
    const url=match[1];if(/^(https?:|mailto:|data:)/.test(url))continue;
    assert.ok(fs.existsSync(path.resolve(dir,url.split(/[?#]/)[0])),`${id}: missing ${url}`);
  }
  assert.ok(!/1793206800001|593983323436|voliasas@hotmail/.test(html),'Private corporate details');
}
const med=fs.readFileSync(path.join(root,'demos/medstock/app.js'),'utf8');
assert.ok(!med.includes('localStorage'));
assert.ok(med.includes('nexo-demo-medstock-v1'));
assert.ok(med.includes('escapeHtml(product.name)'));
const volia=fs.readFileSync(path.join(root,'demos/volia/demo.js'),'utf8');
assert.ok(!/fetch\(|window.open/.test(volia));
assert.ok(main.includes('https://inner-oraculum.vercel.app/'));
console.log('PASS: demo links, assets, privacy boundaries and session-only sample storage.');
