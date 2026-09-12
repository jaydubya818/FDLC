import { corpusRawArtifacts } from "../../../lib/corpus";

export function generateStaticParams() {
  return Object.keys(corpusRawArtifacts).map((artifact) => ({ artifact: artifact.split("/") }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ artifact: string[] }> }) {
  const segments = (await params).artifact;
  if (!segments.length || segments.some((segment) => !segment || segment === "." || segment === "..")) return new Response("Not found", { status: 404 });
  const key = segments.join("/");
  const artifact = Object.prototype.hasOwnProperty.call(corpusRawArtifacts, key) ? corpusRawArtifacts[key] : undefined;
  if (!artifact) return new Response("Not found", { status: 404 });
  return new Response(artifact.content, { headers: { "content-type": artifact.contentType, "x-content-type-options": "nosniff", "x-robots-tag": "noindex, nofollow, noarchive" } });
}
