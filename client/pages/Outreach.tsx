import PlaceholderPage from "@/components/PlaceholderPage";
import { Send } from "lucide-react";

export default function Outreach() {
  return (
    <PlaceholderPage
      title="Outreach Flow"
      description="View AI-generated emails and LinkedIn messages side-by-side, edit them, and send with one click."
      icon={Send}
      comingSoonFeatures={[
        "AI-generated personalized emails",
        "LinkedIn message templates",
        "Side-by-side message editing",
        "One-click sending to multiple platforms",
        "Follow-up sequence automation",
        "Response tracking and analytics"
      ]}
    />
  );
}
