import assert from "node:assert/strict";
import test from "node:test";

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
const { default: worker } = await import(workerUrl.href);

function render(pathname = "/") {
  return worker.fetch(new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
}

const routes = ["/", "/framework", "/architecture", "/in-5-minutes", "/manifesto", "/guide", "/guide/understand", "/guide/design", "/guide/build", "/guide/prove", "/guide/operate", "/guide/improve", "/mission-control", "/spec", "/maturity", "/benchmarks", "/enterprise", "/deploy", "/start", "/about"];

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

test("guide is an accurate portal into the authoritative 44-chapter book", async () => {
  const html = await (await render("/guide")).text();
  assert.match(html, /Build the system around the agent/i);
  assert.match(html, /evidence.*not an agent saying done.*decides what advances/is);
  assert.match(html, /FDLC.*operating model and category definition.*AI Software Factory Guide.*detailed methodology/is);
  assert.match(html, /44<\/strong> chapters.*6<\/strong> parts.*8<\/strong> Guide stages/is);
  assert.match(html, /not a second, incomplete edition/i);
  assert.match(html, /10 minutes.*Builder.*Architect.*Operator.*Executive \/ Fund.*Front to back/is);
  assert.match(html, /same system described at different levels of abstraction/i);
  assert.match(html, /eight stages are not a competing FDLC lifecycle/i);
  assert.match(html, /Runtime Lifecycle and Artifact Protocol.*not a second lifecycle or a one-to-one artifact list/is);
  assert.match(html, /Twenty-five entry points into the same source/i);
  assert.match(html, /Mission Control and the Guide.*living implementation.*boundaries visible/is);
  assert.match(html, /Next steps on FDLC.ai.*FDLC in 5 Minutes.*Framework.*Architecture.*Manifesto.*Maturity.*Mission Control/is);
  assert.match(html, /Verified delivery, not merely generated code/i);
  assert.match(html, /https:\/\/ai-software-factory-mastery\.vercel\.app\/docs\/01-understand\/02-the-factory-in-one-view/i);
  assert.match(html, /https:\/\/ai-software-factory-mastery\.vercel\.app\/search/i);
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

test("core technical pages preserve distinct delivery states", async () => {
  for (const route of ["/framework", "/architecture", "/mission-control"]) {
    const html = await (await render(route)).text();
    assert.match(html, /Execution complete.*Verified.*Approved.*Released.*Outcome proven/is, route);
  }
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

test("preview products are explicitly labeled", async () => {
  for (const route of ["/spec", "/benchmarks", "/enterprise", "/deploy"]) {
    const html = await (await render(route)).text();
    assert.match(html, /Proposed|Design partner/i, route);
  }
});
