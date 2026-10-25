import {readdirSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
const fixtures=readdirSync('tests').filter(path=>path.endsWith('-browser.py')).sort();
if(fixtures.length<12)throw Error('Expected at least twelve Chromium fixtures');
for(const fixture of fixtures){
 console.log('[Browser] '+fixture);
 const result=spawnSync(process.env.PYTHON||'python3',['tests/'+fixture],{stdio:'inherit',timeout:180000});
 if(result.error||result.status!==0){console.error('Failed: '+fixture,result.error?.message||result.status);process.exit(result.status||1);}
}
console.log('Browser fixtures passed: '+fixtures.length);
