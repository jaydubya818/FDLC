"use client";

import { useEffect, useRef, useState } from "react";

export function CopyValue({ label, value }: { label: string; value: string }) {
  const [message, setMessage] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  async function copy() {
    if (timer.current) clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(value);
      setMessage("Copied");
    } catch {
      setMessage("Copy unavailable. Select the value to copy it.");
    }
    timer.current = setTimeout(() => setMessage(""), 4000);
  }

  return <span className="copy-value"><code>{value}</code><button type="button" aria-label={`Copy ${label}`} onClick={copy}>Copy</button><span className="copy-feedback" role="status">{message}</span></span>;
}
