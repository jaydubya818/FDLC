import { permanentRedirect } from "next/navigation";

export default function LegacyDependencyModernizationExamplePage() {
  permanentRedirect("/in-5-minutes");
}
