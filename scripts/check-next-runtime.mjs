/**
 * Smoke-test the native Next.js runtime after a webpack production build.
 * The fast rendered suite uses Vinext; this covers Next route semantics too.
 */
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { createServer } from "node:net";

const host = "127.0.0.1";
const root = new URL("..", import.meta.url);

async function availablePort() {
  const server = createServer();
  server.listen(0, host);
  await once(server, "listening");
  const address = server.address();
  assert.ok(address && typeof address === "object");
  const { port } = address;
  server.close();
  await once(server, "close");
  return port;
}

const port = await availablePort();
const origin = `http://${host}:${port}`;
const next = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", "start", "--hostname", host, "--port", String(port)],
  { cwd: root, stdio: ["ignore", "pipe", "pipe"] },
);

let output = "";
next.stdout.on("data", (chunk) => { output += chunk; });
next.stderr.on("data", (chunk) => { output += chunk; });

async function request(pathname) {
  return fetch(`${origin}${pathname}`, { redirect: "manual" });
}

async function waitUntilReady() {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (next.exitCode !== null) throw new Error(`Next exited before becoming ready.\n${output}`);
    try {
      const response = await request("/");
      if (response.status === 200) return;
    } catch {
      // The server socket is not ready yet.
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Timed out waiting for Next.\n${output}`);
}

function assertRedirect(response, pathname) {
  assert.equal(response.status, 308);
  const location = new URL(response.headers.get("location"), origin);
  assert.equal(location.pathname, pathname);
  assert.equal(location.searchParams.get("source"), "old");
  assert.deepEqual(location.searchParams.getAll("tag"), ["one", "two"]);
  assert.equal(location.searchParams.get("return"), "/guide?tab=proof");
}

try {
  await waitUntilReady();

  const homepage = await request("/");
  assert.equal(homepage.status, 200);
  assert.match(await homepage.text(), /rel="canonical" href="https:\/\/www\.fdlc\.ai\/?"/);
  assert.equal((await request("/specification")).status, 200);

  const query = "?source=old&tag=one&tag=two&return=%2Fguide%3Ftab%3Dproof";
  assertRedirect(await request(`/spec${query}`), "/specification");
  assertRedirect(await request(`/examples/dependency-modernization${query}`), "/in-5-minutes");

  assert.equal((await request("/not-a-real-page")).status, 404);
  for (const asset of ["/robots.txt", "/sitemap.xml", "/favicon.svg", "/og.png"]) {
    assert.equal((await request(asset)).status, 200, asset);
  }

  console.log("Native Next runtime smoke passed (200/308/query/404/metadata assets).");
} finally {
  next.kill("SIGTERM");
  if (next.exitCode === null) {
    await Promise.race([once(next, "exit"), new Promise((resolve) => setTimeout(resolve, 5_000))]);
  }
  if (next.exitCode === null) next.kill("SIGKILL");
}
