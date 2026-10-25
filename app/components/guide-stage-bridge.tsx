import { guideStageBridge } from "../../data/governing-lifecycle";

// Explains how the Guide's eight builder-facing stages line up with the nine governing stages.
export function GuideStageBridge() {
  return (
    <aside className="guide-stage-bridge" aria-labelledby="guide-stage-bridge-title">
      <div>
        <p className="section-label">Reading the Guide?</p>
        <h3 id="guide-stage-bridge-title">Same lifecycle, eight builder steps.</h3>
        <p>The Guide walks this lifecycle from the builder&apos;s seat, so it groups some stages and splits others. Here is how its eight steps line up with the nine stages above.</p>
      </div>
      <ol>
        {guideStageBridge.map(({ governing, guide }) => (
          <li key={governing.join("-")}>
            <strong>{governing.join(" + ")}</strong>
            <span aria-hidden="true">←</span>
            <span className="guide-stage-bridge-steps">{guide.map(([label, href], index) => <span key={href}>{index > 0 ? " · " : null}<a href={href}>{label}</a></span>)}</span>
          </li>
        ))}
      </ol>
    </aside>
  );
}
