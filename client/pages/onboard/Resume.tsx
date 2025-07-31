import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Upload, FileText, CheckCircle, User, Briefcase, Mail, MapPin, ArrowLeft, Calendar, Building2, GraduationCap, Link } from "lucide-react";
import { useOnboarding } from "../../contexts/OnboardingContext";

interface WorkExperience {
  company: string;
  title: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  description?: string;
  duration?: string;
}

interface ParsedResumeData {
  name: string;
  email: string;
  phone: string;
  title: string;
  summary: string;
  skills: string[];
  experience: WorkExperience[];
  education: string;
  location: string;
  linkedin_url?: string;
  github_url?: string;
  years_experience?: number;
}

export default function Resume() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedResumeData | null>(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { setResumeUploaded } = useOnboarding();

  const handleFileSelect = (selectedFile: File) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/jpg'
    ];
    
    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Please upload a PDF, Word document, or image file (JPG, PNG)");
      return;
    }
    setFile(selectedFile);
    setError("");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const uploadResume = async () => {
    if (!file) return;

    setIsUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/resume/upload-ocr', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to upload resume');
      }

      const data = await response.json();
      
      // Transform the response to match our interface
      const transformedData: ParsedResumeData = {
        name: data.parsed_data?.name || "Unknown",
        email: data.parsed_data?.email || "",
        phone: data.parsed_data?.phone || "",
        title: data.parsed_data?.title || "",
        summary: data.parsed_data?.summary || "",
        skills: data.parsed_data?.skills || [],
        experience: data.parsed_data?.experience || [],
        education: data.parsed_data?.education || "",
        location: data.parsed_data?.location || "",
        linkedin_url: data.parsed_data?.linkedin_url,
        github_url: data.parsed_data?.github_url,
        years_experience: data.parsed_data?.years_experience
      };      setParsedData(transformedData);
      
      // Auto-continue after successful upload
      setTimeout(() => {
        setResumeUploaded(true);
        navigate("/onboard/linkedin");
      }, 2000); // Show success for 2 seconds then continue
      
    } catch (err) {
      console.error('Resume upload error:', err);
      setError(`Failed to parse resume: ${err instanceof Error ? err.message : 'Please try again.'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleContinue = () => {
    setResumeUploaded(true); // Only mark as uploaded when actually continuing with parsed data
    navigate("/onboard/linkedin");
  };

  const handleSkip = () => {
    // Mark resume as uploaded (even if skipped) so user can complete it later
    setResumeUploaded(true);
    // Skip resume upload and go to next onboarding step
    navigate("/onboard/linkedin");
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
          <FileText className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Upload Your Resume
        </h1>
        <p className="text-gray-600">
          We'll parse your resume to personalize your job applications
        </p>
      </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle>Resume Analysis</CardTitle>
            <CardDescription>
              Upload your resume in PDF, Word, or image format
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {!parsedData ? (
              <>
                {/* File Upload Area */}
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                    isDragging 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onDragEnter={() => setIsDragging(true)}
                  onDragLeave={() => setIsDragging(false)}
                >
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  {file ? (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-lg font-medium text-gray-900">
                        Drop your resume here
                      </p>
                      <p className="text-gray-500">or click to browse</p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-4"
                  >
                    Choose File
                  </Button>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/')}
                    disabled={isUploading}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={uploadResume}
                    disabled={!file || isUploading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {isUploading ? "Parsing..." : "Upload & Parse"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSkip}
                    disabled={isUploading}
                  >
                    Skip
                  </Button>
                </div>
              </>
            ) : (
              /* Success notification only */
              <div className="space-y-6">
                <div className="flex items-center justify-center gap-2 text-green-600 font-semibold text-lg">
                  <CheckCircle className="h-6 w-6" />
                  Resume parsed successfully!
                </div>

                <div className="text-center text-gray-600">
                  <p>Your resume has been successfully processed and parsed.</p>
                  <p className="text-sm mt-2">Redirecting to LinkedIn setup...</p>
                </div>

                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Step 2 of 3 • Resume parsing
          </p>
        </div>
    </div>
  );
}
