import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { 
  Bell, 
  BellOff, 
  Plus,
  Search,
  Briefcase,
  MapPin,
  Clock,
  Settings
} from "lucide-react";

interface JobAlert {
  id: string;
  title: string;
  keywords: string[];
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  isActive: boolean;
  frequency: "instant" | "daily" | "weekly";
  lastTriggered?: string;
  jobsFound: number;
}

const mockAlerts: JobAlert[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    keywords: ["React", "TypeScript", "JavaScript"],
    location: "San Francisco, CA",
    salaryMin: 120000,
    salaryMax: 180000,
    isActive: true,
    frequency: "daily",
    lastTriggered: "2025-01-23",
    jobsFound: 15
  },
  {
    id: "2",
    title: "Full Stack Engineer",
    keywords: ["Node.js", "React", "Python"],
    location: "Remote",
    isActive: true,
    frequency: "instant",
    lastTriggered: "2025-01-24",
    jobsFound: 8
  },
  {
    id: "3",
    title: "Lead Developer",
    keywords: ["Leadership", "Architecture", "TypeScript"],
    location: "New York, NY",
    salaryMin: 140000,
    isActive: false,
    frequency: "weekly",
    jobsFound: 3
  }
];

const frequencyConfig = {
  instant: { label: "Instant", color: "bg-green-500" },
  daily: { label: "Daily", color: "bg-blue-500" },
  weekly: { label: "Weekly", color: "bg-purple-500" }
};

export default function Alerts() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAlerts = mockAlerts.filter(alert =>
    alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.keywords.some(keyword => 
      keyword.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const activeAlerts = mockAlerts.filter(alert => alert.isActive).length;
  const totalJobsFound = mockAlerts.reduce((sum, alert) => sum + alert.jobsFound, 0);

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return "Not specified";
    if (min && max) return `$${(min/1000).toFixed(0)}K - $${(max/1000).toFixed(0)}K`;
    if (min) return `$${(min/1000).toFixed(0)}K+`;
    return `Up to $${(max!/1000).toFixed(0)}K`;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Job Alerts</h1>
            <p className="text-gray-600">
              Set up automated job searches and get notified of new opportunities
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Alert
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-sm text-gray-600">Active Alerts</div>
                <div className="text-2xl font-bold">{activeAlerts}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-sm text-gray-600">Jobs Found</div>
                <div className="text-2xl font-bold">{totalJobsFound}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <div className="text-sm text-gray-600">Last 24h</div>
                <div className="text-2xl font-bold">
                  {mockAlerts.filter(a => a.lastTriggered === "2025-01-24").length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search alerts by title or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <div className="grid gap-4">
        {filteredAlerts.map((alert) => (
          <Card key={alert.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg mb-2 flex items-center gap-2">
                    {alert.isActive ? (
                      <Bell className="h-5 w-5 text-green-500" />
                    ) : (
                      <BellOff className="h-5 w-5 text-gray-400" />
                    )}
                    {alert.title}
                  </CardTitle>
                  <CardDescription className="space-y-1">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {alert.location}
                      </div>
                      <div>
                        Salary: {formatSalary(alert.salaryMin, alert.salaryMax)}
                      </div>
                    </div>
                  </CardDescription>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge className={`${frequencyConfig[alert.frequency].color} text-white`}>
                    {frequencyConfig[alert.frequency].label}
                  </Badge>
                  <Switch checked={alert.isActive} />
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium mb-2">Keywords:</div>
                  <div className="flex gap-2 flex-wrap">
                    {alert.keywords.map((keyword, index) => (
                      <Badge key={index} variant="outline">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{alert.jobsFound} jobs found</span>
                    {alert.lastTriggered && (
                      <span>
                        Last triggered: {new Date(alert.lastTriggered).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      View Jobs ({alert.jobsFound})
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAlerts.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No alerts found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? "No alerts match your search criteria."
                : "Create your first job alert to get notified of new opportunities."
              }
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create First Alert
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
