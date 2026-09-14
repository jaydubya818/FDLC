import Link from "next/link";
import Image from "next/image";

import { PRODUCT } from "@/lib/product";

export function Brand({
  compact = false,
  rail = false,
}: {
  compact?: boolean;
  rail?: boolean;
}) {
  return (
    <Link
      aria-label={`${PRODUCT.shortName} home`}
      className={`inline-flex items-center text-[var(--ink)] no-underline ${rail ? "w-full min-w-0 gap-2" : "gap-3"}`}
      href="/"
    >
      <Image
        alt="FDLC.ai"
        className={`h-auto shrink-0 ${rail ? "w-28" : "w-36"}`}
        height="54"
        src="/deploy/app/fdlc-logo-transparent.png"
        width="180"
      />
      {!compact && (
        <span
          className={`min-w-0 border-l border-[var(--line-strong)] ${rail ? "pl-2" : "pl-3"}`}
        >
          <span className="block text-sm font-extrabold tracking-[0.08em] text-[var(--fdlc-green)]">
            {PRODUCT.shortName}
          </span>
          <span className="block text-[0.6rem] font-bold uppercase leading-4 tracking-[0.12em] text-[var(--ink-soft)]">
            Factory Definition cockpit
          </span>
        </span>
      )}
    </Link>
  );
}
