(function(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./vendor/papaparse.min.js'));
  else root.CatalogCheck = factory(root.Papa);
})(typeof globalThis !== 'undefined' ? globalThis : this, function(Papa) {
  'use strict';
  const fields = ['sku', 'name', 'category', 'price', 'stock'];
  const aliases = {sku:['sku','codigo','code'],name:['nombre','producto','name','product'],category:['categoria','category'],price:['precio','price'],stock:['stock','existencias','cantidad','quantity']};
  const sample = 'sku,nombre,categoria,precio,stock\n A001 ,Cuaderno,Aula,12.50,18\nA002,Lampara,Oficina,35.90,4\nA003,Carpeta,Aula,,8\nA001,Cuaderno extra,Aula,12.50,3\nA004,Muestra,Oficina,0,0\nA005,Archivador,Oficina,18.50,-2\nA006,"Caja, edicion especial",Almacen,22.00,7\nA007,=1+1,Almacen,9.00,2';
  function fail(code) { throw new Error(code); }
  function read(text, delimiter='') {
    if (typeof text !== 'string' || !text.trim()) fail('empty');
    if (text.length > 2*1024*1024) fail('size');
    if (text.includes('\u0000') || text.includes('\ufffd')) fail('encoding');
    if (!['',',',';','\t'].includes(delimiter)) fail('delimiter');
    const parsed = Papa.parse(text.replace(/^\ufeff/, ''), {delimiter, delimitersToGuess:[',',';','\t'], skipEmptyLines:'greedy', dynamicTyping:false, preview:5002});
    if (parsed.errors.length) fail('parse');
    if (parsed.data.length < 2) fail('empty');
    if (parsed.data.length > 5001 || parsed.meta.truncated) fail('rows');
    if (parsed.data[0].length < 2 || parsed.data[0].length > 60) fail('columns');
    if (parsed.data[0].some(h=>h.length>200)) fail('columns');
    return {headers:parsed.data[0], rows:parsed.data.slice(1), delimiter:parsed.meta.delimiter};
  }
  function suggest(headers) {
    const norm = headers.map(h=>h.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,''));
    return Object.fromEntries(fields.map(f=> {
      const matches=norm.map((h,i)=>aliases[f].includes(h)?i:-1).filter(i=>i>=0);
      return [f,matches.length===1?matches[0]:-1];
    }));
  }
  function review(source, mapping, decimal='.') {
    if (!['.',','].includes(decimal)) fail('decimal');
    const indexes=fields.map(f=>mapping[f]);
    if (indexes.some(i=>!Number.isInteger(i)||i<0||i>=source.headers.length)||new Set(indexes).size!==fields.length) fail('mapping');
    const result = source.rows.map((row,index)=> {
      const original=Object.fromEntries(fields.map(f=>[f,String(row[mapping[f]]??'')]));
      const values=Object.fromEntries(fields.map(f=>[f,original[f].trim().replace(/\s+/g,' ')]));
      const issues=[];
      if(row.length!==source.headers.length) issues.push('width');
      if(fields.some(f=>original[f].length>500)) issues.push('length');
      if(!values.sku) issues.push('sku');
      if(!values.name) issues.push('name');
      if(['sku','name','category'].some(f=>/^[=+\-@]/.test(values[f])||/[\x00-\x1f\x7f]/.test(original[f]))) issues.push('formula');
      const pattern = decimal==='.' ? /^\d{1,9}(?:\.\d{1,2})?$/ : /^\d{1,9}(?:,\d{1,2})?$/;
      if(!pattern.test(values.price)) issues.push('price');
      else {
        const parts=values.price.replace(',','.').split('.');
        values.price=String(Number(parts[0]))+'.'+(parts[1]||'').padEnd(2,'0');
      }
      if(!/^\d{1,9}$/.test(values.stock)) issues.push('stock');
      else values.stock=String(Number(values.stock));
      return {record:index+1,original,values,issues,changed:fields.some(f=>original[f]!==values[f])};
    });
    const codes=new Map();
    for(const item of result) {
      const key=item.values.sku.normalize('NFC').toUpperCase();
      if(key) codes.set(key,(codes.get(key)||0)+1);
    }
    for(const item of result) if(codes.get(item.values.sku.normalize('NFC').toUpperCase())>1) item.issues.push('duplicate');
    return result;
  }
  function output(items) {
    return Papa.unparse({fields:['sku','nombre','categoria','precio','stock'],data:items.filter(i=>!i.issues.length).map(i=>fields.map(f=>i.values[f]))},{escapeFormulae:true,newline:'\r\n'});
  }
  function report(items) {
    return Papa.unparse({fields:['registro','estado','incidencias','normalizado',...fields.map(f=>'original_'+f),...fields.map(f=>'salida_'+f)],data:items.map(i=>[i.record,i.issues.length?'revisar':'valido',i.issues.join('|'),i.changed?'si':'no',...fields.map(f=>i.original[f]),...fields.map(f=>i.values[f])])},{escapeFormulae:/^[\s]*[=+\-@]|^[\t\r\n]/,newline:'\r\n'});
  }
  return {fields,sample,read,suggest,review,output,report};
});
