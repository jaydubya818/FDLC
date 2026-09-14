export function LensSwitcher({ items }: { items: readonly (readonly [string, string, string])[] }) {
  return (
    <nav aria-label="System lenses" className="lens-switcher">
      <p className="orientation-label">Lenses</p>
      <ul>
        {items.map(([label, href, description]) => (
          <li key={href}>
            <a href={href}>
              <strong>{label}</strong>
              <span>{description}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
