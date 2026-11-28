import assert from "node:assert/strict";
import { createRequire } from "node:module";
const {parse} = createRequire(import.meta.url)("next/dist/compiled/node-html-parser");
const clean = value => value?.replace(/\s+/gu," ").trim();
const format = value => new Intl.DateTimeFormat("en-US",{timeZone:"UTC",month:"short",day:"numeric",year:"numeric"}).format(new Date(value+"T00:00:00Z"));
export const routes=["/","/start","/framework","/factory-engineering","/guide","/deploy/app"];
export const child = path => path==="/guide" || path==="/deploy/app";

export function inspectRoute(path, html) {
  const page=parse(html);
  const id=page.querySelector("html")?.getAttribute("data-dpl-id");
  const title=clean(page.querySelector("title")?.text), heading=clean(page.querySelector("h1")?.text);
  assert.match(id||"",/^dpl_[a-zA-Z0-9]+$/,path);
  assert.ok(title && heading && !/not found|authentication required|sign in to vercel/i.test(title),path);
  if(path==="/start") assert.equal(clean(page.querySelector(".builder-intro .button-dark")?.text),"Start the builder");
  if(path==="/guide") assert.equal(page.querySelector('link[rel=canonical]')?.getAttribute("href"),"https://www.fdlc.ai/guide");
  return {path,id,title,heading};
}

export function verifyFeed(html, expected, reviewed) {
  const page=parse(html);
  const meta=Object.fromEntries(page.querySelectorAll(".page-hero-meta > div").map(n=>[n.querySelector("dt").text,n.querySelector("dd").text]));
  assert.equal(Number(meta.Entries),expected.length);
  assert.equal(Number(meta.Publishers),new Set(expected.map(x=>x.source)).size);
  assert.equal(meta["Last reviewed"],format(reviewed));
  const rows=page.querySelectorAll(".updates-feed > li");
  assert.deepEqual(rows.map(r=>r.id),expected.map(x=>x.id));
  for (const [i,row] of rows.entries()) {
    const item=expected[i], title=row.querySelector("h3 a"), time=row.querySelector("time");
    assert.equal(clean(title?.childNodes[0]?.text),item.title,item.id);
    assert.equal(title.getAttribute("href"),item.url,item.id);
    assert.equal(time?.getAttribute("datetime"),item.date,item.id);
    assert.equal(time.text,(item.dateBasis==="reviewed"?"Reviewed ":"")+format(item.date),item.id);
    assert.deepEqual(row.querySelectorAll("header > span").map(n=>n.text),[item.source,item.kind,item.touches].filter(Boolean),item.id);
    assert.equal(clean(row.querySelector("article > p")?.text),item.summary,item.id);
    assert.equal(clean(row.querySelector(".updates-why")?.text),"Why it matters "+item.whyItMatters,item.id);
    assert.deepEqual(row.querySelectorAll('ul[aria-label="Tags"] > li').map(n=>n.text),item.tags,item.id);
    assert.equal(row.querySelector("a.text-action")?.getAttribute("href"),item.guideReading?.href,item.id);
  }
  assert.doesNotMatch(rows.map(r=>r.text).join(" "),/zach/i);
  return {id:inspectRoute("/updates",html).id,entries:rows.length,reviewed};
}

export async function publicPage(path,host="fdlc.ai") {
  assert.ok(["fdlc.ai","www.fdlc.ai"].includes(host));
  const res=await fetch("https://"+host+path,{signal:AbortSignal.timeout(30000),headers:{"Cache-Control":"no-cache"}});
  assert.equal(res.status,200,path);
  assert.ok(["fdlc.ai","www.fdlc.ai"].includes(new URL(res.url).hostname));
  return res.text();
}
