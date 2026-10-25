import Link from "next/link";
import { whatsRealToday } from "../../data/whats-real";
import { StatusBadge } from "./status-badge";

export function WhatsRealToday({ compact = false }: { compact?: boolean }) {
  return (
    <section className={`whats-real${compact ? " is-compact" : ""}`} id="whats-real">
      <div>
        <p className="section-label">What is real today</p>
        <h2>Framework, product, runtime, and experiments stay distinct.</h2>
        <p>These labels describe current public status. They are not certification and they do not invent availability.</p>
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
