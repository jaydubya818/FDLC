export type ArtifactFormat = {
  id: string;
  label: string;
  filename: string;
  mime: string;
  text: string;
};

export function downloadArtifact(format: ArtifactFormat) {
  const blobUrl = URL.createObjectURL(new Blob([format.text], { type: `${format.mime};charset=utf-8` }));
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = format.filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(blobUrl), 0);
}
