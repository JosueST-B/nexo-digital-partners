const translations = {
  es: {title:'Ficha de proyecto',untitled:'Sin título',ready:'Listo',local:'Datos locales',new:'Nueva ficha',save:'Guardar en este navegador',import:'Importar ficha JSON',json:'Exportar JSON',markdown:'Exportar Markdown',print:'Imprimir / PDF',confirm:'¿Empezar una ficha nueva?',confirmText:'Se reemplazará la ficha actual. Exporta una copia para conservarla.',cancel:'Cancelar',saved:'Guardado en este navegador',storageError:'Almacenamiento no disponible. Exporta una copia.',imported:'Ficha importada',invalid:'Archivo no válido. La ficha actual se conserva.',changed:'Cambios sin guardar',exported:'Archivo preparado',complete:'campos esenciales completos',empty:'Pendiente',typeOptions:['Web profesional','Landing page','Automatización','Dashboard','Prototipo','Otro']},
  en: {title:'Project brief',untitled:'Untitled',ready:'Ready',local:'Local data',new:'New brief',save:'Save in this browser',import:'Import JSON brief',json:'Export JSON',markdown:'Export Markdown',print:'Print / PDF',confirm:'Start a new brief?',confirmText:'This will replace the current brief. Export a copy to keep it.',cancel:'Cancel',saved:'Saved in this browser',storageError:'Storage unavailable. Export a copy.',imported:'Brief imported',invalid:'Invalid file. Your current brief has been kept.',changed:'Unsaved changes',exported:'File prepared',complete:'essential fields completed',empty:'Pending',typeOptions:['Professional website','Landing page','Automation','Dashboard','Prototype','Other']}
};
translations.es.services='Solicitar una propuesta a Nexo';
translations.en.services='Request a proposal from Nexo';
const sections = [
  {id:'project',labels:['Proyecto','Project'],fields:[['name','Nombre del proyecto','Project name','text',true],['type','Tipo de solución','Solution type','select'],['owner','Responsable','Project owner','text'],['date','Fecha objetivo','Target date','date']]},
  {id:'purpose',labels:['Objetivo','Purpose'],fields:[['problem','Problema que debe resolver','Problem to solve','textarea',true],['outcome','Resultado esperado y cómo medirlo','Expected outcome and how to measure it','textarea',true]]},
  {id:'audience',labels:['Público','Audience'],fields:[['users','Quién lo utilizará','Who will use it','textarea',true],['action','Acción principal del usuario','Main user action','text'],['languages','Idiomas de la experiencia','Experience languages','text']]},
  {id:'scope',labels:['Alcance','Scope'],fields:[['must','Imprescindible para la primera entrega','Required for the first delivery','textarea',true],['later','Para una etapa posterior','For a later stage','textarea'],['excluded','Fuera del alcance','Out of scope','textarea'],['acceptance','Criterios de aceptación','Acceptance criteria','textarea',true]]},
  {id:'assets',labels:['Contenido y datos','Content and data'],fields:[['content','Textos, imágenes y recursos disponibles','Available copy, images and resources','textarea'],['integrations','Herramientas e integraciones','Tools and integrations','textarea'],['data','Datos necesarios y restricciones de privacidad','Required data and privacy constraints','textarea']]},
  {id:'delivery',labels:['Entrega','Delivery'],fields:[['deliverables','Archivos, accesos y documentación','Files, access and documentation','textarea'],['dependencies','Dependencias y costes externos','Dependencies and external costs','textarea'],['budget','Presupuesto orientativo','Indicative budget','text'],['review','Responsable de aprobar y revisiones acordadas','Approver and agreed review rounds','textarea']]}
];
const form=document.querySelector('#brief-form');
const fieldDefinitions=sections.flatMap(section=>section.fields);
const key='nexo-brief-v1';
let lang='es';
let state=Object.fromEntries(fieldDefinitions.map(([id])=>[id,'']));
let statusKey='ready';
let dirty=false;
function t(key){return translations[lang][key];}
function announce(key){statusKey=key;document.querySelector('#status').textContent=t(key);}
function setText(tag,text,parent){const node=document.createElement(tag);node.textContent=text;parent.append(node);return node;}
function updateProgress(){
  const done=fieldDefinitions.filter(([id,,,,required])=>required&&state[id].trim()).length;
  document.querySelector('#progress').value=done;
  document.querySelector('#progress-label').textContent=done+' / 6 '+t('complete');
  document.querySelector('#project-title').textContent=state.name||t('untitled');
}
function render(){
  document.documentElement.lang=lang;
  document.querySelector('#sections').setAttribute('aria-label',lang==='es'?'Secciones':'Sections');
  document.querySelector('#language').value=lang;
  document.querySelectorAll('[data-copy]').forEach(node=>node.textContent=t(node.dataset.copy));
  document.querySelectorAll('[data-label]').forEach(node=>{node.title=t(node.dataset.label);node.setAttribute('aria-label',t(node.dataset.label));});
  const nav=document.querySelector('#sections');nav.replaceChildren();form.replaceChildren();
  sections.forEach((section,index)=>{
    const label=section.labels[lang==='es'?0:1];
    const anchor=document.createElement('a');anchor.href='#'+section.id;setText('span',String(index+1).padStart(2,'0'),anchor);setText('span',label,anchor);nav.append(anchor);
    const block=document.createElement('section');block.id=section.id;
    const heading=document.createElement('h2');setText('span',String(index+1).padStart(2,'0'),heading);heading.append(document.createTextNode(label));block.append(heading);
    const fields=document.createElement('div');fields.className='fields';block.append(fields);
    section.fields.forEach(([id,es,en,type,required])=>{
      const label=document.createElement('label');if(type==='textarea')label.className='wide';
      label.append(document.createTextNode((lang==='es'?es:en)+(required?' *':'')));
      const input=document.createElement(type==='textarea'?'textarea':type==='select'?'select':'input');
      input.id='field-'+id;input.name=id;
      if(type==='select'){
        const blank=document.createElement('option');blank.value='';blank.textContent='—';input.append(blank);
        ['web','landing','automation','dashboard','prototype','other'].forEach((value,index)=>{const option=document.createElement('option');option.value=value;option.textContent=t('typeOptions')[index];input.append(option);});
      }else{if(type!=='textarea')input.type=type;input.maxLength=type==='textarea'?5000:200;}
      if(required)input.setAttribute('aria-required','true');
      input.value=state[id];input.addEventListener('input',()=>{state[id]=input.value;dirty=true;announce('changed');updateProgress();});
      label.append(input);fields.append(label);
    });
    form.append(block);
  });
  announce(statusKey);updateProgress();
}
function payload(){return {format:'nexo-brief',version:1,language:lang,fields:{...state}};}
function validate(value){
  return NexoBriefModel.validate(value,fieldDefinitions);
}
function displayValue(id){if(id==='type'&&state.type){return t('typeOptions')[['web','landing','automation','dashboard','prototype','other'].indexOf(state.type)];}return state[id]||t('empty');}
function download(content,type,extension){
  const url=URL.createObjectURL(new Blob([content],{type}));const anchor=document.createElement('a');anchor.href=url;anchor.download='nexo-brief.'+extension;anchor.click();setTimeout(()=>URL.revokeObjectURL(url),10000);announce('exported');
}
function markdown(){return '# '+(state.name||t('title'))+'\n\nNexo Brief / v1.0\n\n'+sections.map(section=>'## '+section.labels[lang==='es'?0:1]+'\n\n'+section.fields.map(([id,es,en])=>'### '+(lang==='es'?es:en)+'\n\n'+displayValue(id)+'\n').join('\n')).join('\n');}
document.querySelector('#language').addEventListener('change',event=>{lang=event.target.value;dirty=true;statusKey='changed';render();});
document.querySelector('#save').addEventListener('click',()=>{try{localStorage.setItem(key,JSON.stringify(payload()));dirty=false;announce('saved');}catch{announce('storageError');}});
document.querySelector('#json').addEventListener('click',()=>download(JSON.stringify(payload(),null,2),'application/json','json'));
document.querySelector('#markdown').addEventListener('click',()=>download(markdown(),'text/markdown;charset=utf-8','md'));
document.querySelector('#import').addEventListener('click',()=>document.querySelector('#import-file').click());
document.querySelector('#import-file').addEventListener('change',async event=>{
  const file=event.target.files[0];if(!file)return;
  try{if(file.size>200000)throw new Error('Too large');const imported=validate(JSON.parse(await file.text()));state=imported.fields;lang=imported.language;dirty=true;statusKey='imported';render();}catch{announce('invalid');}finally{event.target.value='';}
});
document.querySelector('#print').addEventListener('click',()=>{
  const preview=document.querySelector('#print-preview');preview.replaceChildren();setText('h1',state.name||t('title'),preview);setText('p','Nexo Brief / v1.0',preview);
  sections.forEach(section=>{setText('h2',section.labels[lang==='es'?0:1],preview);section.fields.forEach(([id,es,en])=>{const block=document.createElement('div');setText('h3',lang==='es'?es:en,block);setText('p',displayValue(id),block);preview.append(block);});});window.print();
});
const confirmNew=document.querySelector('#confirm-new');
document.querySelector('#new').addEventListener('click',()=>confirmNew.showModal());
document.querySelector('#cancel-new').addEventListener('click',()=>confirmNew.close());
document.querySelector('#accept-new').addEventListener('click',()=>{state=Object.fromEntries(fieldDefinitions.map(([id])=>[id,'']));dirty=true;statusKey='changed';render();confirmNew.close();});
form.addEventListener('submit',event=>event.preventDefault());
window.addEventListener('beforeunload',event=>{if(dirty){event.preventDefault();event.returnValue='';}});
try{const saved=localStorage.getItem(key);if(saved){const valid=validate(JSON.parse(saved));state=valid.fields;lang=valid.language;statusKey='saved';}}catch{statusKey='storageError';}
render();window.lucide?.createIcons();
