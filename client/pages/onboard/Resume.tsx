import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Upload, FileText, CheckCircle, User, Briefcase, Mail, MapPin, ArrowLeft } from "lucide-react";
import { useOnboarding } from "../../contexts/OnboardingContext";

interface ParsedResumeData {
  name: string;
  email: string;
  title: string;
  skills: string[];
  experience: string;
  location?: string;
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
      
      // Transform the OCR response to match our expected interface
      const transformedData: ParsedResumeData = {
        name: data.personal_info?.name || 'Not specified',
        email: data.personal_info?.email || 'Not specified',
        title: data.personal_info?.title || 'Not specified',
        skills: data.skills || [],
        experience: data.experience?.join('\n') || 'No experience data found',
        location: data.personal_info?.location
      };
      
      setParsedData(transformedData);
    } catch (err) {
      console.error('Resume upload error:', err);
      setError(`Failed to parse resume: ${err instanceof Error ? err.message : 'Please try again.'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleContinue = () => {
    setResumeUploaded(true); // Only mark as uploaded when actually continuing with parsed data
    navigate("/onboard/profile");
  };

  const handleSkip = () => {
    // Don't mark as uploaded when skipping - just navigate
    navigate("/onboard/profile");
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
              /* Parsed Data Display */
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-green-600 font-semibold">
                  <CheckCircle className="h-5 w-5" />
                  Resume parsed successfully!
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <User className="h-4 w-4" />
                      Name
                    </div>
                    <p className="text-gray-900">{parsedData.name}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Mail className="h-4 w-4" />
                      Email
                    </div>
                    <p className="text-gray-900">{parsedData.email}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Briefcase className="h-4 w-4" />
                      Title
                    </div>
                    <p className="text-gray-900">{parsedData.title}</p>
                  </div>

                  {parsedData.location && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <MapPin className="h-4 w-4" />
                        Location
                      </div>
                      <p className="text-gray-900">{parsedData.location}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700">Skills</div>
                  <div className="flex flex-wrap gap-2">
                    {parsedData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/')}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={handleContinue}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Continue to Profile Setup
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Step 2 of 4 • Resume parsing
          </p>
        </div>
    </div>
  );
}
