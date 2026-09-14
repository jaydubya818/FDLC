import Link from "next/link";

export function NextSteps({
  eyebrow,
  title,
  links,
}: {
  eyebrow: string;
  title: string;
  links: readonly (readonly [string, string])[];
}) {
  return (
    <section className="reading-next">
      <p className="section-label">{eyebrow}</p>
      <h2>{title}</h2>
      <div>
        {links.map(([href, label]) => href.startsWith("/guide")
          ? <a href={href} key={href}>{label} →</a>
          : <Link href={href} key={href}>{label} →</Link>)}
      </div>
    </section>
  );
}
