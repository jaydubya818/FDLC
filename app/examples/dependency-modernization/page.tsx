import { permanentRedirect } from "next/navigation";
import { type RouteSearchParams, withSearchParams } from "../../../lib/routing";

export default async function LegacyDependencyModernizationExamplePage({ searchParams }: { searchParams: Promise<RouteSearchParams> }) {
  permanentRedirect(withSearchParams("/in-5-minutes", await searchParams));
}
