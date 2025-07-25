import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { CheckCircle, User, ArrowLeft, Lock } from "lucide-react";
import { useOnboarding } from "../../contexts/OnboardingContext";
import { useToast } from "../../hooks/use-toast";

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  title: string;
  summary: string;
  skills: string;
  experience: string;
  username: string;
  password: string;
}

export default function Profile() {
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    email: "",
    phone: "",
    title: "",
    summary: "",
    skills: "",
    experience: "",
    username: "",
    password: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setProfileCompleted } = useOnboarding();

  // Load resume data on component mount
  useEffect(() => {
    loadResumeData();
  }, []);

  const loadResumeData = async () => {
    try {
      setIsLoadingData(true);
      const response = await fetch('/api/resume/data');
      const result = await response.json();
      
      if (result.success && result.data) {
        const resumeData = result.data;
        setProfileData(prev => ({
          ...prev,
          name: resumeData.name || "",
          email: resumeData.email || "",
          phone: resumeData.phone || "",
          title: resumeData.title || "",
          summary: resumeData.summary || "",
          skills: Array.isArray(resumeData.skills) ? resumeData.skills.join(", ") : (resumeData.skills || ""),
          experience: resumeData.experience || "",
        }));
        
        toast({
          title: "Resume data loaded",
          description: "Your profile has been pre-filled with resume information.",
        });
      } else {
        toast({
          title: "No resume data found",
          description: "Please fill out your profile manually.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Failed to load resume data:', error);
      toast({
        title: "Error loading resume data",
        description: "Please fill out your profile manually.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingData(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!profileData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!profileData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!profileData.title.trim()) {
      newErrors.title = "Current title/position is required";
    }

    if (!profileData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (profileData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!profileData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (profileData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Send profile data to backend
      const response = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        throw new Error('Failed to save profile');
      }

      const result = await response.json();
      
      if (result.success) {
        setSuccess(true);
        setProfileCompleted(true);
        
        setTimeout(() => {
          navigate('/onboard/linkedin');
        }, 2000);
      } else {
        throw new Error(result.message || 'Failed to save profile');
      }
      
    } catch (error) {
      console.error('Failed to save profile:', error);
      toast({
        title: "Error saving profile",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Loading Profile Data
          </h1>
          <p className="text-gray-600">
            Retrieving your resume information...
          </p>
        </div>
        <Card className="shadow-xl border-0">
          <CardContent className="p-8">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
          <User className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Complete Your Profile
        </h1>
        <p className="text-gray-600">
          Review and complete your profile information
        </p>
      </div>

      <Card className="shadow-xl border-0">
        <CardHeader className="text-center pb-4">
          <CardTitle>Profile Setup</CardTitle>
          <CardDescription>
            Your information has been pre-filled from your resume. Please review and complete any missing details.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {success ? (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-600 mb-2">
                Profile Complete!
              </h3>
              <p className="text-gray-600">
                Continuing to LinkedIn setup...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 border-b pb-2">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      value={profileData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={errors.name ? "border-red-500" : ""}
                      placeholder="Your full name"
                    />
                    {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={errors.email ? "border-red-500" : ""}
                      placeholder="your.email@example.com"
                    />
                    {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div>
                    <Label htmlFor="title">Current Title/Position *</Label>
                    <Input
                      id="title"
                      type="text"
                      value={profileData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className={errors.title ? "border-red-500" : ""}
                      placeholder="Software Engineer, Product Manager, etc."
                    />
                    {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 border-b pb-2">Professional Information</h3>
                
                <div>
                  <Label htmlFor="summary">Professional Summary</Label>
                  <Textarea
                    id="summary"
                    value={profileData.summary}
                    onChange={(e) => handleInputChange('summary', e.target.value)}
                    placeholder="Brief description of your background and goals..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="skills">Skills</Label>
                  <Input
                    id="skills"
                    type="text"
                    value={profileData.skills}
                    onChange={(e) => handleInputChange('skills', e.target.value)}
                    placeholder="JavaScript, Python, Project Management, etc. (comma-separated)"
                  />
                </div>

                <div>
                  <Label htmlFor="experience">Experience Summary</Label>
                  <Textarea
                    id="experience"
                    value={profileData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    placeholder="Brief overview of your work experience..."
                    rows={4}
                  />
                </div>
              </div>

              {/* Account Creation */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Account Creation
                </h3>
                
                <Alert>
                  <Lock className="h-4 w-4" />
                  <AlertDescription>
                    We'll save your progress securely and link it to your account. 
                    Your credentials will be encrypted and stored safely.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="username">Username *</Label>
                    <Input
                      id="username"
                      type="text"
                      value={profileData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className={errors.username ? "border-red-500" : ""}
                      placeholder="Choose a username"
                    />
                    {errors.username && <p className="text-sm text-red-500 mt-1">{errors.username}</p>}
                  </div>

                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={profileData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={errors.password ? "border-red-500" : ""}
                      placeholder="Create a secure password"
                    />
                    {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/onboard/resume')}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isLoading ? "Saving Profile..." : "Continue to LinkedIn"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Step 3 of 4 • Profile setup
        </p>
      </div>
    </div>
  );
}
