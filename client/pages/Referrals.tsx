import PlaceholderPage from "@/components/PlaceholderPage";
import { Users } from "lucide-react";

export default function Referrals() {
  return (
    <PlaceholderPage
      title="Referrals & Network"
      description="Find potential referral contacts from your network and get connection suggestions."
      icon={Users}
      comingSoonFeatures={[
        "LinkedIn network analysis",
        "Potential referral identification",
        "Mutual connection finder",
        "Introduction request templates",
        "Network growth recommendations",
        "Relationship strength scoring"
      ]}
    />
  );
}
