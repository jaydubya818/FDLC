import { createRequire } from "node:module";
import { createHash } from "node:crypto";

const { parse } = createRequire(import.meta.url)("next/dist/compiled/node-html-parser");
const releases = [
  ["OpenAI", "openai/codex"], ["Anthropic", "anthropics/claude-code"],
  ["Google Gemini", "google-gemini/gemini-cli"], ["GitHub", "github/copilot-cli"],
  ["LangChain", "langchain-ai/deepagents"], ["OpenHands", "OpenHands/software-agent-sdk"],
];
// Only these publishers and their own article links enter automatic publication.
// The second URL, where present, is a discovery feed. The first is the HTML fallback.
const sites = [
  ["Warp", "https://www.warp.dev/blog", "/blog/"],
  ["Factory", "https://factory.com/news", "/news/"],
  ["Anthropic", "https://www.anthropic.com/engineering", "/engineering/"],
  ["Cursor", "https://cursor.com/changelog", "/changelog/"],
  ["GitHub", "https://github.blog/changelog/", "/changelog/", "https://github.blog/changelog/feed/"],
  ["Microsoft", "https://devblogs.microsoft.com/devops/", "/devops/", "https://devblogs.microsoft.com/devops/feed/"],
  ["Google DeepMind", "https://deepmind.google/blog/", "/blog/"],
  ["Replit", "https://replit.com/blog", "/blog/"],
  ["Vercel", "https://vercel.com/changelog", "/changelog/", "https://vercel.com/atom"],
  ["AWS Kiro", "https://kiro.dev/blog/", "/blog/"],
  ["Tessl", "https://tessl.io/blog/", "/blog/"],
  ["Langfuse", "https://langfuse.com/blog", "/blog/"],
  ["Port", "https://www.port.io/blog", "/blog/"],
  ["Vercel Engineering", "https://vercel.com/blog", "/blog/"],
  ["LangChain", "https://www.langchain.com/blog", "/blog/"],
  ["Latent Space", "https://latent.space/podcast/", "/p/", null, "Perspective"],
  ["Software Engineering Daily", "https://softwareengineeringdaily.com/", "/podcasts/", "https://softwareengineeringdaily.com/feed/podcast/", "Perspective"],
];
const references = [
  ["Warp Learn", "https://www.warp.dev/learn"],
  ["Softwarefabrik", "https://softwarefabrik.io/en/news.html"],
  ["Warp Factories", "https://docs.warp.dev/factories/how-factories-work/"],
  ["Factory Droid", "https://docs.factory.com/changelog/release-notes"],
  ["Cursor CLI", "https://prod.cursor.com/docs/release-notes"],
  ["Google Antigravity", "https://antigravity.google/docs/changelog"],
  ["Tessl CLI", "https://docs.tessl.io/changelog-cli"],
  ["8090", "https://docs.8090.ai/resources/changelog"],
  ["Steve Yegge", "https://yegge.ai/"],
  ["Jeffrey Lee-Chan", "https://x.com/jleechan2015/status/2119218626293358612"],
  ["Lauren Tan", "https://ai.engineer/code/2026/talks/lauren-tan"],
];
const relevant = /\b(agent\w*|factory|harness|eval\w*|verification|approval|sandbox|runtime|workflow|observability|telemetry|specification|tool use|code review|production feedback|skills?|context|permission|codex|droid|copilot|orchestrat\w*)\b/i;
export const withdrawn = /zach|software-factory-as-code|aie-code-factory-engineering-keynote/i;
const clean = text => String(text || "").replace(/\s+/g, " ").trim();
const hostname = url => new URL(url).hostname.toLowerCase().replace(/^www\./, "");

export function canonical(url) {
  const u = new URL(url);
  u.hash = ""; u.search = "";
  u.hostname = u.hostname.replace(/^www\./, "");
  return u.href.replace(/\/$/, "").replace(/(arxiv\.org\/abs\/[\d.]+)v\d+$/i,"$1");
}

function iso(value) {
  if (!value) return "";
  const ms = Date.parse(value.trim().replace(/^(\d{4})\/(\d\d)\/(\d\d)$/, "$1-$2-$3"));
  return Number.isNaN(ms) ? "" : new Date(ms).toISOString().slice(0, 10);
}

async function fetchSource(url) {
  const originHost = hostname(url);
  for (let redirects = 0; redirects < 5; redirects++) {
    const u = new URL(url);
    if (u.protocol !== "https:" || u.username || u.password || u.port || hostname(url) !== originHost)
      throw new Error("redirect outside publisher");
    const res = await fetch(u, { redirect: "manual", signal: AbortSignal.timeout(18000),
      headers: { "User-Agent": "FDLC-Factory-Updates/1.0 (+https://fdlc.ai/updates)", Accept: "*/*",
        ...(u.hostname==="api.github.com" && process.env.GH_RELEASES_TOKEN ? {Authorization:"Bearer "+process.env.GH_RELEASES_TOKEN}: {}) } });
    if ([301,302,303,307,308].includes(res.status)) {
      const next = res.headers.get("location"); await res.body?.cancel();
      if (!next) throw new Error("redirect without location");
      url = new URL(next, u).href; continue;
    }
    if (!res.ok) { await res.body?.cancel(); throw new Error("HTTP " + res.status); }
    const chunks = []; let size = 0;
    for await (const chunk of res.body) {
      size += chunk.length;
      if (size > 8000000) throw new Error("source exceeds 8 MB");
      chunks.push(chunk);
    }
    return { url: res.url, body: Buffer.concat(chunks).toString("utf8") };
  }
  throw new Error("redirect limit");
}

async function pool(items, workers, fn) {
  const result = new Array(items.length); let i=0;
  await Promise.all(Array.from({ length: Math.min(workers, items.length) }, async () => {
    for (;;) { const index=i++; if (index>=items.length) return; result[index]=await fn(items[index]); }
  }));
  return result;
}

function article(doc) {
  for (const el of doc.querySelectorAll("script,style,nav,header,footer,svg,noscript,aside,form")) el.remove();
  const body = doc.querySelector("article") || doc.querySelector("main") || doc.querySelector("body") || doc;
  return clean(body.structuredText || body.text).slice(0, 16000);
}
function metadata(doc, name) {
  return doc.querySelector('meta[property="'+name+'"],meta[name="'+name+'"]')?.getAttribute("content") || "";
}
function safeLink(raw, index, prefix) {
  try {
    const u=new URL(raw,index);
    if (u.protocol!=="https:" || u.username || u.password || u.port || hostname(u.href)!==hostname(index) ||
        !u.pathname.startsWith(prefix) || canonical(u.href)===canonical(index) || withdrawn.test(u.href) ||
        /\/(tag|category|author|page|topics|feed)\//.test(u.pathname)) return null;
    u.hash="";u.search="";return u.href;
  } catch {return null;}
}

export async function collect(start, end, archive) {
  const inventory=[], candidates=[], seen=new Set(archive.map(x=>canonical(x.url)));
  const within=date=> Boolean(date && date>=start && date<=end);
  function add(row) {
    if (!within(row.date) || !row.title || row.text.length<120 || withdrawn.test([row.title,row.url,row.author].join(" ")) ||
        !relevant.test(row.title+" "+row.text.slice(0,1400)) || seen.has(canonical(row.url))) return;
    seen.add(canonical(row.url));
    candidates.push({...row, key:createHash("sha256").update(canonical(row.url)).digest("hex").slice(0,12)});
  }
  async function scan(publisher,url,fn) {
    const entry={publisher,url,status:"read"}; inventory.push(entry);
    try { await fn(entry); } catch(e) {entry.status="limited";entry.detail=String(e.message).slice(0,160);}
  }
  const jobs = releases.map(([publisher,repo])=>async()=> {
    const url="https://api.github.com/repos/"+repo+"/releases?per_page=70";
    await scan(publisher,url,async row=>{
      const records=JSON.parse((await fetchSource(url)).body); row.items=records.length;
      for(const r of records){
        if(r.prerelease || r.draft || !r.html_url?.startsWith("https://github.com/"+repo+"/releases/tag/")) continue;
        add({publisher,url:r.html_url,date:iso(r.published_at),title:repo+" "+r.tag_name,text:clean(r.body).slice(0,16000)});
      }
    });
  });
  for(const [publisher,index,prefix,feed,kind] of sites) jobs.push(async()=> {
    await scan(publisher,index,async row=>{
      const links=new Map();
      let page;
      if(feed) {
        try {
          const doc=parse((await fetchSource(feed)).body);
          for(const item of doc.querySelectorAll("entry,item")) {
            const link=item.querySelector('link[rel="alternate"]')||item.querySelector("link");
            const url=safeLink(link?.getAttribute("href")||link?.text,index,prefix);
            const date=iso(item.querySelector("published,pubDate")?.text);
            if(url && within(date))links.set(url,date);
          }
          row.feed=feed;
        } catch(e) {row.feedLimit=String(e.message);}
      }
      if(!links.size) {
        page=parse((await fetchSource(index)).body);
        const body=page.querySelector("main")||page;
        for(const a of body.querySelectorAll("a[href]")) {
          const url=safeLink(a.getAttribute("href"),index,prefix);
          if(url && clean(a.text).length>8 && !links.has(url)) links.set(url,"");
        }
      }
      const fresh=[...links].filter(([u])=>!seen.has(canonical(u))).slice(0,16);
      row.items=links.size; row.articlesRead=0;
      const details=await pool(fresh,2,async ([url,feedDate])=>{
        try {
          const res=await fetchSource(url),doc=parse(res.body);
          const title=clean(metadata(doc,"og:title")||doc.querySelector("h1")?.text);
          const date=iso(metadata(doc,"article:published_time")||metadata(doc,"datePublished")||
             doc.querySelector('[itemprop="datePublished"]')?.getAttribute("datetime"))||feedDate;
          const author=metadata(doc,"author")||metadata(doc,"article:author");
          row.articlesRead++; const text=article(doc);
          return {publisher,url:res.url,date,title,text,author,...(kind?{kind}:{})};
        }catch(e){(row.articleLimits??=[]).push({url,detail:String(e.message).slice(0,120)});}
      });
      for(const item of details) if(item)add(item);
    });
  });
  jobs.push(async()=> {
    const list="https://arxiv.org/list/cs.SE/recent";
    await scan("arXiv Software Engineering",list,async row=>{
      const page=parse((await fetchSource(list)).body);
      const paths=[...new Set(page.querySelectorAll("a[href]").map(a=>a.getAttribute("href")).filter(x=>/^\/abs\/\d{4}\.\d+$/.test(x)))];
      row.items=paths.length;
      const results=await pool(paths.filter(x=>!seen.has(canonical("https://arxiv.org"+x))).slice(0,40),2,async path=>{
        const url="https://arxiv.org"+path+"v1";
        try {
          const doc=parse((await fetchSource(url)).body);
          const title=clean(metadata(doc,"citation_title")), text=clean(doc.querySelector("blockquote.abstract")?.text);
          const authors=doc.querySelectorAll('meta[name="citation_author"]').map(a=>a.getAttribute("content"));
          return {title,text,date:iso(metadata(doc,"citation_date")),url,publisher:authors.length>1?authors[0]+" and colleagues":authors[0]||"arXiv authors"};
        } catch(e){(row.articleLimits??=[]).push({url,detail:String(e.message).slice(0,120)});}
      });
      for(const item of results) if(item)add(item);
    });
  });
  for(const [publisher,url] of references) jobs.push(async()=> {
    await scan(publisher,url,async row=>{
      const doc=parse((await fetchSource(url)).body);
      row.title=clean(doc.querySelector("title")?.text).slice(0,200);
      if(!row.title || /Just a moment|Access denied|Verifying|Browser check/i.test(row.title))throw new Error("publisher challenge");
      // Living guides and operator profiles remain context unless a dated, specific work is available.
      row.context=article(doc).slice(0,450);
    });
  });
  await pool(jobs,5,job=>job());
  inventory.sort((a,b)=>a.url.localeCompare(b.url));
  candidates.sort((a,b)=>b.date.localeCompare(a.date)||a.url.localeCompare(b.url));
  const read=inventory.filter(x=>x.status==="read");
  if(read.length<Math.ceil(inventory.length/2) || !read.some(x=>x.url.startsWith("https://api.github.com")) ||
     !read.some(x=>Object.hasOwn(x,"articlesRead")&&x.articlesRead>0)) throw new Error("Insufficient primary-source coverage: "+read.length+"/"+inventory.length);
  return {start,end,inventory,candidates};
}
