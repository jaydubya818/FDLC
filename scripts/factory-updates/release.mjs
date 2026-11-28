import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { appendFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { factoryUpdates, factoryUpdatesReviewed } from "../../data/factory-updates.ts";
import { child, inspectRoute, publicPage, routes, verifyFeed } from "./verify.mjs";
import { recordPath } from "./apply.mjs";

const project="prj_MTztpwHj7IeGwuSMUzdcytLjo6zs", team="team_p8z8exJRTGfOPk1GC9vUOpv3";
const expected=process.env.REVISION, base=process.env.RESEARCH_BASE, bootstrap=process.env.BOOTSTRAP_SHA||"";
const token=process.env.VERCEL_TOKEN, directory=process.env.RUNNER_TEMP, hostnames=["fdlc.ai","www.fdlc.ai"];
assert.ok(token && directory && process.env.GITHUB_REF==="refs/heads/main");
assert.match(expected,/^[a-f0-9]{40}$/); assert.match(base,/^[a-f0-9]{40}$/);
const git=(...args)=>execFileSync("git",args,{encoding:"utf8"}).trim();
const tree=rev=>git("rev-parse",rev+"^{tree}");
assert.equal(git("rev-parse","HEAD"),expected);
async function api(path,method="GET") {
  const res=await fetch("https://api.vercel.com"+path+"?teamId="+team,{method,signal:AbortSignal.timeout(45000),headers:{Authorization:"Bearer "+token}});
  assert.ok(res.ok,"Vercel "+method+" "+path+" returned "+res.status);
  return res.status===204?null:res.json();
}
const alias=async host=>{
  const a=await api("/v4/aliases/"+host); assert.equal(a.projectId,project); return a.deploymentId;
};
const info=async id=>{
  assert.match(id,/^dpl_[A-Za-z0-9]+$/);
  const d=await api("/v13/deployments/"+id);
  assert.equal(d.id,id); assert.equal(d.projectId,project); assert.equal(d.ownerId||d.team?.id,team); assert.equal(d.target,"production");
  assert.equal(d.readyState,"READY");
  const sha=d.gitSource?.sha||d.meta?.githubCommitSha||d.meta?.gitCommitSha;
  assert.match(sha,/^[0-9a-f]{40}$/);
  return {id,url:d.url,sha,autoAssignCustomDomains:d.autoAssignCustomDomains};
};
async function current(id) {
  const actual=await Promise.all(hostnames.map(alias)); assert.deepEqual(actual,[id,id],"Production aliases moved");
}
const wait=ms=>new Promise(done=>setTimeout(done,ms));
function vc(args) {
  const cli=join(directory,"fdlc-cli","node_modules",".bin","vercel");
  const res=spawnSync(cli,[...args,"--scope",team,"--token",token],{encoding:"utf8",timeout:900000,maxBuffer:8*1024*1024});
  if(res.status!==0) throw new Error("Vercel "+args[0]+" failed: "+String(res.stderr||"").replaceAll(token,"[redacted]").slice(-1200));
  return res.stdout.trim();
}
function stagePage(id,path) {
  const file=join(directory,"staged-"+(path.replace(/[^a-z]/g,"")||"home")+".html");
  // curl arguments belong after the CLI's own options.
  const cli=join(directory,"fdlc-cli","node_modules",".bin","vercel");
  const r=spawnSync(cli,["curl",path,"--deployment",id,"--scope",team,"--token",token,"--","--silent","--show-error","--fail","--max-time","45","--output",file],{encoding:"utf8",timeout:100000});
  if(r.status!==0) throw new Error("Protected stage request failed on "+path+": "+String(r.stderr||"").replaceAll(token,"[redacted]").slice(-650));
  return readFile(file,"utf8");
}
function assertComposition(baseline,actual,id) {
  assert.equal(actual.length,baseline.length);
  actual.forEach((page,i)=>assert.deepEqual(page,{...baseline[i],id:child(page.path)?baseline[i].id:id},page.path));
}
const checkRoutes=reader=>Promise.all(routes.map(async path=>inspectRoute(path,await reader(path))));
const baselineId=await alias("fdlc.ai"); await current(baselineId);
const before=await info(baselineId), previousFile=join(directory,"deployed-feed.ts");
await writeFile(previousFile,execFileSync("git",["show",before.sha+":data/factory-updates.ts"]));
const previous=await import(pathToFileURL(previousFile).href);
const priorIds=new Set(previous.factoryUpdates.map(x=>x.id));
assert.deepEqual(factoryUpdates.filter(x=>priorIds.has(x.id)),previous.factoryUpdates,"Historical entries changed");
const baselineFeed=verifyFeed(await publicPage("/updates"),previous.factoryUpdates,previous.factoryUpdatesReviewed);
assert.equal(baselineFeed.id,before.id);
const baselineRoutes=await checkRoutes(publicPage);
const isDaily=file=>file==="data/factory-updates.ts" || /^docs\/reviews\/\d{4}-\d{2}-\d{2}-factory-updates-cloud\.md$/.test(file);
function changes(from,to) { return git("diff","--name-only",from,to).split("\n").filter(Boolean); }
async function verifyPublic(id) {
  await current(id);
  for (const host of hostnames) assert.equal(verifyFeed(await publicPage("/updates",host),factoryUpdates,factoryUpdatesReviewed).id,id);
  const pages=await checkRoutes(publicPage); assertComposition(baselineRoutes,pages,id); return pages;
}
const receipt={workflow:"https://github.com/"+process.env.GITHUB_REPOSITORY+"/actions/runs/"+process.env.GITHUB_RUN_ID,
  checkedAt:new Date().toISOString(),commit:expected,sourceTree:tree(expected),previousDeployment:before,
  previousEntries:priorIds.size,entries:factoryUpdates.length,reviewed:factoryUpdatesReviewed,canonical:"https://fdlc.ai/updates"};
if (tree(before.sha)===tree(expected)) {
  receipt.routes=await verifyPublic(before.id); receipt.deployment=before; receipt.outcome="Already published and reverified";
} else {
  if (bootstrap) {
    assert.ok(process.env.GITHUB_EVENT_NAME==="workflow_dispatch" && bootstrap===base,"Bootstrap requires the approved research base");
    const allowed=file=>file.startsWith("scripts/factory-updates/") ||
      [".github/workflows/factory-updates.yml",".github/workflows/ci.yml","docs/runbooks/factory-updates-daily.md"].includes(file);
    assert.ok(changes(before.sha,base).every(allowed),"Unrelated main changes before migration");
  } else {
    assert.ok(changes(before.sha,base).every(isDaily),"Unpublished main changes outside the daily feed");
  }
  const dailyFiles=changes(base,expected);
  assert.ok(dailyFiles.includes(recordPath(factoryUpdatesReviewed)) && dailyFiles.every(isDaily),"Candidate scope changed");
  assert.equal((JSON.parse(await readFile("vercel.json","utf8"))).git.deploymentEnabled.main,false);
  assert.equal(git("status","--porcelain"),"","Release checkout must be clean");
  await mkdir(".vercel",{recursive:true});
  await writeFile(".vercel/project.json",JSON.stringify({orgId:team,projectId:project,projectName:"fdlc"}));
  await current(before.id);
  const submitted=JSON.parse(vc(["deploy","--prod","--skip-domain","--yes","--format","json","--meta","githubCommitSha="+expected,"--meta","githubCommitRef=main","--meta","githubCommitOrg=jaydubya818","--meta","githubCommitRepo=FDLC"]));
  const stage=await info(submitted.deployment.id);
  assert.equal(stage.sha,expected); assert.equal(stage.autoAssignCustomDomains,false);
  // Match the bytes received by Vercel against the reviewed source for every changed daily file.
  const files=await api("/v6/deployments/"+stage.id+"/files");
  const flat=new Map();
  function walk(nodes,prefix="") { for(const n of nodes) {const path=prefix+n.name; if(n.type==="directory")walk(n.children||[],path+"/");else flat.set(path,n.uid);} }
  walk(files);
  for(const path of dailyFiles) assert.equal(flat.get(path),createHash("sha1").update(execFileSync("git",["show",expected+":"+path])).digest("hex"),path);
  assert.equal(verifyFeed(await stagePage(stage.id,"/updates"),factoryUpdates,factoryUpdatesReviewed).id,stage.id);
  const staged=await checkRoutes(path=>stagePage(stage.id,path)); assertComposition(baselineRoutes,staged,stage.id);
  await current(before.id);
  const liveHead=execFileSync("gh",["api","repos/jaydubya818/FDLC/git/ref/heads/main","--jq",".object.sha"],{encoding:"utf8"}).trim();
  assert.equal(liveHead,expected,"main moved during staging");
  receipt.deployment=stage; receipt.stagedAt=new Date().toISOString();
  await writeFile(join(directory,"publication.json"),JSON.stringify(receipt,null,2)+"\n");
  await api("/v10/projects/"+project+"/promote/"+stage.id,"POST");
  let last;
  for(let attempt=0;attempt<15;attempt++) {
    try { receipt.routes=await verifyPublic(stage.id);last=null;break; } catch(error) { last=error;await wait(8000); }
  }
  if(last) {
    // Never roll back over a concurrent release. Only restore the qualified predecessor if both aliases are ours.
    await current(stage.id); await api("/v1/projects/"+project+"/rollback/"+before.id,"POST");
    let restored=false;
    for(let attempt=0;attempt<15;attempt++) {
      try {
        await current(before.id);
        for (const host of hostnames) assert.equal(verifyFeed(await publicPage("/updates",host),previous.factoryUpdates,previous.factoryUpdatesReviewed).id,before.id);
        assertComposition(baselineRoutes,await checkRoutes(publicPage),before.id);
        restored=true;break;
      } catch {await wait(8000);}
    }
    receipt.outcome=restored?"Rolled back and reverified":"Rollback requested; public verification failed";
    await writeFile(join(directory,"publication.json"),JSON.stringify(receipt,null,2)+"\n");
    throw new Error(receipt.outcome+" for "+before.id+". "+last.message);
  }
  receipt.outcome="Promoted and verified";
}
receipt.completed=new Date().toISOString();
await writeFile(join(directory,"publication.json"),JSON.stringify(receipt,null,2)+"\n");
await appendFile(process.env.GITHUB_STEP_SUMMARY,["## "+receipt.outcome,"","[FDLC Factory Updates](https://fdlc.ai/updates) served "+receipt.entries+" entries, including all "+receipt.previousEntries+" previously published entries.","","Commit "+expected+" · Vercel "+receipt.deployment.id+" · Reviewed "+factoryUpdatesReviewed,""].join("\n"));
console.log(JSON.stringify({outcome:receipt.outcome,commit:expected,deployment:receipt.deployment.id,entries:receipt.entries,retained:receipt.previousEntries}));
