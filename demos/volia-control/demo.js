const seed = [
  {id:'DEMO-01',name:'Instrumental de muestra A',price:85,stock:12,min:3},
  {id:'DEMO-02',name:'Set de muestra B',price:140,stock:2,min:3},
  {id:'DEMO-03',name:'Consumible de muestra C',price:12,stock:36,min:10}
];
let products = structuredClone(seed);
const cart = new Map();
const $ = s => document.querySelector(s);
const money = n => new Intl.NumberFormat('es-EC',{style:'currency',currency:'USD'}).format(n);
function iconButton(icon,label,handler){const b=document.createElement('button');b.title=label;b.setAttribute('aria-label',label);const i=document.createElement('i');i.dataset.lucide=icon;b.append(i);b.addEventListener('click',handler);return b;}
function cell(row,text){const td=document.createElement('td');td.textContent=text;row.append(td);return td;}
function render(){
  $('#units').textContent=products.reduce((a,p)=>a+p.stock,0);
  $('#value').textContent=money(products.reduce((a,p)=>a+p.stock*p.price,0));
  $('#low').textContent=products.filter(p=>p.stock<=p.min).length;
  $('#products').replaceChildren();
  for(const p of products.filter(p=>(p.name+' '+p.id).toLowerCase().includes($('#search').value.toLowerCase()))){
    const row=document.createElement('tr');cell(row,p.name);cell(row,p.id);cell(row,money(p.price));cell(row,String(p.stock)+(p.stock<=p.min?' / Bajo':''));
    const controls=cell(row,'');controls.className='adjust';
    for(const delta of [-1,1]){const b=iconButton(delta<0?'minus':'plus',(delta<0?'Reducir':'Aumentar')+' stock '+p.id,()=>{p.stock+=delta;render();$('#inventory-status').textContent=p.id+': stock actualizado a '+p.stock;});b.disabled=delta<0&&p.stock===0;controls.append(b);}
    cell(row,'').append(iconButton('file-plus','Cotizar '+p.id,()=>{cart.set(p.id,(cart.get(p.id)||0)+1);render();$('#inventory-status').textContent=p.name+' agregado a la cotizacion.';}));$('#products').append(row);
  }
  if(!$('#products').children.length){const r=document.createElement('tr');const c=cell(r,'Sin resultados.');c.colSpan=6;$('#products').append(r);}
  $('#lines').replaceChildren();let total=0;
  for(const [id,qty] of cart){const p=products.find(p=>p.id===id),r=document.createElement('tr');cell(r,p.name);const input=document.createElement('input');input.type='number';input.min='1';input.max='999';input.step='1';input.value=qty;input.setAttribute('aria-label','Cantidad '+id);input.addEventListener('change',()=>{const n=Number(input.value);cart.set(id,Number.isInteger(n)&&n>=1&&n<=999?n:qty);render();});cell(r,'').append(input);cell(r,money(qty*p.price));cell(r,'').append(iconButton('trash-2','Quitar '+id,()=>{cart.delete(id);render();}));$('#lines').append(r);total+=qty*p.price;}
  $('#empty').hidden=cart.size>0;$('#export').disabled=!cart.size;$('#total').textContent=money(total);window.lucide?.createIcons();
}
document.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>{for(const id of ['inventory','quote'])$('#'+id).hidden=id!==b.dataset.tab;document.querySelectorAll('[data-tab]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));}));
$('#search').addEventListener('input',render);
$('#reset').addEventListener('click',()=>{products=structuredClone(seed);cart.clear();$('#search').value='';render();$('#inventory-status').textContent='Demo reiniciada.';$('#quote-status').textContent='Demo reiniciada.';});
$('#export').addEventListener('click',()=>{const rows=[['DEMO SIN VALIDEZ COMERCIAL'],['Codigo','Producto','Cantidad','Precio ficticio','Importe']];for(const [id,qty] of cart){const p=products.find(p=>p.id===id);rows.push([id,p.name,qty,p.price,(p.price*qty).toFixed(2)]);}const csv=rows.map(r=>r.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(',')).join('\r\n');const u=URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=u;a.download='volia-cotizacion-DEMO.csv';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);$('#quote-status').textContent='Cotizacion ficticia exportada.';});
render();
