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
  assert.match(html, /<section class="hero-shell">[\s\S]*?Factory Development Lifecycle \(FDLC\)[\s\S]*?<\/section>/i);
  assert.match(html, /Build the factory that builds your software/i);
  assert.match(html, /Agent participation is not factory engineering/i);
  assert.match(html, /AI-native SDLC.*Changes who participates.*FDLC.*Defines how the factory/is);
  assert.match(html, /FDLC is the lifecycle for the factory itself/i);
  assert.match(html, /Receive.*Specify.*Plan.*Execute.*Verify.*Approve.*Release.*Observe.*Learn/is);
  assert.match(html, /Discover.*Design.*Assemble.*Validate.*Deploy.*Operate.*Improve/is);
  assert.match(html, /Continuous controls.*Govern.*Secure.*Observe.*Measure/is);
  assert.match(html, /Intent.*Specification.*Plan.*Work Order.*Attempt.*Evidence.*Verification.*Approval.*Release.*Outcome.*Learning Signal/is);
  assert.match(html, /FDLC.*Defines it.*Mission Control.*Demonstrates it.*The Guide.*Teaches it/is);
  for (const href of ["/framework", "/architecture", "/in-5-minutes", "/guide", "/mission-control", "/maturity", "/start"]) assert.match(html, new RegExp(`href=["']${href}["']`));
});

test("worked example connects all four models without claiming production proof", async () => {
  const html = await (await render("/in-5-minutes")).text();
  assert.match(html, /FDLC in 5 Minutes/i);
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
  assert.match(html, /canonical example.*not a claim of fleet-scale production/is);
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
