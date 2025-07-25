import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { 
  FileText, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  ExternalLink,
  Filter
} from "lucide-react";

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  status: "applied" | "interviewing" | "rejected" | "offer";
  platform: string;
  fitScore: number;
  nextAction?: string;
  nextActionDate?: string;
}

const mockApplications: Application[] = [
  {
    id: "1",
    jobTitle: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    appliedDate: "2025-01-20",
    status: "interviewing",
    platform: "LinkedIn",
    fitScore: 92,
    nextAction: "Technical Interview",
    nextActionDate: "2025-01-25"
  },
  {
    id: "2", 
    jobTitle: "React Developer",
    company: "StartupXYZ",
    appliedDate: "2025-01-18",
    status: "applied",
    platform: "Indeed",
    fitScore: 85,
    nextAction: "Follow up",
    nextActionDate: "2025-01-23"
  },
  {
    id: "3",
    jobTitle: "Full Stack Engineer",
    company: "BigTech Corp",
    appliedDate: "2025-01-15",
    status: "rejected",
    platform: "Company Site",
    fitScore: 78
  }
];

const statusConfig = {
  applied: { icon: Clock, color: "bg-blue-500", label: "Applied" },
  interviewing: { icon: Calendar, color: "bg-yellow-500", label: "Interviewing" },
  rejected: { icon: XCircle, color: "bg-red-500", label: "Rejected" },
  offer: { icon: CheckCircle, color: "bg-green-500", label: "Offer" }
};

export default function Applications() {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const filteredApplications = selectedStatus === "all" 
    ? mockApplications 
    : mockApplications.filter(app => app.status === selectedStatus);

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Application Tracker</h1>
        <p className="text-gray-600">
          Monitor your job applications and track your progress
        </p>
      </div>

      {/* Filter Bar */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <div className="flex gap-2">
              <Button
                variant={selectedStatus === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus("all")}
              >
                All ({mockApplications.length})
              </Button>
              {Object.entries(statusConfig).map(([status, config]) => {
                const count = mockApplications.filter(app => app.status === status).length;
                return (
                  <Button
                    key={status}
                    variant={selectedStatus === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedStatus(status)}
                  >
                    {config.label} ({count})
                  </Button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications Grid */}
      <div className="grid gap-6">
        {filteredApplications.map((application) => {
          const StatusIcon = statusConfig[application.status].icon;
          
          return (
            <Card key={application.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl mb-1">
                      {application.jobTitle}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {application.company} • Applied via {application.platform}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Fit Score</div>
                      <div className={`text-lg font-bold ${getScoreColor(application.fitScore)}`}>
                        {application.fitScore}%
                      </div>
                    </div>
                    <Progress 
                      value={application.fitScore} 
                      className="w-16"
                    />
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Badge 
                      variant="secondary" 
                      className="flex items-center gap-1"
                    >
                      <StatusIcon className="h-3 w-3" />
                      {statusConfig[application.status].label}
                    </Badge>
                    
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      Applied {new Date(application.appliedDate).toLocaleDateString()}
                    </div>
                    
                    {application.nextAction && (
                      <div className="flex items-center gap-1 text-sm text-orange-600">
                        <AlertCircle className="h-4 w-4" />
                        {application.nextAction}
                        {application.nextActionDate && (
                          <span className="text-gray-500">
                            • {new Date(application.nextActionDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Open Job
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredApplications.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No applications found</h3>
            <p className="text-gray-600 mb-4">
              {selectedStatus === "all" 
                ? "You haven't applied to any jobs yet. Start by discovering jobs in the Discover tab."
                : `No applications with status "${statusConfig[selectedStatus as keyof typeof statusConfig]?.label}"`
              }
            </p>
            <Button>
              <ExternalLink className="h-4 w-4 mr-2" />
              Discover Jobs
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
