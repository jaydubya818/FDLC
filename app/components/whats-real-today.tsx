import Link from "next/link";
import { whatsRealToday } from "../../data/whats-real";
import { StatusBadge } from "./status-badge";

export function WhatsRealToday({ compact = false }: { compact?: boolean }) {
  return (
    <section className={`whats-real${compact ? " is-compact" : ""}`} id="whats-real">
      <div>
        <p className="section-label">What is real today</p>
        <h2>What you can use today, and what is still a preview.</h2>
        <p>Some of FDLC is ready to use now and some is early. Each label says plainly which is which, so you know what you can rely on.</p>
      </div>
      <ol>
        {whatsRealToday.map((item) => {
          const card = (
            <>
              <span>{item.kind}</span>
              <h3>{item.name}</h3>
              <StatusBadge status={item.status} />
              <p>{item.meaning}</p>
            </>
          );
          return (
            <li key={item.name}>
              {item.href.startsWith("/guide") ? <a href={item.href}>{card}</a> : <Link href={item.href}>{card}</Link>}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
