import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle, 
  XCircle, 
  Settings as SettingsIcon, 
  Key, 
  Mail, 
  MessageSquare, 
  Brain,
  ExternalLink,
  AlertTriangle
} from "lucide-react";
import { ConfigCheckResponse } from "@shared/api";

async function fetchConfigCheck(): Promise<ConfigCheckResponse> {
  const response = await fetch("/api/config/check");
  if (!response.ok) {
    throw new Error("Failed to fetch configuration");
  }
  return response.json();
}

export default function Settings() {
  const { data: config, isLoading, error } = useQuery({
    queryKey: ["config-check"],
    queryFn: fetchConfigCheck,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <SettingsIcon className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Settings & Configuration</h1>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="h-32 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <SettingsIcon className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Settings & Configuration</h1>
        </div>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load configuration. Please check if the server is running.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const features = [
    {
      id: "ai",
      name: "AI Assistant",
      description: "Generate job application responses and outreach messages",
      icon: Brain,
      enabled: config?.features.ai,
      setupUrl: "https://platform.openai.com/api-keys",
      envVar: "OPENAI_API_KEY"
    },
    {
      id: "gmail",
      name: "Gmail Integration", 
      description: "Send emails directly from the platform",
      icon: Mail,
      enabled: config?.features.gmail,
      setupUrl: "https://console.cloud.google.com/apis/credentials",
      envVar: "GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET"
    },
    {
      id: "linkedin",
      name: "LinkedIn Integration",
      description: "Send LinkedIn messages and scrape job data",
      icon: MessageSquare,
      enabled: config?.features.linkedin,
      setupUrl: "https://developer.linkedin.com/",
      envVar: "LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET"
    },
    {
      id: "smtp",
      name: "SMTP Email",
      description: "Alternative email sending via SMTP",
      icon: Mail,
      enabled: config?.features.smtp,
      setupUrl: "#",
      envVar: "SMTP_HOST, SMTP_USER, SMTP_PASS"
    }
  ];

  const enabledCount = features.filter(f => f.enabled).length;
  const totalFeatures = features.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <SettingsIcon className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Settings & Configuration</h1>
        </div>
        <Badge variant={enabledCount === totalFeatures ? "default" : "secondary"}>
          {enabledCount}/{totalFeatures} Features Enabled
        </Badge>
      </div>

      {/* Overall Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key className="h-5 w-5" />
            <span>API Configuration Status</span>
          </CardTitle>
          <CardDescription>
            Configure your API keys to enable features. All keys are stored locally and never shared.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {enabledCount === 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                No API keys configured. The app will run with limited functionality. 
                Configure at least OpenAI for AI features to get started.
              </AlertDescription>
            </Alert>
          )}
          
          {enabledCount > 0 && enabledCount < totalFeatures && (
            <Alert>
              <AlertDescription>
                Great! You have {enabledCount} feature{enabledCount > 1 ? 's' : ''} enabled. 
                Configure more API keys to unlock additional functionality.
              </AlertDescription>
            </Alert>
          )}

          {enabledCount === totalFeatures && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Excellent! All features are enabled. You have full access to the job search assistant.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Feature Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {features.map((feature) => (
          <Card key={feature.id} className={`${feature.enabled ? 'border-green-200' : 'border-gray-200'}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <feature.icon className="h-5 w-5" />
                  <CardTitle className="text-lg">{feature.name}</CardTitle>
                </div>
                {feature.enabled ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-gray-400" />
                )}
              </div>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status:</span>
                  <Badge variant={feature.enabled ? "default" : "secondary"}>
                    {feature.enabled ? "Enabled" : "Not Configured"}
                  </Badge>
                </div>
                
                <div className="text-sm text-gray-600">
                  <strong>Environment Variables:</strong> {feature.envVar}
                </div>

                {!feature.enabled && (
                  <div className="space-y-2">
                    {config?.recommendations[feature.id] && (
                      <p className="text-sm text-amber-700 bg-amber-50 p-2 rounded">
                        💡 {config.recommendations[feature.id]}
                      </p>
                    )}
                    
                    {feature.setupUrl !== "#" && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={feature.setupUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Get API Keys
                        </a>
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Setup Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Setup Instructions</CardTitle>
          <CardDescription>
            Follow these steps to configure your API keys
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose prose-sm max-w-none">
            <ol className="list-decimal list-inside space-y-2">
              <li>Copy <code>.env.example</code> to <code>.env</code> in your project root</li>
              <li>Get your API keys from the respective service providers (links above)</li>
              <li>Add your API keys to the <code>.env</code> file</li>
              <li>Restart the application to load the new configuration</li>
              <li>Refresh this page to see the updated status</li>
            </ol>
            
            <div className="mt-4 p-3 bg-gray-50 rounded">
              <p className="text-sm">
                <strong>Security Note:</strong> Your API keys are stored locally in your <code>.env</code> file 
                and are never transmitted to external servers except to the respective APIs you're using 
                (OpenAI, Gmail, etc.). This is an open-source, self-hosted solution.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
