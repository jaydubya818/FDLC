"use client";

import { useEffect, useId, useRef, useState } from "react";

export function CorpusMermaid({ source }: { source: string }) {
  const reactId = useId();
  const container = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let active = true;
    const id = `corpus-mermaid-${reactId.replace(/[^A-Za-z0-9_-]/g, "")}`;
    async function render() {
      try {
        const { default: mermaid } = await import("mermaid");
        mermaid.initialize({ startOnLoad: false, securityLevel: "strict", theme: "neutral", suppressErrorRendering: true });
        const result = await mermaid.render(id, source);
        if (!active || !container.current) return;
        container.current.innerHTML = result.svg;
        result.bindFunctions?.(container.current);
        setState("ready");
      } catch {
        if (active) setState("error");
      }
    }
    void render();
    return () => { active = false; };
  }, [reactId, source]);

  return (
    <figure className={`corpus-mermaid is-${state}`} aria-busy={state === "loading"}>
      <figcaption>{state === "loading" ? "Rendering diagram…" : state === "error" ? "Diagram rendering failed. The source remains available below." : "FDLC corpus diagram"}</figcaption>
      <div className="corpus-mermaid-canvas" ref={container} role="img" aria-label="FDLC corpus diagram" />
      <details open={state === "error"}><summary>Diagram source</summary><pre><code>{source}</code></pre></details>
    </figure>
  );
}
