import Link from "next/link";
import { SiteShell } from "./components/site-shell";

export default function NotFound() {
  return <SiteShell><section className="not-found"><p className="section-label">404 / State not found</p><h1>This route has no verified outcome.</h1><p>The page may have moved, or the artifact was never published.</p><Link className="button button-dark" href="/">Return to FDLC.ai</Link></section></SiteShell>;
}
