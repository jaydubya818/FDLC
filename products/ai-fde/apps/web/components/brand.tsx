import Link from "next/link";
import Image from "next/image";

import { PRODUCT } from "@/lib/product";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      aria-label={`${PRODUCT.shortName} home`}
      className="inline-flex items-center gap-3 text-[var(--ink)] no-underline"
      href="/"
    >
      <Image
        alt="FDLC.ai"
        className="h-auto w-36"
        height="54"
        src="/deploy/app/fdlc-logo-transparent.png"
        width="180"
      />
      {!compact && (
        <span className="border-l border-[var(--line-strong)] pl-3">
          <span className="block text-sm font-extrabold tracking-[0.08em] text-[var(--fdlc-green)]">
            {PRODUCT.shortName}
          </span>
          <span className="block text-[0.6rem] font-bold uppercase tracking-[0.16em] text-[var(--ink-soft)]">
            Factory Definition cockpit
          </span>
        </span>
      )}
    </Link>
  );
}
