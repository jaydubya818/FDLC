import Link from "next/link";

export default function NotFound() {
  return (
    <main
      className="grid min-h-screen place-items-center px-6"
      id="main-content"
      tabIndex={-1}
    >
      <section className="surface max-w-xl rounded-xl p-10 text-center">
        <p className="eyebrow mt-10">404 / Workspace not found</p>
        <h1 className="display-font mt-3 text-4xl font-medium">
          That AI-FDE route does not exist.
        </h1>
        <p className="mt-4 text-sm leading-6 text-[var(--ink-soft)]">
          The engagement may have moved, or the address may be incomplete.
          Return to the cockpit without leaving FDLC.ai.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            className="rounded bg-[var(--ink)] px-5 py-3 text-sm font-bold text-white no-underline"
            href="/"
          >
            AI-FDE home
          </Link>
          <a
            className="rounded border border-[var(--line-strong)] bg-white px-5 py-3 text-sm font-bold text-[var(--ink)] no-underline"
            href="/deploy"
          >
            About AI-FDE
          </a>
        </div>
      </section>
    </main>
  );
}
