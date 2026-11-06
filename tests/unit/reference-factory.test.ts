// The public, dependency-free contract suite is the same suite used by the site.
import "../../reference-factory/contract.test.mjs";

import { execFileSync } from "node:child_process";
import test from "node:test";
test("the public Lab download and readable source match the executable contract suite", () => {
  execFileSync("python3", ["scripts/package-reference-lab.py", "--check"]);
});
