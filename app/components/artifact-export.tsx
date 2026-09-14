"use client";

import { useEffect, useState } from "react";
import { downloadArtifact, type ArtifactFormat } from "../../lib/artifact-export";

export function ArtifactExport({
  artifacts,
  copyLabel,
  downloadLabel,
}: {
  artifacts: ArtifactFormat[];
  copyLabel?: string;
  downloadLabel?: string;
}) {
  const [activeId, setActiveId] = useState(artifacts[0]?.id ?? "");
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");
  const [downloadStatus, setDownloadStatus] = useState<"idle" | "ready">("idle");
  const active = artifacts.find((artifact) => artifact.id === activeId) ?? artifacts[0];

  useEffect(() => {
    if (copyStatus === "idle") return;
    const timeout = window.setTimeout(() => setCopyStatus("idle"), 1800);
    return () => window.clearTimeout(timeout);
  }, [copyStatus]);

  useEffect(() => {
    if (downloadStatus === "idle") return;
    const timeout = window.setTimeout(() => setDownloadStatus("idle"), 1800);
    return () => window.clearTimeout(timeout);
  }, [downloadStatus]);

  if (!active) return null;
  const isPrimary = active.id === artifacts[0]?.id;
  const copyText = isPrimary && copyLabel ? copyLabel : `Copy ${active.label}`;
  const downloadText = isPrimary && downloadLabel ? downloadLabel : `Download ${active.label}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(active.text);
      setCopyStatus("copied");
    } catch {
      const field = document.querySelector<HTMLTextAreaElement>(`#artifact-export-${active.id}`);
      field?.focus();
      field?.select();
      setCopyStatus("error");
    }
  }

  function download() {
    downloadArtifact(active);
    setDownloadStatus("ready");
  }

  return (
    <div className="artifact-export">
      <div className="artifact-export-formats" role="tablist" aria-label="Artifact formats">
        {artifacts.map((artifact) => (
          <button
            aria-selected={artifact.id === active.id}
            className={artifact.id === active.id ? "is-selected" : undefined}
            key={artifact.id}
            onClick={() => setActiveId(artifact.id)}
            role="tab"
            type="button"
          >
            {artifact.label}
          </button>
        ))}
      </div>
      <div className="factory-export-actions" aria-label="Keep this artifact">
        <button className="button button-dark" onClick={copy} type="button">{copyText}</button>
        <button className="button button-light" onClick={download} type="button">{downloadText}</button>
        <span aria-live="polite">
          {copyStatus === "copied" ? "Copied to your clipboard." : copyStatus === "error" ? "Clipboard access was unavailable. The reusable text below is selected for you." : downloadStatus === "ready" ? `${active.filename} is ready.` : ""}
        </span>
      </div>
      <details className="factory-markdown">
        <summary>View reusable {active.label}</summary>
        <textarea aria-label={`${active.label} artifact`} id={`artifact-export-${active.id}`} readOnly rows={18} value={active.text} />
      </details>
    </div>
  );
}
