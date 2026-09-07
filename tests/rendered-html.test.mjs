import assert from "node:assert/strict";
import test from "node:test";

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
const { default: worker } = await import(workerUrl.href);

function render(pathname = "/", method = "GET") {
  return worker.fetch(new Request(`http://localhost${pathname}`, { method, headers: { accept: "text/html" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
}

const routes = ["/", "/framework", "/architecture", "/in-5-minutes", "/manifesto", "/mission-control", "/specification", "/maturity", "/benchmarks", "/enterprise", "/deploy", "/start", "/about"];

test("global More stays focused while contextual artifacts remain discoverable", async () => {
  const expected = ["FDLC in 5 Minutes", "Manifesto", "Start", "Enterprise", "About"];
  for (const route of routes) {
    const html = await (await render(route)).text();
    const header = html.match(/<header class="site-header">[\s\S]*?<\/header>/)?.[0];
    assert.ok(header, route);
    const more = header.match(/id="more-navigation"[^>]*>([\s\S]*?)<\/div>/)?.[1];
    const mobileMore = header.match(/<span>More<\/span>([\s\S]*?)<\/nav>/)?.[1];
    for (const menu of [more, mobileMore]) {
      assert.ok(menu, route);
      assert.deepEqual([...menu.matchAll(/<a\b[^>]*>([^<]+)<\/a>/g)].map((match) => match[1]), expected, route);
    }
    assert.doesNotMatch(header, /href="\/(?:spec|specification|benchmarks)"/, route);
    if (["/specification", "/benchmarks"].includes(route)) {
      assert.doesNotMatch(header, /nav-dropdown is-active|aria-current="page"/, route);
    }
  }
  for (const [route, href] of [["/framework", "/specification"], ["/maturity", "/benchmarks"], ["/deploy", "/benchmarks"]]) {
    const html = await (await render(route)).text();
    const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1];
    assert.ok(main?.includes(`href="${href}"`), `${route} links contextually to ${href}`);
    assert.equal((await render(href)).status, 200);
  }
  const sitemap = await (await render("/sitemap.xml")).text();
  for (const route of ["/specification", "/benchmarks"]) assert.ok(sitemap.includes(route));
});

test("server-renders every public route with FDLC metadata and a heading", async () => {
  for (const route of routes) {
    const response = await render(route);
    assert.equal(response.status, 200, route);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i, route);
    const html = await response.text();
    assert.match(html, /<title>.*FDLC\.ai<\/title>/i, route);
    assert.match(html, /<h1[\s>]/i, route);
    assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i, route);
  }
});

test("benchmarks publishes the incoming measurement contract and mode-correct Guide links", async () => {
  const response = await render("/benchmarks");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /id="comparable-results"/);
  assert.match(html, /Verification and acceptance use separate denominators/);
  assert.match(html, /Missing cost is not zero; no successful outcomes means the ratio is undefined/);
  assert.match(html, /A failed authority or security gate cannot be averaged away/);
  for (const href of [
    "/guide/02-design/09-tokenomics-and-factory-economics",
    "/guide/04-prove/29-evaluation-engineering",
  ]) assert.ok(html.includes(`<a href="${href}">`), href);
});

test("robots explicitly permits search and AI fetch agents", async () => {
  const response = await render("/robots.txt");
  assert.equal(response.status, 200);
  const body = await response.text();

  for (const userAgent of ["Google-Extended", "GPTBot", "ChatGPT-User", "OAI-SearchBot", "*"]) {
    assert.match(body, new RegExp(`User-Agent: ${userAgent.replace("*", "\\*")}\\nAllow: /`, "i"));
  }
  assert.doesNotMatch(body, /Disallow:\s*\//i);
});

test("homepage answers the category boundary and links to primary destinations", async () => {
  const response = await render("/");
  const html = await response.text();
  assert.match(html, /<section class="hero-shell">[\s\S]*?Factory Development Lifecycle \(FDLC\)[\s\S]*?is the process for designing, assembling, governing, operating, measuring, and continuously improving[\s\S]*?<\/section>/i);
  assert.match(html, /Build the factory that builds your software/i);
  assert.match(html, /SDLC.*Governs the lifecycle of.*software.*FDLC.*Governs the lifecycle of the.*factory that builds it/is);
  assert.match(html, /Verified delivery, not merely generated code/i);
  assert.match(html, /Autonomy without evidence is just faster guessing/i);
  assert.match(html, /Traditional SDLC.*AI-Native SDLC.*FDLC.*Software \+ AI-assisted workflow.*The software factory/is);
  assert.match(html, /FDLC is the lifecycle for the factory itself/i);
  assert.match(html, /Intelligence may vary.*Authority remains explicit.*Evidence must return/is);
  assert.match(html, /Receive.*Specify.*Plan.*Execute.*Verify.*Approve.*Release.*Observe.*Learn/is);
  assert.match(html, /Interactive factory explorer.*Choose a stage.*inspect the capabilities it activates/is);
  assert.match(html, /Does the exact candidate satisfy the specification.*Evidence required.*independent checks/is);
  assert.match(html, /participate at/i);
  assert.match(html, /Active capabilities are marked in green/i);
  assert.match(html, /Agents.*Models.*Skills.*Tools.*Context.*Runtime.*Policy.*Evals.*Observability.*Human control/is);
  assert.match(html, /Evals.*Test the exact candidate/is);
  assert.match(html, /Participates at/i);
  assert.match(html, /href=["']\/architecture#trust["']/i);
  assert.match(html, /Discover.*Design.*Assemble.*Validate.*Deploy.*Operate.*Improve/is);
  assert.match(html, /Continuous controls.*Govern.*Secure.*Observe.*Measure/is);
  assert.match(html, /Intent.*Specification.*Plan.*Work Order.*Attempt.*Evidence.*Verification.*Approval.*Release.*Outcome.*Learning Signal/is);
  assert.match(html, /FDLC.*Defines it.*Mission Control.*Demonstrates it.*The Guide.*Teaches it/is);
  for (const href of ["/framework", "/architecture", "/in-5-minutes", "/guide", "/mission-control", "/maturity", "/start"]) assert.match(html, new RegExp(`href=["']${href}["']`));
});

test("framework publishes the exact category definition and distinction", async () => {
  const html = await (await render("/framework")).text();
  assert.match(html, /The Factory Development Lifecycle is the process for designing, assembling, governing, operating, measuring, and continuously improving an AI software factory/i);
  assert.match(html, /factory operating system.*agents, models, tools, people, policies, evidence, and workflows/is);
  assert.match(html, /Traditional SDLC.*How do we build software.*AI-Native SDLC.*How does AI change software development.*FDLC.*How do we engineer the factory/is);
  assert.match(html, /SDLC.*AI-Native SDLC.*Agents move beyond code generation.*planning, design, implementation, testing, deployment, and maintenance/is);
  assert.match(html, /AI-Native SDLC.*AI Software Factory.*persistent, orchestrated production systems/is);
  assert.match(html, /Code generation is no longer the bottleneck.*Process is/is);
  assert.match(html, /Who defines intent.*What agent may act.*What evidence proves.*producing agent certify.*When must a human intervene.*learning the wrong thing/is);
  assert.match(html, /Not another coding agent.*The control system around them/is);
  assert.match(html, /FDLC Framework.*FDLC Specification.*AI Software Factory Guide.*Mission Control.*FDLC Enterprise/is);
  assert.match(html, /Six operating shifts.*Intent becomes the interface.*Intelligence becomes routable.*Harness becomes the control boundary.*Verification becomes the scarce resource.*Evidence becomes part of the deliverable.*Learning becomes governed promotion/is);
  assert.match(html, /Choose the next depth you need.*FDLC in 5 Minutes.*Architecture.*Manifesto.*Mission Control.*Maturity.*Guide/is);
});

test("architecture makes the control boundary and durable operating record explicit", async () => {
  const html = await (await render("/architecture")).text();
  assert.match(html, /Intelligence can change.*Authority cannot be implicit/is);
  assert.match(html, /Intelligence supply.*Models reason.*Agents act.*Factory control plane.*factory governs.*Execution environment.*Effects stay bounded/is);
  assert.match(html, /Authority flows down.*Allow intelligence to vary.*Always bound authority.*Evidence flows back/is);
  assert.match(html, /Expected to change.*Models.*agents.*skills.*prompts.*tool adapters.*Required to persist.*Intent.*identity.*authority.*state.*evidence.*decisions.*outcomes/is);
  assert.match(html, /Every Attempt returns attributable evidence.*No producing system may promote its own result/is);
  assert.match(html, /href=["']#control-boundary["']/i);
});

test("Guide rollback shadow points only to the canonical same-origin Guide", async () => {
  const html = await (await render("/guide")).text();
  assert.match(html, /Build the system around the agent/i);
  assert.match(html, /44<\/strong> chapters.*6<\/strong> parts.*8<\/strong> Guide stages/is);
  assert.match(html, /complete 44-chapter Guide is part of FDLC\.ai.*owns every route under.*\/guide/is);
  assert.match(html, /href=["']\/guide\/01-understand\/02-the-factory-in-one-view["']/i);
  assert.match(html, /href=["']\/guide\/search["']/i);
  assert.doesNotMatch(html, /ai-software-factory-mastery\.vercel\.app|href=["']\/docs\//i);
});

test("global navigation exposes the canonical Guide disclosure in desktop and mobile shells", async () => {
  const html = await (await render("/guide")).text();
  const header = html.match(/<header class="site-header">[\s\S]*?<\/header>/)?.[0];
  assert.ok(header, "renders the persistent FDLC global header");
  for (const label of ["Framework", "Architecture", "Guide", "Mission Control", "FDE", "Maturity", "More"]) {
    assert.match(header, new RegExp(`>${label}(?:\\s|<)`), label);
  }
  for (const [label, href] of [
    ["Overview", "/guide"],
    ["Atlas", "/guide/atlas"],
    ["Reference", "/guide/topics"],
    ["Glossary", "/guide/glossary"],
    ["Search", "/guide/search"],
  ]) {
    assert.equal([...header.matchAll(new RegExp(`href="${href}"[^>]*>${label}<`, "g"))].length, 2, `${label} exists in desktop and mobile navigation`);
  }
  assert.match(header, /<button aria-controls="guide-navigation" aria-expanded="false"[^>]*>Guide/);
  assert.match(header, /<button aria-controls="mobile-guide-navigation" aria-expanded="true" class="is-active"[^>]*>Guide/);
  for (const id of ["guide-navigation", "more-navigation", "mobile-navigation", "mobile-guide-navigation"]) {
    assert.equal([...header.matchAll(new RegExp(`id="${id}"`, "g"))].length, 1, `${id} is unique`);
  }
});

test("manifesto publishes the ten operating invariants and the state boundary", async () => {
  const html = await (await render("/manifesto")).text();
  assert.match(html, /Autonomy is useful only when it can be .*trusted/i);
  assert.match(html, /Operating principles.*10.*State boundaries.*05.*Unit of value.*Verified outcomes/is);
  assert.match(html, /operating invariants of the Factory Development Lifecycle/i);
  assert.match(html, /Mission Control, another control plane, or your own implementation/i);
  assert.match(html, /The ten principles.*Read in sequence or jump directly.*Explicit intent.*Governed plans.*Bounded authority.*Safe execution.*Independent verification.*Evidence gates.*Earned autonomy.*Human judgment.*Governed learning.*Verified outcomes/is);
  assert.match(html, /Intent must be explicit.*Plan is a governed artifact.*Every agent has an identity.*Execution must be isolated.*Producers should not be their only verifier.*State transitions require evidence.*Autonomy must be earned.*Human attention belongs.*Learning must come from validated outcomes.*value of a factory is measured in verified outcomes/is);
  assert.match(html, /Execution complete.*Verified.*Approved.*Released.*Outcome proven/is);
  assert.match(html, /distinct states with distinct owners and evidence requirements.*faster guessing/is);
  for (let principle = 1; principle <= 10; principle += 1) assert.match(html, new RegExp(`href=["']#principle-${principle}["']`));
  for (const href of ["/in-5-minutes", "/framework", "/architecture", "/mission-control"]) assert.match(html, new RegExp(`href=["']${href}["']`));
});

test("worked example connects all four models without claiming production proof", async () => {
  const html = await (await render("/in-5-minutes")).text();
  assert.match(html, /FDLC in 5 Minutes/i);
  assert.match(html, /The Factory Development Lifecycle is the process for designing, assembling, governing, operating, measuring, and continuously improving an AI software factory/i);
  assert.match(html, /This page walks one concrete factory line.*dependency modernization.*turns intent into independently verified software/is);
  assert.match(html, /This is not a product tour.*concrete walkthrough of the Factory Development Lifecycle/is);
  assert.match(html, /Illustrative records and targets.*not a production case study or benchmark result/is);
  assert.match(html, /One workflow.*Four system views.*Eleven artifacts.*One measurable outcome/is);
  assert.match(html, /Baseline.*illustrative.*Cycle time.*Human review minutes.*Reopen.*rollback risk.*Escaped defect potential/is);
  assert.match(html, /Discover.*Design.*Assemble.*Validate.*Deploy.*Operate.*Improve/is);
  assert.match(html, /Receive.*Specify.*Plan.*Execute.*Verify.*Approve.*Release.*Observe.*Learn/is);
  assert.match(html, /INT-104.*SPEC-104-R1.*PLAN-104-R2.*WO-104-01.*ATT-104-03.*EVD-104-09.*VER-104-02.*APR-104-01.*REL-104-01.*OUT-104-01.*LS-104-01/is);
  assert.match(html, /Command Center.*Work Order.*Audit and evidence/is);
  assert.match(html, /Evidence Envelopes.*Independent verification.*Human acceptance/is);
  assert.match(html, /Cost per verified outcome.*First-pass verification rate.*Reopen.*rollback rate/is);
  assert.match(html, /accepted dependency upgrades.*eligible dependency-upgrade missions/is);
  assert.match(html, /canonical example.*not a certification of production readiness.*discipline is open.*value is determined by verified outcomes/is);
  for (const href of ["/framework", "/maturity", "/mission-control#quickstart", "/deploy"]) assert.match(html, new RegExp(`href=["']${href}["']`));
});

test("legacy worked-example route redirects to the canonical five-minute path", async () => {
  const response = await render("/examples/dependency-modernization");
  assert.equal(response.status, 308);
  assert.equal(new URL(response.headers.get("location"), "http://localhost").pathname, "/in-5-minutes");
});

test("legacy specification route redirects to the canonical path", async () => {
  const response = await render("/spec?source=old&tag=one&tag=two");
  assert.equal(response.status, 308);
  const location = new URL(response.headers.get("location"), "http://localhost");
  assert.equal(location.pathname, "/specification");
  assert.equal(location.searchParams.get("source"), "old");
  assert.deepEqual(location.searchParams.getAll("tag"), ["one", "two"]);
});

test("discovery metadata separates the composed Guide sitemap", async () => {
  const sitemap = await (await render("/sitemap.xml")).text();
  assert.match(sitemap, /https:\/\/www\.fdlc\.ai\/specification/);
  assert.doesNotMatch(sitemap, /https:\/\/www\.fdlc\.ai\/guide|https:\/\/www\.fdlc\.ai\/spec<\/loc>/);
  const robots = await (await render("/robots.txt")).text();
  assert.match(robots, /Sitemap: https:\/\/www\.fdlc\.ai\/sitemap\.xml/i);
  assert.match(robots, /Sitemap: https:\/\/www\.fdlc\.ai\/guide\/sitemap\.xml/i);
});

test("core technical pages preserve distinct delivery states", async () => {
  for (const route of ["/framework", "/architecture", "/mission-control"]) {
    const html = await (await render(route)).text();
    assert.match(html, /Execution complete.*Verified.*Approved.*Released.*Outcome proven/is, route);
  }
});

test("mission control leads with the product and exposes an interactive governed path", async () => {
  const html = await (await render("/mission-control")).text();
  assert.match(html, /Governed autonomous delivery/i);
  assert.match(html, /Mission Control is the reference implementation of the Factory Development Lifecycle/i);
  assert.match(html, /Not another coding agent.*what agents may do.*what evidence must return/is);
  assert.match(html, /Governed delivery trace.*Define.*Authorize.*Execute.*Verify.*Decide.*Observe/is);
  assert.match(html, /What outcome is required.*what would prove success/is);
  assert.match(html, /Command Center.*Work Orders.*Approvals &amp; Audit/is);
  assert.match(html, /Inspect what is real.*where it stops/is);
  assert.match(html, /Available.*Experimental.*Planned/is);
  assert.match(html, /One exact Context7 query-docs read.*One fixed public React query only.*harness-native MCP remain unsupported/is);
});

test("long technical pages expose the requested rail and tablet jump navigation", async () => {
  for (const route of ["/framework", "/architecture"]) {
    const html = await (await render(route)).text();
    assert.match(html, /page-contents is-rail/i, route);
    assert.match(html, /Jump to (?:section|area)/i, route);
  }
  const architecture = await (await render("/architecture")).text();
  assert.match(architecture, /Expand area.*Collapse area/is);
  assert.match(architecture, /See in Mission Control/is);
});

test("interactive routes have complete server-rendered entry states", async () => {
  const maturity = await (await render("/maturity")).text();
  assert.match(maturity, /Start assessment/);
  assert.match(maturity, /results stay in this browser session/i);
  const start = await (await render("/start")).text();
  assert.match(start, /What engineering outcome are you trying to produce/i);
  assert.match(start, /Factory Definition/i);
});

test("FDE publishes the qualification state and its dormant live boundary", async () => {
  const html = await (await render("/deploy")).text();
  assert.match(html, /Factory Deployed Engineer \(FDE\)/i);
  assert.match(html, /Build your software factory.*Factory Deployed Engineer/is);
  assert.match(html, /works inside your engineering environment.*identify the right automation opportunity.*design the Factory Definition.*assemble the governed production line.*prove it against real outcomes/is);
  assert.match(html, /Not another coding agent.*Not a consulting deck.*working factory line/is);
  assert.match(html, /Humans lead.*Digital workers execute/is);
  assert.match(html, /Factory Deployed Engineer.*Discovery.*Architecture.*Trust boundaries.*Digital workers.*Implementation.*Evidence collection.*Mission Control.*Authority.*Recovery.*Economics/is);
  assert.match(html, /FDLC.*Defines the operating model.*The Guide.*Teaches the practices.*Mission Control.*Governs execution.*Factory Deployed Engineer.*Applies the system.*Factory line.*Solves a real workflow.*Outcomes.*Prove whether it worked/is);
  assert.match(html, /What a Factory Deployed Engineer does.*Discover.*Define.*Assemble.*Qualify.*Operate.*Transfer &amp; Scale/is);
  assert.match(html, /Factory Definition.*Intent.*Workflow.*Agents.*Models.*Tools.*Context.*Execution.*Verification.*Policy.*Human Authority.*Economics.*Outcomes/is);
  assert.match(html, /Three phases.*One evidence trail/is);
  assert.match(html, /FDLC Readiness.*qualified Lighthouse candidate/is);
  assert.match(html, /FDLC Lighthouse.*Evidence that the operating model works—or evidence that it does not/is);
  assert.match(html, /FDLC Scale.*conditional on Lighthouse evidence/is);
  assert.match(html, /What you leave with.*Governed production line.*Mission Control configuration.*Evaluation suite.*Verification contract.*Outcome baseline.*Economics model.*Operating playbook.*Reusable capabilities.*Scale roadmap/is);
  assert.match(html, /Dependency modernization.*API migration.*Vulnerability remediation.*Quality remediation.*Documentation maintenance.*Code review assistance.*Test modernization.*Framework migration.*CI\/CD remediation/is);
  assert.match(html, /Good first factory lines have.*Bounded scope.*Independent verification.*Safe rollback.*Build our next product autonomously/is);
  assert.match(html, /Before FDE.*Human receives work.*After factory line.*Governed planning.*Measured outcome/is);
  assert.match(html, /Representative Lighthouse.*Dependency modernization.*Illustrative contract—no performance result claimed.*Independent verification.*human release authority/is);
  assert.match(html, /Prove the factory with outcomes.*Cycle time.*Human engineering minutes.*Defect escape rate.*Cost per released outcome/is);
  assert.match(html, /From developers to builders.*Managers increasingly lead humans.*digital workers/is);
  assert.match(html, /The FDE.*Software architecture.*AI \/ agent engineering.*Change leadership.*Operating-model design/is);
  assert.match(html, /You bring.*We build together.*You keep.*The factory line.*The operating playbook.*ability to scale/is);
  assert.match(html, /Autonomy without abdicating control.*See what ran, why it advanced, and how to recover.*Mission Control gives the team visibility.*Agents may propose.*Humans retain consequential authority/is);
  assert.match(html, /Bring one real workflow.*current baseline/is);
  assert.match(html, /Production.*Qualified \/ Healthy/is);
  assert.match(html, /Qualification environment.*Ready/is);
  assert.match(html, /083665737366.*us-east-1.*qual\.factory-engineer\.fdlc\.ai/is);
  assert.match(html, /calm-buffalo-854.*mission-control:\/\/qualification\/fdlc-phase-3/is);
  assert.match(html, /dpl_BHi24iX4NmZZ8WNyuspDHaYg5DX2/is);
  assert.match(html, /dpl_3dH5VgLN9abgG9B8L9vdGKNnHiCn/is);
  assert.match(html, /Immutable ECR image digests.*secret-version references are pinned/is);
  assert.match(html, /Phase 3.*Dormant \/ Not activated/is);
  assert.match(html, /Bedrock live calls.*0/is);
  assert.match(html, /Qualification-ready infrastructure is not live qualification/is);
  assert.match(html, /href=["']\/deploy["'][^>]*>FDE</i);
});

test("preview products are explicitly labeled", async () => {
  for (const route of ["/specification", "/benchmarks", "/enterprise", "/deploy"]) {
    const html = await (await render(route)).text();
    assert.match(html, /Proposed|Design partner/i, route);
  }
});
