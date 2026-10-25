import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
const config=JSON.parse(readFileSync(new URL('../.chatfreept/ci.json',import.meta.url),'utf8'));
const stage=process.argv[2];
if(!Object.hasOwn(config.stages,stage)||!Array.isArray(config.stages[stage])||!config.stages[stage].length)throw Error('Unknown or empty CI stage: '+stage);
for(const task of config.stages[stage]){
 const command=config.commands[task];
 if(!command||!command.trim()||/(?:TODO|PLACEHOLDER|echo passed)/i.test(command))throw Error('Missing command: '+task);
 console.log('[CI] '+stage+': '+task+': '+command);
 const result=spawnSync(command,{shell:true,stdio:'inherit',env:{...process.env,CI:'true'}});
 if(result.error||result.status!==0)process.exit(result.status||1);
}
console.log('[CI] completed '+config.stages[stage].length+' mandatory stages');
