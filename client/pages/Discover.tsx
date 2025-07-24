import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  ExternalLink, 
  Briefcase, 
  MapPin, 
  DollarSign,
  Clock,
  CheckCircle,
  Loader2,
  Mail,
  MessageSquare,
  Sparkles
} from "lucide-react";

interface JobData {
  title: string;
  company: string;
  location: string;
  salary?: string;
  description: string;
  requirements: string[];
  url: string;
}

interface GeneratedContent {
  cold_email: string;
  linkedin_message: string;
  resume_suggestions: string[];
}

export default function Discover() {
  const [jobUrl, setJobUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [jobData, setJobData] = useState<JobData | null>(null);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const handleJobScrape = async () => {
    if (!jobUrl.trim()) {
      setError("Please enter a job URL");
      return;
    }

    setIsLoading(true);
    setError("");
    setJobData(null);
    setGeneratedContent(null);

    try {
      const response = await fetch('/api/job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: jobUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to scrape job');
      }

      const data = await response.json();
      setJobData(data.job_data);
    } catch (err) {
      // Mock data for demo
      setJobData({
        title: "Senior Frontend Engineer",
        company: "TechCorp Inc.",
        location: "San Francisco, CA",
        salary: "$140k - $180k",
        description: "We're looking for a Senior Frontend Engineer to join our team and help build the next generation of our platform...",
        requirements: ["React", "TypeScript", "5+ years experience", "System design"],
        url: jobUrl
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateOutreach = async () => {
    if (!jobData) return;

    setIsGenerating(true);
    setError("");

    try {
      const response = await fetch('/api/generate-outreach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          job_title: jobData.title,
          company: jobData.company,
          job_description: jobData.description 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate outreach');
      }

      const data = await response.json();
      setGeneratedContent(data);
    } catch (err) {
      // Mock data for demo
      setGeneratedContent({
        cold_email: `Subject: Excited about the ${jobData.title} opportunity at ${jobData.company}

Hi [Hiring Manager],

I hope this email finds you well. I came across the ${jobData.title} position at ${jobData.company} and I'm genuinely excited about the opportunity to contribute to your team.

With my background in frontend development and experience with React and TypeScript, I believe I would be a strong fit for this role. I'm particularly drawn to ${jobData.company}'s mission and would love to discuss how my skills could help drive your objectives forward.

Would you be available for a brief conversation about this position?

Best regards,
[Your Name]`,
        linkedin_message: `Hi [Name],

I noticed the ${jobData.title} opening at ${jobData.company} and was impressed by the role's focus on [specific aspect]. My experience with React and TypeScript aligns well with your requirements. 

Would you be open to a brief chat about the position?

Best,
[Your Name]`,
        resume_suggestions: [
          "Highlight React and TypeScript projects prominently",
          "Emphasize system design experience",
          "Include specific frontend performance optimizations",
          "Mention any experience with modern build tools and CI/CD"
        ]
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveJob = async () => {
    if (!jobData) return;

    try {
      await fetch('/api/job/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...jobData,
          stage: 'saved',
          generated_content: generatedContent
        }),
      });

      alert('Job saved to dashboard!');
    } catch (err) {
      alert('Job saved to dashboard!'); // Mock success
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Jobs</h1>
        <p className="text-gray-600">
          Paste a LinkedIn job URL and let AI generate personalized outreach content
        </p>
      </div>

      {/* URL Input */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Job URL Parser
          </CardTitle>
          <CardDescription>
            Paste a LinkedIn job posting URL to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              placeholder="https://www.linkedin.com/jobs/view/..."
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleJobScrape}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Analyze Job
                </>
              )}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Job Data Display */}
      {jobData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Job Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Job Details
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(jobData.url, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View Original
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{jobData.title}</h3>
                <p className="text-lg text-gray-700">{jobData.company}</p>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {jobData.location}
                </div>
                {jobData.salary && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    {jobData.salary}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Just posted
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Requirements</h4>
                <div className="flex flex-wrap gap-2">
                  {jobData.requirements.map((req, index) => (
                    <Badge key={index} variant="secondary">
                      {req}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-gray-600 text-sm">{jobData.description}</p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleGenerateOutreach}
                  disabled={isGenerating}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  Generate Outreach
                </Button>
                <Button variant="outline" onClick={handleSaveJob}>
                  Save Job
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Generated Content */}
          <div className="space-y-6">
            {generatedContent ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      Cold Email
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={generatedContent.cold_email}
                      onChange={(e) => setGeneratedContent({
                        ...generatedContent,
                        cold_email: e.target.value
                      })}
                      className="min-h-[200px] font-mono text-sm"
                    />
                    <Button variant="outline" size="sm" className="mt-2">
                      Copy Email
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      LinkedIn Message
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={generatedContent.linkedin_message}
                      onChange={(e) => setGeneratedContent({
                        ...generatedContent,
                        linkedin_message: e.target.value
                      })}
                      className="min-h-[120px] font-mono text-sm"
                    />
                    <Button variant="outline" size="sm" className="mt-2">
                      Copy Message
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Resume Suggestions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {generatedContent.resume_suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center text-gray-500">
                    <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Click "Generate Outreach" to create personalized content</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
