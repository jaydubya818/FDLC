import Link from "next/link";
import { Children, isValidElement, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { createHeadingIdFactory, isUnsafeHref } from "../../../lib/corpus-contract";
import type { CorpusDocument } from "../../../lib/corpus-types";
import { CorpusMermaid } from "./corpus-mermaid";

function childText(children: ReactNode): string {
  if (typeof children === "string" || typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(childText).join("");
  if (children && typeof children === "object" && "props" in children) return childText((children as { props?: { children?: ReactNode } }).props?.children);
  return "";
}

export function CorpusMarkdown({ document }: { document: CorpusDocument }) {
  const nextHeading = createHeadingIdFactory();
  const resolvedLinks = new Map(document.links.map((link) => [link.href, link.resolvedHref ?? link.href]));
  function heading(Tag: "h2" | "h3" | "h4") {
    return function CorpusHeading({ children }: { children?: ReactNode }) {
      const resolved = nextHeading(childText(children));
      return <Tag id={resolved.id}>{resolved.text}</Tag>;
    };
  }
  return (
    <div className="corpus-markdown">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
        a: ({ children, href = "" }) => {
          const resolved = resolvedLinks.get(href) ?? href;
          if (!resolved || isUnsafeHref(resolved)) return <span>{children}</span>;
          if (/^https?:/i.test(resolved)) return <a href={resolved} rel="noreferrer" target="_blank">{children}<span className="visually-hidden"> (opens in a new tab)</span></a>;
          return <Link href={resolved}>{children}</Link>;
        },
        code: ({ children, className }) => <code className={className}>{children}</code>,
        h1: heading("h2"),
        h2: heading("h2"),
        h3: heading("h3"),
        h4: heading("h4"),
        img: ({ alt = "", src }) => {
          const value = typeof src === "string" ? src : "";
          // Content images are allowlisted by the corpus generator; unknown sources render as text.
          // eslint-disable-next-line @next/next/no-img-element
          return value.startsWith("/corpus-artifacts/") || /^https:\/\//i.test(value) ? <img alt={alt} loading="lazy" src={value} /> : <span>{alt}</span>;
        },
        pre: ({ children }) => {
          const child = Children.count(children) === 1 ? Children.only(children) : null;
          if (isValidElement<{ children?: ReactNode; className?: string }>(child) && child.props.className === "language-mermaid") {
            return <CorpusMermaid source={childText(child.props.children).replace(/\n$/, "")} />;
          }
          // Keyboard users need a focus target when a narrow viewport makes a code block scrollable.
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          return <pre aria-label="Scrollable code example" tabIndex={0}>{children}</pre>;
        },
        table: ({ children }) => (
          // A focusable container lets keyboard readers scroll wide technical tables.
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          <div aria-label="Scrollable table" className="corpus-table-scroll" tabIndex={0}><table>{children}</table></div>
        ),
        th: ({ children }) => <th>{childText(children).trim() ? children : <span className="visually-hidden">Row heading</span>}</th>,
      }}>{document.body}</ReactMarkdown>
    </div>
  );
}
