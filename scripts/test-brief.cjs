const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '../products/brief-kit');
const model = require(path.join(root, 'brief-model.js'));
const sample = JSON.parse(fs.readFileSync(path.join(root, 'example.json'), 'utf8'));
// Read declarations only, without a browser or any DOM/UI execution.
const source = fs.readFileSync(path.join(root, 'brief.js'), 'utf8');
const declarations = source.slice(0, source.indexOf('const form='));
const context = {};
vm.createContext(context);
vm.runInContext(declarations + ';this.definitions=sections.flatMap(s=>s.fields);this.copy=translations;', context);
const defs = context.definitions;
assert.equal(defs.filter(d => d[4]).length, 6);
assert.deepEqual(model.validate(sample, defs).fields, sample.fields);
assert.equal(model.validate({...sample,language:'en'}, defs).language, 'en');
assert.equal(model.validate({...sample,language:'unknown'}, defs).language, 'es');
assert.equal(Object.keys(model.validate({...sample,fields:{}}, defs).fields).length, defs.length);
for (const patch of [{version:2},{format:'other'},{fields:[]},{fields:null}]) {
  assert.throws(() => model.validate({...sample,...patch}, defs));
}
for (const fields of [{name:null},{name:123},{name:'a'.repeat(201)},{problem:'a'.repeat(5001)},
  {type:'invented'},{date:'2026-02-30'},{date:'2026-02-29'},{date:'0000-01-01'},{date:'not a date'}]) {
  assert.throws(() => model.validate({...sample,fields:{...sample.fields,...fields}}, defs));
}
assert.equal(model.validate({...sample,fields:{...sample.fields,date:'2028-02-29'}}, defs).fields.date,'2028-02-29');
const extra = model.validate({...sample,fields:{...sample.fields,unknown:'ignored'}},defs);
assert.ok(!Object.hasOwn(extra.fields,'unknown'));
const inherited = model.validate({...sample,fields:Object.create({name:'inherited'})}, defs);
assert.equal(inherited.fields.name,'');
assert.deepEqual(Object.keys(context.copy.es).sort(), Object.keys(context.copy.en).sort());
assert.equal(context.copy.es.typeOptions.length, model.types.length);
const html = fs.readFileSync(path.join(root,'index.html'),'utf8');
for (const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
  assert.ok(!/^https?:/.test(match[1]), 'No remote dependencies');
  assert.ok(fs.existsSync(path.join(root,match[1])), 'Local asset exists: '+match[1]);
}
assert.ok(!/\bfetch\s*\(|XMLHttpRequest|sendBeacon|\.innerHTML\s*=|eval\s*\(/.test(source));
console.log('PASS: schema, field limits, real calendar dates, sample, language parity and local assets. No UI test is implied.');
