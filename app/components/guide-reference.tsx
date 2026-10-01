/* eslint-disable @next/next/no-html-link-for-pages -- Guide navigation crosses the microfrontend boundary. */
export function GuideReference({ description }: { description: string }) {
  return (
    <aside className="guide-reference" aria-label="Continue with the Guide">
      <div>
        <h2>Continue with the Guide</h2>
        <p>{description}</p>
      </div>
      <a className="button button-dark" href="/guide">Explore the Guide <span aria-hidden="true">→</span></a>
    </aside>
  );
}
