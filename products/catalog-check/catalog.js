'use strict';
const copy={
  es:{local:'Datos locales',edition:'CATÁLOGOS / CONTROL DE DATOS',title:'Revisión de catálogo',guide:'Especificación',source:'Archivo de origen',sample:'Ejemplo ficticio',upload:'Abrir CSV',noFile:'Ningún archivo seleccionado',limits:'CSV UTF-8 · Hasta 2 MB y 5.000 registros · Sin datos personales',separator:'Separador CSV',auto:'Automático',comma:'Coma',semicolon:'Punto y coma',tab:'Tabulador',decimal:'Separador decimal',rule:'Sin separadores de miles. Los SKU duplicados se apartan en su totalidad.',review:'Revisar catálogo',results:'Resultados',total:'Registros',valid:'Válidos',invalid:'Por revisar',normalized:'Normalizados',search:'Buscar SKU o producto',state:'Estado',all:'Todos',report:'Informe CSV',export:'CSV válido',record:'Registro',name:'Producto',price:'Precio',stock:'Existencias',category:'Categoría',sku:'SKU',detail:'Detalle',exportNote:'La salida incluye solo los registros válidos, con precios decimales en punto. El informe conserva todos los registros y sus incidencias.',contact:'Consultar una integración',choose:'Seleccionar columna',ready:'Archivo leído. Confirma las columnas y el separador decimal.',reviewed:'Revisión terminada. El archivo original no se ha modificado.',downloaded:'Archivo preparado para descargar.',loading:'Leyendo archivo…',noResults:'No hay registros que coincidan.',page:'Página',of:'de',original:'Original',output:'Salida normalizada',correct:'Sin incidencias',changed:'Con ajustes de formato',close:'Cerrar',prev:'Anterior',next:'Siguiente',detailsOf:'Detalle del registro',
  errors:{empty:'El CSV necesita una cabecera y al menos un registro.',size:'El archivo supera el límite de 2 MB.',encoding:'El archivo no es texto UTF-8 válido.',delimiter:'Separador no admitido.',parse:'No se pudo leer el CSV. Revisa el separador y las comillas.',rows:'El CSV supera los 5.000 registros.',columns:'Se necesitan entre 2 y 60 columnas, con cabeceras de hasta 200 caracteres.',mapping:'Asigna las cinco columnas sin repetir ninguna.',decimal:'Separador decimal no admitido.',file:'No se pudo leer el archivo. Elige un CSV UTF-8.'},
  issues:{width:'Cantidad de columnas distinta de la cabecera',length:'Campo de más de 500 caracteres',sku:'Falta el SKU',name:'Falta el nombre',formula:'Texto con inicio de fórmula o caracteres de control',price:'Precio inválido: hasta 9 enteros y 2 decimales, sin miles',stock:'Existencias inválidas: entero no negativo de hasta 9 cifras',duplicate:'SKU duplicado (sin distinguir mayúsculas)'}},
  en:{local:'Local data',edition:'CATALOGS / DATA QUALITY',title:'Catalog review',guide:'Specification',source:'Source file',sample:'Fictional sample',upload:'Open CSV',noFile:'No file selected',limits:'UTF-8 CSV · Up to 2 MB and 5,000 records · No personal data',separator:'CSV separator',auto:'Automatic',comma:'Comma',semicolon:'Semicolon',tab:'Tab',decimal:'Decimal separator',rule:'No thousands separators. Every occurrence of a duplicate SKU is set aside.',review:'Review catalog',results:'Results',total:'Records',valid:'Valid',invalid:'Needs review',normalized:'Normalized',search:'Search SKU or product',state:'Status',all:'All',report:'CSV report',export:'Valid CSV',record:'Record',name:'Product',price:'Price',stock:'Stock',category:'Category',sku:'SKU',detail:'Details',exportNote:'The output includes valid records only, with a decimal point in prices. The report keeps every record and its issues.',contact:'Discuss an integration',choose:'Select a column',ready:'File read. Confirm the columns and decimal separator.',reviewed:'Review complete. The original file has not been changed.',downloaded:'File prepared for download.',loading:'Reading file…',noResults:'No matching records.',page:'Page',of:'of',original:'Original',output:'Normalized output',correct:'No issues',changed:'Formatting adjusted',close:'Close',prev:'Previous',next:'Next',detailsOf:'Record details',
  errors:{empty:'The CSV needs a header and at least one record.',size:'The file exceeds 2 MB.',encoding:'The file is not valid UTF-8 text.',delimiter:'Unsupported separator.',parse:'Could not parse CSV. Check the separator and quotes.',rows:'The CSV exceeds 5,000 records.',columns:'Use 2 to 60 columns, with headers of up to 200 characters.',mapping:'Assign all five columns without reusing any.',decimal:'Unsupported decimal separator.',file:'Could not read the file. Select a UTF-8 CSV.'},
  issues:{width:'Column count differs from the header',length:'A field exceeds 500 characters',sku:'Missing SKU',name:'Missing product name',formula:'Formula-like text or control characters',price:'Invalid price: up to 9 integer digits and 2 decimals, no thousands',stock:'Invalid stock: nonnegative integer of up to 9 digits',duplicate:'Duplicate SKU (case insensitive)'}}
};
const $=id=>document.getElementById(id);
let language='es', raw='', source=null, items=null, page=0, detailItem=null, sequence=0;
const M=window.CatalogCheck;
const t=()=>copy[language];
const node=(tag,text,className)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(className)e.className=className;return e;};
function icons(){window.lucide?.createIcons();}
function error(code){$('error').textContent=t().errors[code]||t().errors.file;$('error').hidden=false;$('status').textContent='';}
function clearResults(){items=null;page=0;$('results').hidden=true;$('status').textContent='';}
function mapping(){return Object.fromEntries(M.fields.map(f=>[f,Number($('map-'+f)?.value??-1)]));}
function columns(selected=M.suggest(source.headers)) {
  $('columns').replaceChildren();
  for(const f of M.fields){const label=node('label');label.append(node('span',t()[f]));const select=node('select');select.id='map-'+f;select.append(new Option(t().choose,'-1'));source.headers.forEach((h,i)=>select.append(new Option(`${i+1}. ${h||'—'}`,String(i))));select.value=String(selected[f]);select.addEventListener('change',clearResults);label.append(select);$('columns').append(label);}
}
function parseCurrent(){
  clearResults();source=null;$('columns').replaceChildren();$('mapping').hidden=false;$('review').disabled=true;$('error').hidden=true;
  try{source=M.read(raw,$('delimiter').value==='tab'?'\t':$('delimiter').value);columns();$('review').disabled=false;$('status').textContent=t().ready;}
  catch(e){error(e.message);}
}
function setSource(text,name){raw=text;$('file-name').textContent=name;parseCurrent();}
function applyLanguage(){
  document.documentElement.lang=language;
  document.querySelectorAll('[data-t]').forEach(e=>{if(e.id!=='file-name'||!raw)e.textContent=t()[e.dataset.t];});
  document.querySelectorAll('[data-ph]').forEach(e=>e.placeholder=t()[e.dataset.ph]);
  for(const id of ['close','prev','next']){$(id).ariaLabel=t()[id];$(id).title=t()[id];}
  if(source)columns(mapping());
  if(items)render();
  if(detailItem&&$('detail').open)showDetail(detailItem,false);
  $('error').hidden=true;$('status').textContent=items?t().reviewed:(source?t().ready:'');
}
function showDetail(item,open=true){
  detailItem=item;$('detail-title').textContent=`${t().detailsOf} ${item.record}`;
  $('detail-issues').textContent=item.issues.length?item.issues.map(x=>t().issues[x]).join(' · '):t().correct;
  $('detail-fields').replaceChildren();
  for(const f of M.fields){$('detail-fields').append(node('dt',t()[f]));const dd=node('dd');dd.append(node('small',t().original),node('span',item.original[f]||'—'),node('small',t().output),node('span',item.values[f]||'—'));$('detail-fields').append(dd);}
  if(open)$('detail').showModal();
}
function render(){
  if(!items)return;
  const good=items.filter(i=>!i.issues.length).length;
  $('total').textContent=items.length;$('valid').textContent=good;$('invalid').textContent=items.length-good;$('normalized').textContent=items.filter(i=>i.changed).length;$('export').disabled=!good;
  const q=$('search').value.trim().toLocaleLowerCase();const state=$('filter').value;
  const filtered=items.filter(i=>(state==='all'||(state==='valid'?!i.issues.length:i.issues.length))&&(!q||`${i.values.sku} ${i.values.name}`.toLocaleLowerCase().includes(q)));
  const pages=Math.max(1,Math.ceil(filtered.length/50));page=Math.min(page,pages-1);$('rows').replaceChildren();
  for(const item of filtered.slice(page*50,page*50+50)){
    const row=node('tr');for(const value of [item.record,item.values.sku,item.values.name,item.values.price,item.values.stock])row.append(node('td',String(value)));
    const stateCell=node('td');stateCell.append(node('span',item.issues.length?t().invalid:t().valid,'state'+(item.issues.length?' bad':'')));if(item.issues.length)stateCell.append(node('small',t().issues[item.issues[0]]));row.append(stateCell);
    const action=node('td');const button=node('button',undefined,'icon');button.type='button';button.ariaLabel=`${t().detailsOf} ${item.record}`;button.title=button.ariaLabel;const icon=node('i');icon.dataset.lucide='scan-line';button.append(icon);button.addEventListener('click',()=>showDetail(item));action.append(button);row.append(action);$('rows').append(row);
  }
  if(!filtered.length){const row=node('tr');const cell=node('td',t().noResults);cell.colSpan=7;row.append(cell);$('rows').append(row);}
  $('page-label').textContent=`${t().page} ${page+1} ${t().of} ${pages} · ${filtered.length} ${t().total.toLowerCase()}`;$('prev').disabled=page===0;$('next').disabled=page>=pages-1;$('results').hidden=false;icons();
}
function download(text,name){const url=URL.createObjectURL(new Blob(['\ufeff',text],{type:'text/csv;charset=utf-8'}));const a=node('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);$('status').textContent=t().downloaded;}
$('language').addEventListener('change',()=>{language=$('language').value;applyLanguage();});
$('upload').addEventListener('click',()=>$('file').click());
$('file').addEventListener('change',async()=>{
  const file=$('file').files[0];if(!file)return;const ticket=++sequence;$('file').value='';
  if(file.size>2*1024*1024){error('size');return;}
  $('upload').disabled=true;$('sample').disabled=true;$('status').textContent=t().loading;
  try{const text=new TextDecoder('utf-8',{fatal:true}).decode(await file.arrayBuffer());if(ticket===sequence)setSource(text,file.name);}
  catch{error('encoding');}
  finally{if(ticket===sequence){$('upload').disabled=false;$('sample').disabled=false;}}
});
$('sample').addEventListener('click',()=>{$('delimiter').value='';$('decimal').value='.';setSource(M.sample,'nexo-catalog-ejemplo.csv');});
$('delimiter').addEventListener('change',()=>{if(raw)parseCurrent();});$('decimal').addEventListener('change',clearResults);
$('review').addEventListener('click',()=>{if(!source)return;clearResults();$('error').hidden=true;try{items=M.review(source,mapping(),$('decimal').value);$('search').value='';$('filter').value='all';render();$('status').textContent=t().reviewed;}catch(e){error(e.message);}});
for(const id of ['filter','search'])$(id).addEventListener(id==='search'?'input':'change',()=>{page=0;render();});
$('prev').addEventListener('click',()=>{page=Math.max(0,page-1);render();});$('next').addEventListener('click',()=>{page++;render();});
$('export').addEventListener('click',()=>{if(items?.some(i=>!i.issues.length))download(M.output(items),'nexo-catalog-validos.csv');});
$('report').addEventListener('click',()=>{if(items)download(M.report(items),'nexo-catalog-informe.csv');});
$('close').addEventListener('click',()=>$('detail').close());$('detail').addEventListener('close',()=>{detailItem=null;});
applyLanguage();icons();
