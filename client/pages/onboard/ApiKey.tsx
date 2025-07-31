import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Eye, EyeOff, Key, Shield, CheckCircle } from "lucide-react";
import { useOnboarding, useNextOnboardingStep } from "../../contexts/OnboardingContext";
import { useAuthToken } from "../../contexts/AuthContext";

export default function ApiKey() {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { setApiKeySubmitted, resetOnboarding } = useOnboarding();
  const nextStep = useNextOnboardingStep();
  const token = useAuthToken();

  // Add a reset button for development/testing
  const handleReset = () => {
    resetOnboarding();
    window.location.reload();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setError("Please enter your OpenAI API key");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/store-api-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ api_key: apiKey }),
      });

      if (!response.ok) {
        throw new Error("Failed to store API key");
      }

      setSuccess(true);
      setApiKeySubmitted(true);
      setTimeout(() => {
        navigate(nextStep);
      }, 1500);
    } catch (err) {
      setError("Failed to store API key. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    // Mark API key as submitted (even if skipped) so user can complete it later
    setApiKeySubmitted(true);
    // Skip API key setup and go to next onboarding step
    navigate("/onboard/resume");
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
          <Key className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Connect Your AI Assistant
        </h1>
        <p className="text-gray-600">
          Enter your OpenAI API key to enable AI-powered features
        </p>
      </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              Secure & Private
            </CardTitle>
            <CardDescription>
              Your API key is encrypted and stored locally. We never share it.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {success ? (
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-green-600 mb-2">
                  API Key Stored Successfully!
                </h3>
                <p className="text-gray-600">Redirecting to resume upload...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="apiKey">OpenAI API Key</Label>
                  <div className="relative">
                    <Input
                      id="apiKey"
                      type={showKey ? "text" : "password"}
                      placeholder="sk-..."
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowKey(!showKey)}
                    >
                      {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Get your API key from{" "}
                    <a 
                      href="https://platform.openai.com/api-keys" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      OpenAI Platform
                    </a>
                  </p>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {isLoading ? "Storing..." : "Continue"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSkip}
                    disabled={isLoading}
                  >
                    Skip
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Step 1 of 3 • Secure setup process
          </p>
          <Button
            onClick={handleReset}
            variant="outline"
            size="sm"
            className="mt-2 text-xs"
          >
            Reset Onboarding (Dev)
          </Button>
        </div>
    </div>
  );
}
