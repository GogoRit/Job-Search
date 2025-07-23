import PlaceholderPage from "@/components/PlaceholderPage";
import { FileText } from "lucide-react";

export default function Applications() {
  return (
    <PlaceholderPage
      title="Smart Matching View"
      description="Browse jobs ranked by fit score and get recommended resume tweaks for better matches."
      icon={FileText}
      comingSoonFeatures={[
        "AI-powered job fit scoring",
        "Personalized resume recommendations",
        "Skills gap analysis",
        "Industry-specific optimizations",
        "ATS compatibility checking",
        "Real-time market insights"
      ]}
    />
  );
}
