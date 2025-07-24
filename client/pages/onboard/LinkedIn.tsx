import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Linkedin, Users, MessageSquare, TrendingUp, Info } from "lucide-react";

export default function LinkedIn() {
  const [linkedinEnabled, setLinkedinEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleContinue = async () => {
    setIsLoading(true);

    try {
      // Store LinkedIn preference
      const response = await fetch('/api/linkedin-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ linkedin_enabled: linkedinEnabled }),
      });

      if (!response.ok) {
        throw new Error('Failed to save LinkedIn settings');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      // Continue anyway for demo
      setSuccess(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Linkedin className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            LinkedIn Integration
          </h1>
          <p className="text-gray-600">
            Enable LinkedIn features to supercharge your job search
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle>LinkedIn Features</CardTitle>
            <CardDescription>
              Choose whether to enable LinkedIn-powered functionality
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {success ? (
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-green-600 mb-2">
                  Setup Complete!
                </h3>
                <p className="text-gray-600">
                  Welcome to your AI-powered job search assistant
                </p>
              </div>
            ) : (
              <>
                {/* LinkedIn Toggle */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Linkedin className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Enable LinkedIn Features</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Access job scraping, profile analysis, and networking tools
                    </p>
                  </div>
                  <Switch
                    checked={linkedinEnabled}
                    onCheckedChange={setLinkedinEnabled}
                  />
                </div>

                {/* Feature Preview */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">
                    Available LinkedIn Features:
                  </h3>
                  
                  <div className="grid gap-4">
                    <div className={`p-4 rounded-lg border transition-all ${
                      linkedinEnabled ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className={`h-5 w-5 ${linkedinEnabled ? 'text-blue-600' : 'text-gray-400'}`} />
                        <span className="font-medium">Job Scraping</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Automatically extract job details from LinkedIn job postings
                      </p>
                    </div>

                    <div className={`p-4 rounded-lg border transition-all ${
                      linkedinEnabled ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-center gap-3 mb-2">
                        <Users className={`h-5 w-5 ${linkedinEnabled ? 'text-blue-600' : 'text-gray-400'}`} />
                        <span className="font-medium">Network Analysis</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Find mutual connections and potential referrals
                      </p>
                    </div>

                    <div className={`p-4 rounded-lg border transition-all ${
                      linkedinEnabled ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-center gap-3 mb-2">
                        <MessageSquare className={`h-5 w-5 ${linkedinEnabled ? 'text-blue-600' : 'text-gray-400'}`} />
                        <span className="font-medium">Message Generation</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        AI-generated personalized LinkedIn messages
                      </p>
                    </div>
                  </div>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Note:</strong> This is a demo implementation. No official LinkedIn API is used. 
                    Features are simulated for demonstration purposes.
                  </AlertDescription>
                </Alert>

                <Button
                  onClick={handleContinue}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isLoading ? "Completing Setup..." : "Complete Setup"}
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Step 3 of 3 • Final setup
          </p>
        </div>
      </div>
    </div>
  );
}
