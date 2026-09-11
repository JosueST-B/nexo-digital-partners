const fs = require('node:fs');
const path = require('node:path');
const JSZip = require('jszip');
const root = path.resolve(__dirname,'../products/brief-kit');
const files = ['index.html','brief.css','brief-model.js','brief.js','README.md','example.json','assets/nexo.png','assets/lucide.min.js','assets/lucide-LICENSE'];
(async()=>{
  const zip = new JSZip();
  for(const file of files) zip.file('nexo-brief/'+file,fs.readFileSync(path.join(root,file)));
  const output = path.resolve(root,'../nexo-brief-v1.zip');
  fs.writeFileSync(output, await zip.generateAsync({type:'nodebuffer',compression:'DEFLATE'}));
  const verified = await JSZip.loadAsync(fs.readFileSync(output));
  for(const file of files) {
    const packed = await verified.file('nexo-brief/'+file).async('nodebuffer');
    if(!packed.equals(fs.readFileSync(path.join(root,file)))) throw new Error('ZIP mismatch: '+file);
  }
  console.log('Packaged and verified '+files.length+' files: '+output);
})().catch(error=>{console.error(error);process.exitCode=1;});
