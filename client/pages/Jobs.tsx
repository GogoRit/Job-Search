import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Badge } from "../components/ui/badge";
import { 
  Briefcase, 
  Plus, 
  ExternalLink, 
  AlertTriangle, 
  Brain, 
  CheckCircle,
  Loader2
} from "lucide-react";
import { FeaturesResponse, ParseJobResponse, GenerateResponseResponse } from "../types/api";

async function fetchFeatures(): Promise<FeaturesResponse> {
  const response = await fetch("/api/features");
  if (!response.ok) throw new Error("Failed to fetch features");
  return response.json();
}

export default function Jobs() {
  const [jobUrl, setJobUrl] = useState("");
  const [question, setQuestion] = useState("");
  const [generatedResponse, setGeneratedResponse] = useState("");
  const [isParsingJob, setIsParsingJob] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [parsedJob, setParsedJob] = useState<any>(null);

  const { data: features } = useQuery({
    queryKey: ["features"],
    queryFn: fetchFeatures,
  });

  const handleParseJob = async () => {
    if (!jobUrl.trim()) return;
    
    setIsParsingJob(true);
    try {
      const response = await fetch("/api/jobs/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: jobUrl }),
      });

      const result: ParseJobResponse = await response.json();
      if (result.success) {
        setParsedJob(result.data);
      }
    } catch (error) {
      console.error("Error parsing job:", error);
    } finally {
      setIsParsingJob(false);
    }
  };

  const handleGenerateResponse = async () => {
    if (!question.trim() || !parsedJob) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch("/api/jobs/generate-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescription: parsedJob.description,
          question: question,
          resume: "", // TODO: Add resume upload functionality
        }),
      });

      const result: GenerateResponseResponse = await response.json();
      if (result.success) {
        setGeneratedResponse(result.data.response);
      }
    } catch (error) {
      console.error("Error generating response:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Briefcase className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Job Application Assistant</h1>
      </div>

      {/* Feature Status Alert */}
      {!features?.ai && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            AI features are not available. Configure your OpenAI API key in Settings to enable AI-powered responses.
          </AlertDescription>
        </Alert>
      )}

      {/* Job URL Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Add Job Posting</span>
          </CardTitle>
          <CardDescription>
            Paste a job URL to automatically extract job details, or enter information manually.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="https://linkedin.com/jobs/view/123456789 or company careers page URL"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleParseJob} 
              disabled={!jobUrl.trim() || isParsingJob}
            >
              {isParsingJob ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Parse Job"
              )}
            </Button>
          </div>

          {parsedJob && (
            <div className="mt-4 p-4 border rounded-lg bg-green-50">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold">Job Parsed Successfully</h3>
              </div>
              <div className="space-y-2 text-sm">
                <p><strong>Title:</strong> {parsedJob.title}</p>
                <p><strong>Company:</strong> {parsedJob.company}</p>
                <p><strong>Location:</strong> {parsedJob.location}</p>
                {parsedJob.salary && <p><strong>Salary:</strong> {parsedJob.salary}</p>}
                <div>
                  <strong>Requirements:</strong>
                  <ul className="list-disc list-inside ml-2">
                    {parsedJob.requirements.map((req: string, index: number) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Response Generator */}
      {parsedJob && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5" />
              <span>AI Response Generator</span>
              {!features?.ai && <Badge variant="secondary">Requires API Key</Badge>}
            </CardTitle>
            <CardDescription>
              Generate tailored responses to application questions using AI and job details.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Application Question
              </label>
              <Textarea
                placeholder="e.g., Why are you interested in this role? What makes you a good fit? Tell us about your relevant experience..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={3}
              />
            </div>

            <Button
              onClick={handleGenerateResponse}
              disabled={!question.trim() || !features?.ai || isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Generating Response...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Generate AI Response
                </>
              )}
            </Button>

            {generatedResponse && (
              <div className="mt-4 p-4 border rounded-lg bg-blue-50">
                <h4 className="font-semibold mb-2">Generated Response:</h4>
                <p className="text-sm whitespace-pre-wrap">{generatedResponse}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => navigator.clipboard.writeText(generatedResponse)}
                >
                  Copy to Clipboard
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Coming Soon Features */}
      <Card>
        <CardHeader>
          <CardTitle>🚀 Coming Soon</CardTitle>
          <CardDescription>
            Features currently in development
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2">
            {[
              "Bulk job URL processing",
              "Resume upload and parsing",
              "Auto-fill browser extension",
              "Cover letter generation",
              "Application status tracking",
              "Interview scheduling integration"
            ].map((feature) => (
              <div key={feature} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <span className="text-sm text-gray-600">{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
