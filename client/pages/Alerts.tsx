import PlaceholderPage from "@/components/PlaceholderPage";
import { Bell } from "lucide-react";

export default function Alerts() {
  return (
    <PlaceholderPage
      title="Alerts & Feed"
      description="Get notified when hashtags appear or recruiters post relevant content in your network."
      icon={Bell}
      comingSoonFeatures={[
        "Real-time hashtag monitoring",
        "Recruiter activity tracking",
        "Job posting alerts",
        "Company news notifications",
        "Industry trend updates",
        "Customizable alert preferences"
      ]}
    />
  );
}
