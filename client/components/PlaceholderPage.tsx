import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  comingSoonFeatures?: string[];
}

export default function PlaceholderPage({ 
  title, 
  description, 
  icon: Icon = Construction,
  comingSoonFeatures = []
}: PlaceholderPageProps) {
  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto text-center">
        {/* Back Button */}
        <div className="mb-8">
          <Link to="/dashboard">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">{title}</CardTitle>
            <CardDescription className="text-lg text-gray-600">
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">🚀 Coming Soon</h3>
                <p className="text-blue-700 text-sm">
                  This feature is currently under development. We're working hard to bring you the best experience!
                </p>
              </div>

              {comingSoonFeatures.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">What's Coming:</h4>
                  <ul className="space-y-2 text-left">
                    {comingSoonFeatures.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-600">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-4">
                <p className="text-sm text-gray-500 mb-4">
                  Want to see this feature built next? Let us know what's most important to you!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    Request Feature
                  </Button>
                  <Button variant="outline">
                    View Roadmap
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
