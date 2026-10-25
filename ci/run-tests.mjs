import {readdirSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
const fixtures=readdirSync('tests').filter(path=>path.endsWith('.test.cjs')).sort();
if(fixtures.length<5)throw Error('Expected at least five Node fixtures');
const result=spawnSync(process.execPath,['--test',...fixtures.map(p=>'tests/'+p)],{stdio:'inherit'});
if(result.error||result.status!==0)process.exit(result.status||1);
