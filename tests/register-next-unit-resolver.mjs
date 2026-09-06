import { register } from "node:module";

// Native Next resolves this SDK import during bundling. Node's unbundled unit
// runner requires the extension; this resolver is never loaded by application code.
register("./next-unit-resolver.mjs", import.meta.url);
