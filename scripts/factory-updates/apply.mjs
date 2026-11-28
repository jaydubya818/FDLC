import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { factoryUpdates, factoryUpdatesReviewed, fdlcStages, fdlcCapabilities } from "../../data/factory-updates.ts";
import { canonical, withdrawn } from "./sources.mjs";

const feed = "data/factory-updates.ts";
const fields = new Set([...fdlcStages,...fdlcCapabilities]);
const plain = (value, max=650) => typeof value==="string" && value.trim()===value && value.length>0 && value.length<=max &&
  !/[\p{Cc}<>\u2028\u2029]|\$\{\{|https?:\/\/|\[[^\]]+\]\(/ui.test(value) && !withdrawn.test(value);
const date = value => /^\d{4}-\d{2}-\d{2}$/.test(value) && new Date(value+"T00:00:00Z").toISOString().slice(0,10)===value;
export const dayInChicago = () => new Intl.DateTimeFormat("en-CA", {timeZone:"America/Chicago",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
export const recordPath = day => { assert.ok(date(day)); return "docs/reviews/"+day+"-factory-updates-cloud.md"; };
const url = value => {
  const parsed = new URL(value);
  assert.equal(parsed.protocol,"https:");
  assert.ok(!parsed.username && !parsed.password && !parsed.port && !/[\s<>()[\]\x60\\]/.test(value));
};

export function render(source, proposal, existing) {
  assert.equal(proposal.version,1);
  const {day,previous,start,selected,inventory} = proposal;
  assert.ok(date(day) && date(start) && date(previous) && start<=previous && previous<=day);
  assert.equal(proposal.archived,existing.length);
  assert.ok(Array.isArray(inventory) && inventory.length>=10 && inventory.filter(s=>s.status==="read").length>=inventory.length/2);
  assert.ok(Number.isInteger(proposal.candidates) && Number.isInteger(proposal.shortlisted) &&
    proposal.candidates>=proposal.shortlisted && proposal.shortlisted>=selected.length);
  const ids=new Set(existing.map(x=>x.id)), urls=new Set(existing.map(x=>canonical(x.url)));
  const reviewDate='export const factoryUpdatesReviewed = "'+previous+'";';
  assert.equal(source.split(reviewDate).length,2);
  let result=source.replace(reviewDate, 'export const factoryUpdatesReviewed = "'+day+'";');
  const ordered=[...existing];
  for (const {entry,evidence} of selected) {
    const {id,date:published,title,source:publisher,url:link,summary,whyItMatters,touches,tags,kind}=entry;
    assert.ok(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) && id.length<=90 && !ids.has(id));
    url(link); assert.ok(!urls.has(canonical(link)) && !withdrawn.test(link)); ids.add(id); urls.add(canonical(link));
    assert.ok(date(published) && published>=start && published<=day);
    assert.ok([title,publisher,summary,whyItMatters,evidence].every(s=>plain(s)) && fields.has(touches) && whyItMatters.startsWith(touches+": "));
    assert.ok(!kind || kind==="Perspective"); assert.ok(Array.isArray(tags) && tags.length>0 && tags.length<=3 && tags.every(t=>plain(t,40)));
    // Whitelist properties and serialize every value as JSON. Source text can never supply TypeScript.
    const safe={id,date:published,...(kind?{kind}:{}),title,source:publisher,url:link,summary,whyItMatters,touches,tags};
    const index=ordered.findIndex(x=>x.date<=published);
    const marker=index<0 ? "\n];" : '\n  {\n    id: '+JSON.stringify(ordered[index].id)+',\n';
    assert.equal(result.split(marker).length,2,"Feed layout changed");
    const block="\n  {\n"+Object.entries(safe).map(([key,value])=>"    "+key+": "+JSON.stringify(value)+",").join("\n")+"\n  },";
    result=result.replace(marker,()=>block+marker);
    ordered.splice(index<0?ordered.length:index,0,safe);
  }
  assert.deepEqual(ordered.filter(x=>existing.some(o=>o.id===x.id)),existing);
  return result;
}

if (process.argv[1] && import.meta.url===pathToFileURL(resolve(process.argv[1])).href) {
  const p=JSON.parse(await readFile(process.argv[2],"utf8"));
  assert.equal(p.base,execFileSync("git",["rev-parse","HEAD"],{encoding:"utf8"}).trim(),"Source changed after research");
  assert.equal(p.previous,factoryUpdatesReviewed);
  assert.equal(p.day,dayInChicago(),"Research is for a different Central date");
  const updated=render(await readFile(feed,"utf8"),p,factoryUpdates);
  const lines=["# Factory updates research for "+p.day,"",
    "The hosted review covered "+p.start+" through "+p.day+" using original publisher material. It compared "+p.candidates+" dated candidates with "+p.archived+" archived entries and examined "+p.shortlisted+" in detail.","",
    "## Publication decisions",""];
  for (const {entry} of p.selected) lines.push("- "+entry.title+" ("+entry.date+"). "+entry.url);
  if (!p.selected.length) lines.push("No distinct development passed the editorial and evidence checks. The archive is preserved.");
  lines.push("","## Coverage","","| Source | Result |","| --- | --- |");
  for (const s of p.inventory) {
    assert.ok(plain(s.publisher,160) && ["read","limited"].includes(s.status)); url(s.url);
    const status=s.status==="read"?"Read":"Unavailable";
    const count=Number.isInteger(s.articlesRead)?", "+s.articlesRead+" article pages":"";
    const limits=Number.isInteger(s.limitedArticles)&&s.limitedArticles>0?", "+s.limitedArticles+" article requests failed":"";
    lines.push("| ["+s.publisher.replaceAll("|"," ")+"]("+s.url+") | "+status+count+limits+" |");
  }
  lines.push("","The workflow artifact contains the source evidence for selected entries and the disposition of shortlisted items. The deployment receipt records subsequent production verification.","");
  await writeFile(recordPath(p.day),lines.join("\n"),{flag:"wx"});
  await writeFile(feed,updated);
}
