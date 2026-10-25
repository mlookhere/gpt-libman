import {readFileSync} from 'node:fs';
if(!process.env.GITHUB_EVENT_PATH||!process.env.GITHUB_REPOSITORY)throw Error('Missing GitHub Actions metadata');
const pr=JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH,'utf8')).pull_request;
if(!pr)throw Error('Not a PR event');
const base=pr.base?.ref, branch=pr.head?.ref||'', release=base==='main';
if(!['dev','main'].includes(base))throw Error('Invalid PR base');
if(release&&branch!=='dev')throw Error('Production PR must come from dev');
if(!release&&!/^work\/\d+-[a-z0-9][a-z0-9-]*$/.test(branch))throw Error('Issue work branch required');
const match=String(pr.body||'').match(/(?:Refs|Closes|Fixes)\s+#(\d+)/i);
if(!match)throw Error('PR must link Issue');
if(!release&&Number(match[1])!==Number(branch.match(/^work\/(\d+)-/)[1]))throw Error('Issue number mismatch');
for(const section of ['Result','Implementation','Verification','Risk','Remaining work']){
 if(!new RegExp('^#{1,3} '+section+'\\s*$','mi').test(pr.body||''))throw Error('Missing PR section '+section);
}
if(!process.env.GH_TOKEN)throw Error('GH_TOKEN required');
const res=await fetch('https://api.github.com/repos/'+process.env.GITHUB_REPOSITORY+'/issues/'+match[1],{headers:{Authorization:'Bearer '+process.env.GH_TOKEN,Accept:'application/vnd.github+json'}});
if(!res.ok)throw Error('Linked Issue not verified: '+res.status);
const issue=await res.json();
if(issue.pull_request||issue.state!=='open')throw Error('Linked Issue is not open');
console.log('Validated PR '+branch+' -> '+base+' Issue #'+match[1]);
