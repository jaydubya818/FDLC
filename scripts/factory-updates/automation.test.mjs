import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { factoryUpdates, factoryUpdatesReviewed } from "../../data/factory-updates.ts";
import { render, recordPath } from "./apply.mjs";
import { createRequire } from "node:module";
import { canonical, datedReleases, sourcePassages } from "./sources.mjs";

const source=await readFile(new URL("../../data/factory-updates.ts",import.meta.url),"utf8");
const day=factoryUpdatesReviewed;
const review={version:1,day,previous:day,start:day,archived:factoryUpdates.length,candidates:1,shortlisted:1,selected:[],
  inventory:Array.from({length:12},(_,i)=>({status:"read",publisher:"Source "+i}))};
const sample={entry:{id:"fdlc-cloud-fixture",date:day,title:"A first-party release adds evidence to the review",
  source:"Example Research",url:"https://example.org/fixture",summary:'A published change records the evidence used in a review and retains quoted "before" values.',
  whyItMatters:"Evidence: compare both timestamps in an independent review before signing off.",touches:"Evidence",tags:["review evidence"]},
  evidence:"The new release records each review decision separately."};

test("a completed review with no news preserves the archive byte for byte",()=>{
  assert.equal(render(source,review,factoryUpdates),source);
});
test("a qualified update is serialized as data and retains every historical entry",()=>{
  const result=render(source,{...review,selected:[sample]},factoryUpdates);
  const first='\n  {\n    id: "'+sample.entry.id+'",';
  const original='\n  {\n    id: "'+factoryUpdates[0].id+'",';
  assert.equal(result.slice(0,result.indexOf(first))+result.slice(result.indexOf(original)),source);
  assert.ok(result.includes(JSON.stringify(sample.entry.summary)));
});
test("duplicate, unsafe, stale or under-researched proposals cannot be applied",()=>{
  const apply=entry=>render(source,{...review,selected:[{...sample,entry:{...sample.entry,...entry}}]},factoryUpdates);
  assert.throws(()=>apply({url:factoryUpdates[0].url+"#duplicate"}));
  assert.throws(()=>apply({id:factoryUpdates[0].id}));
  assert.throws(()=>apply({summary:"<script>invalid</script>"}));
  assert.throws(()=>apply({url:"http://example.org/file"}));
  assert.throws(()=>apply({date:"2099-12-31"}));
  assert.throws(()=>render(source,{...review,inventory:[]},factoryUpdates));
  assert.throws(()=>recordPath("../../elsewhere"));
  assert.equal(canonical("https://www.arxiv.org/abs/2611.12345v2?a=1#one"),canonical("https://arxiv.org/abs/2611.12345v1"));
});

test("explicit dated release sections remain distinct on the same publisher page",()=>{
  const base="https://docs.tessl.io/changelog-cli";
  const {parse}=createRequire(import.meta.url)("next/dist/compiled/node-html-parser");
  const doc=parse('<main><div id="update-2026-11-27-0-126-0"><h2 id="01260">0.126.0</h2><p>Release evidence</p></div></main>');
  const [release]=datedReleases(doc,"Tessl CLI",base);
  assert.equal(release.date,"2026-11-27"); assert.equal(release.url,base+"#01260");
  assert.notEqual(canonical(release.url),canonical(base+"#01250"));
  assert.equal(canonical(base+"#navigation"),canonical(base));
});

test("editorial evidence comes from real, contiguous publisher text",()=>{
  const text="The release records every approval decision alongside its source revision. Operators can compare both independent checks before promoting any production revision.";
  const passages=sourcePassages(text);
  assert.equal(passages.length,2);
  assert.ok(passages.every(p=>text.includes(p) && p.split(" ").length<=18));
  assert.deepEqual(sourcePassages("Two words."),[]);
});
