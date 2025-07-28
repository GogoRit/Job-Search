import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Badge } from "../../components/ui/badge";
import { CheckCircle, User, ArrowLeft, Lock, Plus, X, Edit2, Save, Cancel, Building, MapPin, Calendar, Briefcase } from "lucide-react";
import { useOnboarding } from "../../contexts/OnboardingContext";
import { useToast } from "../../hooks/use-toast";

interface WorkExperience {
  company: string;
  title: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  description?: string;
  duration?: string;
}

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  title: string;
  summary: string;
  skills: string[];
  experience: WorkExperience[];
  location: string;
  linkedin_url: string;
  portfolio_url: string;
  github_url: string;
  years_experience: number | null;
  certifications: string[];
  languages: string[];
  availability: string;
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
    skills: [],
    experience: [],
    location: "",
    linkedin_url: "",
    portfolio_url: "",
    github_url: "",
    years_experience: null,
    certifications: [],
    languages: [],
    availability: "",
    username: "",
    password: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [editingSkills, setEditingSkills] = useState(false);
  const [editingCertifications, setEditingCertifications] = useState(false);
  const [editingLanguages, setEditingLanguages] = useState(false);
  const [editingExperience, setEditingExperience] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [newCertification, setNewCertification] = useState("");
  const [newLanguage, setNewLanguage] = useState("");
  const [newExperience, setNewExperience] = useState<WorkExperience>({
    company: "",
    title: "",
    location: "",
    start_date: "",
    end_date: "",
    description: "",
    duration: ""
  });
  
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
          skills: Array.isArray(resumeData.skills) ? resumeData.skills : [],
          experience: Array.isArray(resumeData.experience) ? resumeData.experience : [],
          location: resumeData.location || "",
          linkedin_url: resumeData.linkedin_url || "",
          portfolio_url: resumeData.portfolio_url || "",
          github_url: resumeData.github_url || "",
          years_experience: resumeData.years_experience || null,
          certifications: Array.isArray(resumeData.certifications) ? resumeData.certifications : [],
          languages: Array.isArray(resumeData.languages) ? resumeData.languages : [],
          availability: resumeData.availability || "",
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

  const handleInputChange = (field: keyof ProfileData, value: string | number | null) => {
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

  // Helper functions for managing arrays
  const addSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const addCertification = () => {
    if (newCertification.trim() && !profileData.certifications.includes(newCertification.trim())) {
      setProfileData(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()]
      }));
      setNewCertification("");
    }
  };

  const removeCertification = (certToRemove: string) => {
    setProfileData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert !== certToRemove)
    }));
  };

  const addLanguage = () => {
    if (newLanguage.trim() && !profileData.languages.includes(newLanguage.trim())) {
      setProfileData(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()]
      }));
      setNewLanguage("");
    }
  };

  const removeLanguage = (langToRemove: string) => {
    setProfileData(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang !== langToRemove)
    }));
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
              <div className="space-y-6">
                <h3 className="font-semibold text-gray-900 border-b pb-2">Professional Information</h3>
                
                {/* Professional Summary */}
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

                {/* Additional Fields Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      type="text"
                      value={profileData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="City, State/Country"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="years_experience">Years of Experience</Label>
                    <Input
                      id="years_experience"
                      type="number"
                      value={profileData.years_experience || ''}
                      onChange={(e) => handleInputChange('years_experience', parseInt(e.target.value) || null)}
                      placeholder="5"
                      min="0"
                      max="50"
                    />
                  </div>

                  <div>
                    <Label htmlFor="availability">Availability</Label>
                    <Input
                      id="availability"
                      type="text"
                      value={profileData.availability}
                      onChange={(e) => handleInputChange('availability', e.target.value)}
                      placeholder="Immediately, 2 weeks notice, etc."
                    />
                  </div>
                </div>

                {/* URLs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                    <Input
                      id="linkedin_url"
                      type="url"
                      value={profileData.linkedin_url}
                      onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>

                  <div>
                    <Label htmlFor="github_url">GitHub URL</Label>
                    <Input
                      id="github_url"
                      type="url"
                      value={profileData.github_url}
                      onChange={(e) => handleInputChange('github_url', e.target.value)}
                      placeholder="https://github.com/yourusername"
                    />
                  </div>

                  <div>
                    <Label htmlFor="portfolio_url">Portfolio/Website URL</Label>
                    <Input
                      id="portfolio_url"
                      type="url"
                      value={profileData.portfolio_url}
                      onChange={(e) => handleInputChange('portfolio_url', e.target.value)}
                      placeholder="https://yourportfolio.com"
                    />
                  </div>
                </div>

                {/* Skills Card */}
                <div>
                  <Label className="text-base font-medium">Skills</Label>
                  <Card className="mt-2">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Skills Display */}
                        <div className="flex flex-wrap gap-2">
                          {profileData.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                              {skill}
                              <button
                                type="button"
                                onClick={() => removeSkill(skill)}
                                className="ml-1 hover:text-red-500"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                          {profileData.skills.length === 0 && (
                            <p className="text-sm text-gray-500">No skills added yet</p>
                          )}
                        </div>
                        
                        {/* Add Skill */}
                        <div className="flex gap-2">
                          <Input
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            placeholder="Add a skill (e.g., JavaScript, Project Management)"
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                          />
                          <Button type="button" onClick={addSkill} size="sm">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Experience Summary */}
                <div>
                  <Label htmlFor="experience">Experience Summary</Label>
                  <Card className="mt-2">
                    <CardContent className="p-4">
                      <Textarea
                        id="experience"
                        value={profileData.experience}
                        onChange={(e) => handleInputChange('experience', e.target.value)}
                        placeholder="Brief overview of your work experience, key achievements, and responsibilities..."
                        rows={4}
                        className="border-0 resize-none focus:ring-0"
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Certifications Card */}
                <div>
                  <Label className="text-base font-medium">Certifications</Label>
                  <Card className="mt-2">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Certifications Display */}
                        <div className="space-y-2">
                          {profileData.certifications.map((cert, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <span className="text-sm">{cert}</span>
                              <button
                                type="button"
                                onClick={() => removeCertification(cert)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                          {profileData.certifications.length === 0 && (
                            <p className="text-sm text-gray-500">No certifications added yet</p>
                          )}
                        </div>
                        
                        {/* Add Certification */}
                        <div className="flex gap-2">
                          <Input
                            value={newCertification}
                            onChange={(e) => setNewCertification(e.target.value)}
                            placeholder="Add a certification (e.g., AWS Solutions Architect)"
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                          />
                          <Button type="button" onClick={addCertification} size="sm">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Languages Card */}
                <div>
                  <Label className="text-base font-medium">Languages</Label>
                  <Card className="mt-2">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Languages Display */}
                        <div className="flex flex-wrap gap-2">
                          {profileData.languages.map((language, index) => (
                            <Badge key={index} variant="outline" className="flex items-center gap-1">
                              {language}
                              <button
                                type="button"
                                onClick={() => removeLanguage(language)}
                                className="ml-1 hover:text-red-500"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                          {profileData.languages.length === 0 && (
                            <p className="text-sm text-gray-500">No languages added yet</p>
                          )}
                        </div>
                        
                        {/* Add Language */}
                        <div className="flex gap-2">
                          <Input
                            value={newLanguage}
                            onChange={(e) => setNewLanguage(e.target.value)}
                            placeholder="Add a language (e.g., Spanish, Python, French)"
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
                          />
                          <Button type="button" onClick={addLanguage} size="sm">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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
