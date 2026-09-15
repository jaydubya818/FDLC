import assert from "node:assert/strict";
import test from "node:test";

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
const { default: worker } = await import(workerUrl.href);

function render(pathname = "/", method = "GET") {
  return worker.fetch(new Request(`http://localhost${pathname}`, { method, headers: { accept: "text/html" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
}

const routes = ["/", "/framework", "/architecture", "/in-5-minutes", "/manifesto", "/mission-control", "/specification", "/maturity", "/benchmarks", "/enterprise", "/deploy", "/start", "/about"];

test("corpus preview renders a noindex catalog without entering the public sitemap", async () => {
  const response = await render("/corpus-preview");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Find the guidance you need to build a trustworthy software factory/i);
  assert.match(html, /Choose a path through FDLC/i);
  assert.match(html, /What the library gives the community/i);
  assert.match(html, /Search the full library/i);
  assert.match(html, /158<\/strong>.*Manifest-backed routes/is);
  assert.match(html, /Review candidate.*not FDLC canon/i);
  assert.doesNotMatch(html, /Corpus catalog|read the corpus/i);
  for (const href of [
    "/corpus-preview/start",
    "/corpus-preview/guides/build-your-first-factory",
    "/corpus-preview/architecture/authority",
    "/corpus-preview/enterprise/adoption",
  ]) assert.match(html, new RegExp(`href="${href}"`));
  assert.match(html, /name="robots" content="noindex, nofollow/i);
  const sitemap = await (await render("/sitemap.xml")).text();
  assert.doesNotMatch(sitemap, /corpus-preview/);
  const robots = await (await render("/robots.txt")).text();
  assert.match(robots, /Disallow: \/corpus-preview\//);
});

test("corpus documents share link and custom-anchor behavior while canonical pages stay unchanged", async () => {
  const framework = await render("/corpus-preview/framework");
  assert.equal(framework.status, 200);
  const frameworkHtml = await framework.text();
  assert.match(frameworkHtml, /The FDLC Framework/);
  assert.match(frameworkHtml, /Learning Library Preview/);
  assert.doesNotMatch(frameworkHtml, /Corpus catalog/i);
  assert.match(frameworkHtml, /href="\/corpus-preview\/architecture\/execution-vocabulary"/);
  assert.match(frameworkHtml, /content="noindex, nofollow/i);
  const start = await (await render("/corpus-preview/start")).text();
  assert.match(start, /id="builder"/);
  const canonicalFramework = await (await render("/framework")).text();
  assert.match(canonicalFramework, /Six operating shifts/i);
  assert.doesNotMatch(canonicalFramework, /Draft corpus preview/i);
});

test("first-factory quickstart separates a beginner definition from the production blueprint", async () => {
  const quickstartResponse = await render("/corpus-preview/guides/build-your-first-factory");
  assert.equal(quickstartResponse.status, 200);
  const quickstart = await quickstartResponse.text();
  assert.match(quickstart, /Build your first factory: guided quickstart/i);
  assert.match(quickstart, /A factory is built in stages/i);
  assert.match(quickstart, /Define one factory.*10 minutes.*Inspect a governed run.*30–45 minutes/is);
  assert.match(quickstart, /href="https:\/\/fdlc\.ai\/start#factory-builder"/);
  assert.match(quickstart, /pnpm run dev:demo/);
  assert.match(quickstart, /pnpm run convex:seed:demo:force/);
  assert.match(quickstart, /http:\/\/localhost:5199\/v2\/command-center/);
  assert.match(quickstart, /Execute Code Review Wizard Automation/);
  assert.match(quickstart, /seeded fixtures.*not a live agent execution/is);
  assert.match(quickstart, /<pre aria-label="Scrollable code example" tabindex="0">/);
  assert.match(quickstart, /href="\/corpus-preview\/guides\/production-bounded-fix-factory"/);

  const blueprintResponse = await render("/corpus-preview/guides/production-bounded-fix-factory");
  assert.equal(blueprintResponse.status, 200);
  const blueprint = await blueprintResponse.text();
  assert.match(blueprint, /Production bounded-fix factory blueprint/i);
  assert.match(blueprint, /not a copy-and-run sample application/i);
  assert.match(blueprint, /Factory Manifest/i);
  assert.match(blueprint, /Verification contract/i);
  assert.match(blueprint, /Sandbox.*worktree-only/is);
  assert.match(blueprint, /href="\/corpus-preview\/guides\/build-your-first-factory"/);
});

test("corpus raw artifacts are allowlisted and unknown targets fail closed", async () => {
  const schema = await render("/corpus-artifacts/corpus/specification/schemas/intent.schema.json");
  assert.equal(schema.status, 200);
  assert.match(schema.headers.get("content-type") ?? "", /^application\/json/);
  assert.equal(schema.headers.get("x-content-type-options"), "nosniff");
  assert.match(await schema.text(), /fdlc:\/\/v1\/intent/);
  assert.equal((await render("/corpus-artifacts/corpus/specification/schemas/not-real.schema.json")).status, 404);
  assert.equal((await render("/corpus-preview/not-a-real-document")).status, 404);
});

test("global More exposes the preview while contextual artifacts remain focused", async () => {
  const expected = ["In 5 Minutes", "Start", "Learning Library (Preview)", "Manifesto", "Enterprise", "About"];
  for (const route of routes) {
    const html = await (await render(route)).text();
    const header = html.match(/<header class="global-header">[\s\S]*?<\/header>/)?.[0];
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
  const previewHeader = (await (await render("/corpus-preview")).text()).match(/<header class="global-header">[\s\S]*?<\/header>/)?.[0];
  assert.match(previewHeader ?? "", /nav-dropdown is-active/);
  assert.match(previewHeader ?? "", /<a(?=[^>]*aria-current="page")(?=[^>]*href="\/corpus-preview")[^>]*>Learning Library \(Preview\)<\/a>/);
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
  assert.doesNotMatch(body, /Disallow:\s*\/(?:\s|$)/i);
  assert.match(body, /Disallow: \/corpus-preview\//i);
});

test("homepage answers the category boundary and links to primary destinations", async () => {
  const response = await render("/");
  const html = await response.text();
  assert.match(html, /<section class="hero-shell">[\s\S]*?Factory Development Lifecycle \(FDLC\)[\s\S]*?Code generation is becoming abundant\. Trusted autonomous software delivery is not\.[\s\S]*?operating model and technical foundation[\s\S]*?<\/section>/i);
  assert.match(html, /Build the factory that builds your software/i);
  assert.match(html, /For engineering leaders, platform teams, software-factory architects, and builders/i);
  assert.match(html, /SDLC.*Governs the lifecycle of.*software.*FDLC.*Governs the.*factory that builds it/is);
  assert.match(html, /Verified delivery, not merely generated code/i);
  assert.match(html, /Autonomy without evidence is just faster guessing/i);
  assert.match(html, /One illustrative example.*Modernize a dependency without surrendering control/is);
  assert.match(html, /Intent.*Factory.*Evidence.*Outcome/is);
  assert.match(html, /Plan.*Modify.*Test.*Verify.*Approve/is);
  assert.match(html, /Choose the next useful step/i);
  assert.match(html, /Understand.*Assess.*Build.*Read/is);
  assert.doesNotMatch(html, /Explore the Learning Library \(Preview\)/i);
  assert.match(html, /Need help applying FDLC.*Start with one bounded factory line/is);
  assert.match(html, /id="factory-explorer"/);
  assert.match(html, /Open on Framework/);
  for (const href of ["/framework", "/architecture", "/in-5-minutes", "/guide", "/mission-control", "/maturity", "/start", "/corpus-preview"]) assert.match(html, new RegExp(`href=["']${href}["']`));
  const homeHeader = html.match(/<header class="global-header">[\s\S]*?<\/header>/)?.[0] ?? "";
  const homeMain = html.match(/<main\b[^>]*>[\s\S]*?<\/main>/)?.[0] ?? "";
  const homeFooter = html.match(/<footer class="global-footer">[\s\S]*?<\/footer>/)?.[0] ?? "";
  assert.equal([...homeHeader.matchAll(/href="\/corpus-preview"/g)].length, 2, "desktop and mobile navigation expose the preview");
  assert.equal([...homeMain.matchAll(/href="\/corpus-preview"/g)].length, 0, "homepage primary path does not promote the preview");
  assert.equal([...homeFooter.matchAll(/href="\/corpus-preview"/g)].length, 1, "footer exposes the preview");
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
  assert.match(html, /Intelligence supply.*Models reason.*Agents act.*Factory control plane.*factory governs.*Governed execution.*Operation stays bounded/is);
  assert.match(html, /Authority flows down.*Allow intelligence to vary.*Always bound authority.*Evidence flows back/is);
  assert.match(html, /Expected to change.*Models.*agents.*skills.*prompts.*tool adapters.*Required to persist.*Intent.*identity.*authority.*state.*evidence.*decisions.*outcomes/is);
  assert.match(html, /Every Attempt returns attributable evidence.*No producing system may promote its own result/is);
  assert.match(html, /href=["']#control-boundary["']/i);
  assert.match(html, /href=["']#execution-vocabulary["']/i);
  assert.match(html, /Canonical execution vocabulary.*Model.*Agent Loop.*Agentic SDK.*Agent Harness.*Work Graph.*Orchestrator.*Runtime.*Sandbox.*Capability Implementation.*Control Plane.*Factory/is);
  assert.match(html, /Harness may enforce a local rule.*Control Plane owns.*authority/is);
  assert.match(html, /Agentic systems architecture.*construction toolkit.*does not become the system/is);
  assert.match(html, /Control Plane.*Orchestrator.*Agentic SDK.*Agent Harness.*Agent.*Model/is);
  assert.match(html, /SDK guardrails can enforce behavior.*do not establish enterprise authority/is);
  assert.match(html, /Control Plane and factory coordination/i);
  assert.match(html, /Coding Harness and capability implementation/i);
  assert.match(html, /Fab · Experimental/i);
  assert.match(html, /Fab has no independent acceptance, publication, or Control Plane authority/is);
  assert.match(html, /href=["']\/guide\/appendix\/execution-boundaries-and-terminology#agentic-sdk-toolkit-not-authority["']/i);
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
  const header = html.match(/<header class="global-header">[\s\S]*?<\/header>/)?.[0];
  assert.ok(header, "renders the persistent FDLC global header");
  for (const label of ["Framework", "Architecture", "Guide", "AI-FDE", "Mission Control", "Maturity", "More"]) {
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
  for (const href of ["/#factory-explorer", "/start", "/mission-control"]) assert.match(html, new RegExp(`href=["']${href}["']`));
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
  assert.match(sitemap, /https:\/\/fdlc\.ai\/specification/);
  assert.doesNotMatch(sitemap, /https:\/\/fdlc\.ai\/guide|https:\/\/fdlc\.ai\/spec<\/loc>/);
  const robots = await (await render("/robots.txt")).text();
  assert.match(robots, /Sitemap: https:\/\/fdlc\.ai\/sitemap\.xml/i);
  assert.match(robots, /Sitemap: https:\/\/fdlc\.ai\/guide\/sitemap\.xml/i);
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
  assert.match(html, /Canonical Factory admission.*deterministic synthetic path.*live autonomous delivery remains unqualified/is);
  assert.match(html, /Factory Version.*Execution Profile.*WorkOrder.*Readiness.*Task.*Attempt.*Unpublished Candidate.*Verification Subject.*Verifier Attempt.*Evidence.*Human Authority/is);
  assert.match(html, /Readiness.*derived determination.*never a manually asserted READY flag/is);
  assert.match(html, /No external model calls, publication, acceptance, or Production mutation occurred/is);
  assert.match(html, /Development priorities.*Proposed.*Prove one complete operating loop, then expand/is);
  assert.match(html, /real outcome inspectable.*route eligibility.*safe improvement.*broader coordination/is);
});

test("architecture publishes six practical system-design decisions", async () => {
  const html = await (await render("/architecture")).text();
  assert.match(html, /id="design-decisions"/);
  for (const decision of [
    "Qualify the plan before dispatch",
    "Separate routing from scheduling",
    "Recover without repeating consequences",
    "Keep evidence current and independent",
    "Measure acceptance and observed value separately",
    "Promote and revoke exact factory versions",
  ]) assert.match(html, new RegExp(decision, "i"));
  assert.match(html, /Problem.*Architectural decision.*Why it exists.*Governing invariant.*Failure behavior.*Maturity and implementation.*Evidence required.*Implementation relationship/is);
  assert.match(html, /planner.*replaceable intelligence.*Plan revision.*governed artifact/is);
  assert.match(html, /ACTUAL.*ESTIMATED.*UNKNOWN/is);
  assert.match(html, /Learning creates Improvement Candidates.*cannot mutate or activate Production/is);
  assert.match(html, /href="\/guide\/appendix\/factory-system-design-playbook"/);
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

test("AI-FDE publishes the product model and its synthetic boundary", async () => {
  const html = await (await render("/deploy")).text();
  assert.match(html, /AI-FDE — AI Factory Deployed Engineer/i);
  assert.match(html, /Design your.*software factory/is);
  assert.match(html, /Use AI-FDE.*reviewed Factory Definition.*accountable human Factory Deployed Engineer.*Mission Control qualifies the runtime/is);
  assert.match(html, /Evidence.*Reviewed design.*Runtime qualification.*Internal alpha/is);
  assert.match(html, /AI-FDE assists.*human FDE remains accountable/is);
  assert.match(html, /Factory Deployed Engineer.*Discovery.*Architecture.*Trust boundaries.*AI-FDE.*Evidence ingestion.*Candidate claims.*Mission Control.*Authority.*Recovery.*Economics/is);
  assert.match(html, /FDLC.*Defines the operating model.*AI-FDE.*Discovers and designs it.*Human FDE.*Owns it.*Mission Control.*Governs it.*Factory.*Executes it.*Outcome.*Proves it/is);
  assert.match(html, /How AI-FDE works.*Discover.*Define.*Assemble.*Qualify.*Operate.*Transfer &amp; Scale/is);
  assert.match(html, /Factory Definition.*Objective.*Workflow.*Source lineage.*Capabilities.*Context.*Execution.*Authority.*Verification.*Economics.*Reliability.*Outcomes.*Readiness/is);
  assert.match(html, /Three phases.*One evidence trail/is);
  assert.match(html, /FDLC Readiness.*qualified Lighthouse candidate/is);
  assert.match(html, /FDLC Lighthouse.*Evidence that the operating model works—or evidence that it does not/is);
  assert.match(html, /FDLC Scale.*conditional on Lighthouse evidence/is);
  assert.match(html, /What AI-FDE produces.*Current-state model.*Authority model.*Qualification requirements.*Verification contract.*Outcome baseline.*Economics model.*Rollout and recovery plan.*Capability requirements.*Handoff material/is);
  assert.match(html, /Dependency modernization.*API migration.*Vulnerability remediation.*Quality remediation.*Documentation maintenance.*Code review assistance.*Test modernization.*Framework migration.*CI\/CD remediation/is);
  assert.match(html, /Good first factory lines have.*Bounded scope.*Independent verification.*Safe rollback.*Build our next product autonomously/is);
  assert.match(html, /Before AI-FDE.*Scattered source material.*After the AI-FDE handoff.*reviewable claims.*approves a Factory Definition.*qualifies a Factory Version/is);
  assert.match(html, /Representative Lighthouse.*Dependency modernization.*Illustrative contract—no performance result claimed.*Independent verification.*human release authority/is);
  assert.match(html, /Define proof before execution.*Cycle time.*Human engineering minutes.*Defect escape rate.*Cost per released outcome/is);
  assert.match(html, /From developers to builders.*Managers increasingly lead humans.*digital workers/is);
  assert.match(html, /The FDE.*Software architecture.*AI \/ agent engineering.*Change leadership.*Operating-model design/is);
  assert.match(html, /You bring.*We build together.*You keep.*The factory line.*The operating playbook.*ability to scale/is);
  assert.match(html, /The customer product.*This is where your team runs the factory.*Mission Control is the operating dashboard delivered with the factory line/is);
  assert.match(html, /Command Center.*Work Orders.*Approvals &amp; Audit.*What these screens show.*deterministic Software Factory demo.*not a live customer engagement/is);
  assert.match(html, /Autonomy without abdicating control.*See what ran, why it advanced, and how to recover.*Mission Control gives the team visibility.*Agents may propose.*Humans retain consequential authority/is);
  assert.match(html, /Bring one real workflow.*current baseline/is);
  assert.match(html, /Product stage.*Internal alpha/is);
  assert.match(html, /Public path.*Synthetic demo/is);
  assert.match(html, /Live qualification.*Not activated/is);
  assert.match(html, /Live model calls.*0/is);
  assert.match(html, /AI-FDE may.*prepare qualification material.*AI-FDE may not.*create a Factory Version.*Mission Control owns.*Factory Version qualification/is);
  assert.match(html, /href=["']\/deploy\/app["'][^>]*>Open engagement workspace/i);
  assert.doesNotMatch(html, /ai-software-factory-mastery\.vercel\.app/i);
  assert.doesNotMatch(html, /083665737366|calm-buffalo-854|dpl_BHi24iX4NmZZ8WNyuspDHaYg5DX2/i);
  assert.match(html, /Synthetic qualification is not live operational proof/is);
  assert.match(html, /href=["']\/deploy["'][^>]*>AI-FDE</i);
});

test("preview products are explicitly labeled", async () => {
  for (const route of ["/specification", "/benchmarks", "/enterprise", "/deploy"]) {
    const html = await (await render(route)).text();
    assert.match(html, /Proposed|Design partner/i, route);
  }
});

test("enterprise pricing inquiries have a working contact destination", async () => {
  const html = await (await render("/enterprise")).text();
  assert.match(html, /support@fdlc\.ai/);
  assert.match(html, /href="mailto:support@fdlc\.ai\?subject=FDLC%20Enterprise%20pricing%20and%20scope"/);
});

test("key learning pages show the canonical governing lifecycle in order", async () => {
  const stages = ["Intent", "Planning", "Execution", "Evidence", "Verification", "Approval", "Release", "Outcomes", "Learning"];
  for (const path of ["/", "/framework", "/in-5-minutes"]) {
    const html = await (await render(path)).text();
    const figure = html.match(/<figure class="governing-lifecycle"[\s\S]*?<\/figure>/)?.[0];
    assert.ok(figure, `${path} must explain the governing lifecycle`);
    const headings = [...figure.matchAll(/<h3><button[^>]*><span[^>]*>.*?<\/span><span>(.*?)<\/span><\/button><\/h3>/g)].map((match) => match[1]);
    assert.deepEqual(headings, stages);
    assert.match(figure, /Improvements return through verification and approval/);
  }
});
