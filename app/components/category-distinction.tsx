import { categoryComparison, categoryTransitions } from "../../data/fdlc";

export function CategoryDistinction() {
  return <>
    <div className="category-table-shell">
      <table className="category-table">
        <thead>
          <tr><th scope="col">Category</th>{categoryComparison.map((item) => <th scope="col" key={item.name}>{item.name}</th>)}</tr>
        </thead>
        <tbody>
          <tr><th scope="row">Primary object</th>{categoryComparison.map((item) => <td key={item.name}>{item.primaryObject}</td>)}</tr>
          <tr><th scope="row">Question answered</th>{categoryComparison.map((item) => <td key={item.name}>{item.question}</td>)}</tr>
        </tbody>
      </table>
    </div>
    <div className="category-transitions" aria-label="The two transitions from SDLC to an AI software factory" role="group">
      {categoryTransitions.map((transition, index) => <article key={transition.to}>
        <span>{String(index + 1).padStart(2, "0")}</span>
        <strong>{transition.from} <i aria-hidden="true">→</i> {transition.to}</strong>
        <p>{transition.meaning}</p>
      </article>)}
    </div>
    <p className="category-conclusion"><strong>FDLC</strong> is the engineering discipline for that factory.</p>
  </>;
}
