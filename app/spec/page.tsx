import { permanentRedirect } from "next/navigation";
import { type RouteSearchParams, withSearchParams } from "../../lib/routing";

export default async function LegacySpecificationPage({ searchParams }: { searchParams: Promise<RouteSearchParams> }) {
  permanentRedirect(withSearchParams("/specification", await searchParams));
}
