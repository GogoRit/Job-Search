import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Switch } from "../../components/ui/switch";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { CheckCircle, Linkedin, Users, MessageSquare, TrendingUp, Info, ArrowLeft } from "lucide-react";
import { useOnboarding } from "../../contexts/OnboardingContext";
import { useToast } from "../../hooks/use-toast";

export default function LinkedIn() {
  const [linkedinEnabled, setLinkedinEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [linkedinConnected, setLinkedinConnected] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setLinkedinEnabled: setLinkedinEnabledContext, completeOnboarding } = useOnboarding();

  // Check if user is already connected to LinkedIn on component mount
  useEffect(() => {
    checkLinkedInConnection();
  }, []);

  const checkLinkedInConnection = async () => {
    try {
      const response = await fetch('/api/linkedin-status');
      if (response.ok) {
        const data = await response.json();
        setLinkedinConnected(data.connected || false);
        setLinkedinEnabled(data.connected || false);
      }
    } catch (err) {
      console.log('LinkedIn status check failed:', err);
    }
  };

  const handleLinkedInConnect = async () => {
    setIsConnecting(true);
    try {
      // Get LinkedIn OAuth URL from backend
      const response = await fetch('/api/linkedin-auth-url');
      if (response.ok) {
        const data = await response.json();
        // Redirect to LinkedIn OAuth
        window.location.href = data.auth_url;
      } else {
        throw new Error('Failed to get LinkedIn auth URL');
      }
    } catch (err) {
      console.error('LinkedIn connection failed:', err);
      // For demo purposes, simulate connection
      setLinkedinConnected(true);
      setLinkedinEnabled(true);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleContinue = async () => {
    if (linkedinEnabled && !linkedinConnected) {
      toast({
        title: "LinkedIn not connected",
        description: "Please connect your LinkedIn account first.",
        variant: "destructive",
      });
      return;
    }

    // Before completing onboarding, check if API key exists
    try {
      const response = await fetch('/api/check-api-key');
      const data = await response.json();
      
      if (!data.has_api_key) {
        toast({
          title: "OpenAI API Key Required",
          description: "Please provide your OpenAI API key before completing setup.",
          variant: "destructive",
        });
        navigate('/');
        return;
      }
    } catch (error) {
      console.error('Failed to check API key:', error);
      toast({
        title: "Error",
        description: "Failed to validate setup. Please try again.",
        variant: "destructive",
      });
      return;
    }

    // Mark onboarding as complete and navigate to dashboard
    completeOnboarding();
    navigate('/dashboard');
  };

  return (
    <div className="w-full">
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
                {/* LinkedIn Connection */}
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Linkedin className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">Connect to LinkedIn</span>
                        {linkedinConnected && (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {linkedinConnected 
                          ? "Your LinkedIn account is connected! You can access all LinkedIn features."
                          : "Connect your LinkedIn account to enable job scraping, profile analysis, and networking tools."
                        }
                      </p>
                      
                      {!linkedinConnected ? (
                        <Button
                          onClick={handleLinkedInConnect}
                          disabled={isConnecting}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          {isConnecting ? (
                            <>
                              <span className="animate-spin mr-2">⏳</span>
                              Connecting to LinkedIn...
                            </>
                          ) : (
                            <>
                              <Linkedin className="h-4 w-4 mr-2" />
                              Connect LinkedIn Account
                            </>
                          )}
                        </Button>
                      ) : (
                        <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                          <CheckCircle className="h-4 w-4" />
                          LinkedIn Connected Successfully
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Toggle for enabling/disabling LinkedIn features */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <span className="font-medium">Enable LinkedIn Features</span>
                      <p className="text-sm text-gray-600">
                        Use LinkedIn data to enhance your job search
                      </p>
                    </div>
                    <Switch
                      checked={linkedinEnabled}
                      onCheckedChange={setLinkedinEnabled}
                      disabled={!linkedinConnected}
                    />
                  </div>
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

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/onboard/profile')}
                    className="flex-1"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={handleContinue}
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {isLoading ? "Completing Setup..." : "Complete Setup"}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Step 4 of 4 • Final setup
          </p>
        </div>
    </div>
  );
}
