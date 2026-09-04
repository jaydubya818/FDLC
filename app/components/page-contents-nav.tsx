export type PageContentsItem = { label: string; href: `#${string}` };

export function PageContentsNav({ items }: { items: readonly PageContentsItem[] }) {
  return (
    <div className="page-contents">
      <nav aria-label="On this page" className="page-contents-desktop">
        <span>On this page</span>
        <div>{items.map((item) => <a href={item.href} key={item.href}>{item.label}</a>)}</div>
      </nav>
      <details className="page-contents-mobile">
        <summary>On this page <span aria-hidden="true">Sections ↓</span></summary>
        <nav aria-label="On this page">{items.map((item) => <a href={item.href} key={item.href}>{item.label}</a>)}</nav>
      </details>
    </div>
  );
}
