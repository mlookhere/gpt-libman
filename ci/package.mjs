import {existsSync,readdirSync,readFileSync,mkdirSync,writeFileSync,statSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {join,relative} from 'node:path';
const {version}=JSON.parse(readFileSync('package.json','utf8'));
const manifest=JSON.parse(readFileSync('dist/manifest.json','utf8'));
if(version!==manifest.version)throw Error('Manifest and package versions differ');
for(const name of ['content.js','page-hook.js','background.js','manager.css','manifest.json']){
 if(!existsSync('dist/'+name)||statSync('dist/'+name).size<100)throw Error('Missing compiled file: '+name);
}
const files=[];
function scan(dir){for(const entry of readdirSync(dir,{withFileTypes:true})){
 const path=join(dir,entry.name);if(entry.isDirectory())scan(path);else if(entry.isFile()){
 const bytes=readFileSync(path);files.push({path:relative('dist',path).replaceAll('\\','/'),bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});
 }}}
scan('dist');
if(files.length<60)throw Error('Expected at least 60 distribution files');
files.sort((a,b)=>a.path.localeCompare(b.path));
mkdirSync('artifacts/ci',{recursive:true});
writeFileSync('artifacts/ci/manifest.json',JSON.stringify({version,files},null,2)+'\n');
writeFileSync('artifacts/ci/SHA256SUMS',files.map(f=>f.sha256+'  '+f.path).join('\n')+'\n');
console.log('Verified '+files.length+' release assets');
