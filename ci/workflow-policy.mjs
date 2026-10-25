import {readdirSync,readFileSync} from 'node:fs';
const workflows=readdirSync('.github/workflows').filter(p=>/\.ya?ml$/.test(p));
if(workflows.length<4)throw Error('Expected four CI workflows');
for(const path of workflows){
 const text=readFileSync('.github/workflows/'+path,'utf8');
 if(/pull_request_target:|\bpermissions:\s*write-all\b|\bACTIONS_ALLOW_UNSECURE_COMMANDS\b/.test(text))throw Error('Unsafe workflow: '+path);
 if(/\$\{\{\s*github\.event\.pull_request\.(title|body)\s*\}\}/.test(text))throw Error('Unsafe text interpolation: '+path);
 if(!/permissions:/.test(text))throw Error('Missing explicit permissions: '+path);
}
const p=JSON.parse(readFileSync('.chatfreept/project.json','utf8'));
const g=JSON.parse(readFileSync('.chatfreept/github.json','utf8'));
const c=JSON.parse(readFileSync('.chatfreept/ci.json','utf8'));
if(p.repository!=='mlookhere/gpt-libman'||p.branches.production!=='main'||p.branches.integration!=='dev')throw Error('Wrong repository policy');
for(const kind of ['integration','production'])if(p.required_checks[kind].join('|')!==g.required_checks[kind].join('|'))throw Error('Required check mismatch');
for(const [name,tasks] of Object.entries(c.stages))if(!tasks.length||tasks.some(t=>!c.commands[t]))throw Error('Incomplete stage '+name);
console.log('Workflow policy passed');
