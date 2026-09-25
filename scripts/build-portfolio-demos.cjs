const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const workspace = path.dirname(root);
const { load } = require(path.join(workspace, 'inner-oraculum-sitio-web/node_modules/cheerio'));
const banner = '<aside class="demo-notice"><a href="../../#casos">Nexo / Proyectos</a><strong>DEMOSTRACION</strong><span>Datos ficticios. Sin pedidos ni pagos reales. No introduzcas datos personales.</span></aside>';
const noticeCss = '.demo-notice{position:relative;z-index:10000;display:flex;flex-wrap:wrap;gap:12px;align-items:center;padding:14px 20px;background:#e6f5ef;color:#163f31;font:14px/1.5 Arial,sans-serif;border-bottom:1px solid #91c6af}.demo-notice a{color:inherit}.demo-notice strong{letter-spacing:0}.demo-notice span{flex:1;min-width:190px}';
function output(name, $) {
  const dir = path.join(root, 'demos', name);
  fs.mkdirSync(dir, { recursive:true });
  $('head').append('<meta name="robots" content="noindex"><style>'+noticeCss+'</style>');
  $('body').prepend(banner);
  fs.writeFileSync(path.join(dir,'index.html'), $.html());
  return dir;
}
const med = path.join(workspace, 'insumos-medicos-inventario');
const $med = load(fs.readFileSync(path.join(med, 'index.html'),'utf8'));
$med('title').text('MedStock | Demo interactiva');
$med('#import-data').closest('label').remove();
$med('.ideas-grid').closest('section').remove();
$med('head').append('<style>.view,.panel,.table-wrap{min-width:0;max-width:100%}.table-wrap{overflow:auto}.app-shell{min-width:0}#customer-document{display:none}label:has(#customer-document){display:none}</style>');
$med('#customer-name').val('Cliente ficticio').attr('readonly','readonly');
$med('#customer-document').val('DEMO').attr('readonly','readonly');
$med('.top-actions').append('<button class="ghost-button" id="reset-demo">Reiniciar demo</button>');
const medDir = output('medstock', $med);
fs.copyFileSync(path.join(med,'styles.css'),path.join(medDir,'styles.css'));
let medJs = fs.readFileSync(path.join(med,'app.js'),'utf8');
medJs = medJs.replace('"medstock-data-v1"','"nexo-demo-medstock-v1"').replaceAll('localStorage','sessionStorage');
medJs = medJs.replace('$("#import-data").addEventListener("change", importData);','$("#reset-demo").addEventListener("click", () => { sessionStorage.removeItem(STORAGE_KEY); location.reload(); });');
medJs = medJs.replace('Comprobante de venta de insumos medicos','DEMO - Documento ficticio, sin validez comercial');
medJs = 'function escapeHtml(value){return String(value ?? "").replace(/[&<>"\u0027]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",\'"\':"&quot;", "\u0027":"&#39;"}[c]));}\n' + medJs;
for (const expr of ['product.name','product.lot','product.category','product.location','product.expiry','product.provider || "Sin proveedor"','product.barcode || "Sin codigo"','item.name','item.lot','sale.customer || "Consumidor final"','sale.document || "N/A"']) {
  medJs = medJs.replaceAll('${'+expr+'}', '${escapeHtml('+expr+')}');
}
fs.writeFileSync(path.join(medDir,'app.js'),medJs);
const volia = path.join(workspace,'volia-sitio-web');
const $v = load(fs.readFileSync(path.join(volia,'index.html'),'utf8'));
$v('title').text('Volia | Demo de sitio comercial');
$v('script, iframe, .company-grid, .location-panel, .qr-card, .floating-whatsapp').remove();
$v('footer span').text('Demostracion de sitio comercial. Sin pedidos reales.');
$v('head').append('<style>#demo-contact{max-width:700px;margin:auto;padding:30px 0}#demo-contact form{display:grid;gap:20px}#demo-contact select{display:block;padding:12px;width:100%;margin-top:12px;border:1px solid #ccc;border-radius:4px;font:inherit}#demo-contact button{padding:14px 22px;background:white;color:#18395b;border:0;border-radius:4px;font:inherit;cursor:pointer}</style>');
$v('a').each((_, el) => {
  const link = $v(el), href = link.attr('href') || '';
  if (/^(https?:|mailto:|tel:)/.test(href) || href.endsWith('.pdf')) {
    link.attr('href','#demo-contact').removeAttr('target');
  }
});
$v('[data-link]').each((_,el)=>{ if(!($v(el).attr('data-link')||'').startsWith('#')) $v(el).attr('data-link','#demo-contact'); });
$v('form').each((_,el)=>{
  $v(el).find('input,textarea').removeAttr('required').removeAttr('value');
  $v(el).append('<p class="demo-result" role="status"></p>');
});
// Only the presentation sections are included; corporate records and contact data stay local.
$v('#contacto').empty().append('<div id="demo-contact"><h2>Solicitud de demostracion</h2><form><label>Tipo de consulta <select><option>Catalogo</option><option>Disponibilidad</option></select></label><button type="submit">Simular solicitud</button><p class="demo-result" role="status"></p></form></div>');
$v('body').append('<script src="demo.js"></script>');
const voliaDir = output('volia',$v);
fs.copyFileSync(path.join(volia,'styles.css'),path.join(voliaDir,'styles.css'));
const assets = new Set();
$v('img[src]').each((_,el)=>{const src=$v(el).attr('src');if(src.startsWith('assets/')&&!src.includes('qr-'))assets.add(src);else $v(el).remove();});
for(const src of assets){const dst=path.join(voliaDir,src);fs.mkdirSync(path.dirname(dst),{recursive:true});fs.copyFileSync(path.join(volia,src),dst);}
// Re-serialize after the image allowlist has been applied.
fs.writeFileSync(path.join(voliaDir,'index.html'),$v.html());
fs.writeFileSync(path.join(voliaDir,'demo.js'), `document.querySelectorAll('form').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();form.querySelector('.demo-result').textContent='Solicitud simulada. No se ha enviado ningun mensaje.';}));document.querySelector('#menu-button')?.addEventListener('click',()=>document.querySelector('#site-nav').classList.toggle('open'));document.querySelectorAll('[data-link]').forEach(el=>el.addEventListener('click',()=>{location.hash=el.dataset.link;}));`);
console.log('Built MedStock and Volia demos from local source, without backend or real submissions.');
