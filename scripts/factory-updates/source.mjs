import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { appendFile, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { dayInChicago, recordPath } from "./apply.mjs";

const repository="jaydubya818/FDLC", today=dayInChicago(), record=recordPath(today);
assert.equal(process.env.GITHUB_REPOSITORY,repository);
assert.equal(process.env.GITHUB_REF,"refs/heads/main");
const run=(program,args,env={})=>execFileSync(program,args,{encoding:"utf8",env:{...process.env,...env}}).trim();
const git=(...args)=>run("git",args);
const gh=(...args)=>run("gh",args);
const output=async values=>appendFile(process.env.GITHUB_OUTPUT,Object.entries(values).map(([k,v])=>k+"="+v).join("\n")+"\n");
const sha = value => { assert.match(value,/^[a-f0-9]{40}$/); return value; };
const sameMain = expected => assert.equal(gh("api","repos/"+repository+"/git/ref/heads/main","--jq",".object.sha"),expected,"main changed; rerun the daily workflow");
const [mode,input] = process.argv.slice(2);
const head=sha(git("rev-parse","HEAD"));
if (mode==="recover") {
  // Only resume the exact merge at the tip. A later unrelated release must be reconciled independently.
  assert.equal(git("log","-1","--first-parent","--format=%H","--",record),head,"Later main changes need a new qualification");
  sameMain(head);
  await output({revision:head,base:sha(git("rev-parse","HEAD^1"))});
} else if (mode==="open") {
  sameMain(head);
  const proposal=JSON.parse(await readFile(input,"utf8"));
  assert.equal(proposal.day,today); assert.equal(proposal.base,head);
  const branch="automation/factory-updates-"+today+"-"+process.env.GITHUB_RUN_ID+"-"+process.env.GITHUB_RUN_ATTEMPT;
  assert.match(branch,/^automation\/factory-updates-[0-9-]+$/);
  git("switch","-c",branch);
  run(process.execPath,["scripts/factory-updates/apply.mjs",input]);
  run(process.execPath,["--test","tests/unit/factory-updates.test.ts"]);
  git("add","--","data/factory-updates.ts",record);
  const files=git("diff","--cached","--name-only").split("\n");
  assert.ok(files.includes(record) && files.every(x=>x===record || x==="data/factory-updates.ts"));
  git("-c","user.name=FDLC Daily Updates","-c","user.email=41898282+github-actions[bot]@users.noreply.github.com","commit","-m","Record factory research for "+today);
  const candidate=sha(git("rev-parse","HEAD")); sameMain(head);
  git("push","origin","HEAD:refs/heads/"+branch);
  const note=join(await mkdtemp(join(tmpdir(),"fdlc-pr-")),"body.md");
  await writeFile(note,"Daily primary-source review for "+today+". The hosted runner compared "+proposal.candidates+" candidates with "+proposal.archived+" archive entries and selected "+proposal.selected.length+".\n\n[Cloud research and evidence](https://github.com/"+repository+"/actions/runs/"+process.env.GITHUB_RUN_ID+")\n");
  assert.ok(process.env.FDLC_PR_TOKEN,"Dedicated FDLC pull-request credential missing");
  const link=run("gh",["pr","create","--repo",repository,"--base","main","--head",branch,"--title","Daily factory updates for "+today,"--body-file",note],{GH_TOKEN:process.env.FDLC_PR_TOKEN});
  const match=/^https:\/\/github\.com\/jaydubya818\/FDLC\/pull\/(\d+)$/.exec(link);assert.ok(match,"Expected an FDLC pull request");
  console.log(link);
  await output({candidate,base:head,pr:match[1]});
} else if (mode==="merge") {
  const candidate=sha(process.env.CANDIDATE), base=sha(process.env.BASE), pr=process.env.PR_NUMBER;
  assert.match(pr,/^[1-9]\d*$/); sameMain(base);
  const prPath="repos/"+repository+"/pulls/"+pr;
  const state=JSON.parse(gh("api",prPath));
  assert.equal(state.head.sha,candidate); assert.equal(state.base.ref,"main"); assert.equal(state.head.repo.full_name,repository);
  assert.equal(state.state,"open"); assert.ok(!state.draft);
  // Require the repository's CI and both existing Vercel integration checks for this exact PR.
  const until=Date.now()+40*60*1000;
  for (;;) {
    const checks=JSON.parse(gh("pr","view",pr,"--repo",repository,"--json","statusCheckRollup")).statusCheckRollup;
    const wanted=["FDLC and Fab Qualification","Vercel – fdlc","Vercel – ai-fde"];
    const statuses=wanted.map(name=>checks.find(c=>(c.name||c.context)===name)).map(c=>c?.conclusion||c?.state||"PENDING");
    assert.ok(!statuses.some(s=>["FAILURE","ERROR","CANCELLED","TIMED_OUT"].includes(s)),"Candidate checks failed: "+statuses.join(", "));
    if(statuses.every(s=>s==="SUCCESS")) break;
    assert.ok(Date.now()<until,"Timed out waiting for candidate CI/Previews");
    await new Promise(done=>setTimeout(done,20000));
  }
  sameMain(base);
  const merged=JSON.parse(gh("api","--method","PUT",prPath+"/merge","-f","sha="+candidate,"-f","merge_method=merge"));
  assert.equal(merged.merged,true);
  const revision=sha(merged.sha);
  const commit=rev=>JSON.parse(gh("api","repos/"+repository+"/git/commits/"+rev));
  assert.deepEqual(commit(revision).parents.map(x=>x.sha),[base,candidate]);
  assert.equal(commit(revision).tree.sha,commit(candidate).tree.sha);
  sameMain(revision); await output({revision,base});
} else { throw new Error("Unknown source operation"); }
