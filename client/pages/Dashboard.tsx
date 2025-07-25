import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  FileText, 
  Send, 
  Calendar,
  Plus,
  Eye,
  Edit3,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertCircle,
  Users
} from "lucide-react";

const stats = [
  {
    title: "Total Applications",
    value: "24",
    change: "+12%",
    changeType: "positive" as const,
    icon: FileText,
  },
  {
    title: "Response Rate",
    value: "42%",
    change: "+8%",
    changeType: "positive" as const,
    icon: TrendingUp,
  },
  {
    title: "Interviews Scheduled",
    value: "8",
    change: "+25%",
    changeType: "positive" as const,
    icon: Calendar,
  },
  {
    title: "Pending Follow-ups",
    value: "6",
    change: "-2",
    changeType: "neutral" as const,
    icon: Clock,
  },
];

const applications = [
  {
    id: 1,
    company: "Google",
    position: "Senior Software Engineer",
    status: "interview",
    appliedDate: "2024-01-15",
    nextAction: "Technical Interview",
    nextActionDate: "2024-01-22",
    salary: "$180k - $220k",
    location: "Mountain View, CA",
    fitScore: 95,
  },
  {
    id: 2,
    company: "Meta",
    position: "Frontend Engineer",
    status: "applied",
    appliedDate: "2024-01-14",
    nextAction: "Follow-up Email",
    nextActionDate: "2024-01-21",
    salary: "$170k - $200k",
    location: "Menlo Park, CA",
    fitScore: 88,
  },
  {
    id: 3,
    company: "OpenAI",
    position: "Full Stack Developer",
    status: "response",
    appliedDate: "2024-01-12",
    nextAction: "Phone Screen",
    nextActionDate: "2024-01-20",
    salary: "$160k - $190k",
    location: "San Francisco, CA",
    fitScore: 92,
  },
  {
    id: 4,
    company: "Stripe",
    position: "Backend Engineer",
    status: "rejected",
    appliedDate: "2024-01-10",
    nextAction: "None",
    nextActionDate: null,
    salary: "$150k - $180k",
    location: "San Francisco, CA",
    fitScore: 78,
  },
];

const getStatusBadge = (status: string) => {
  const variants = {
    applied: { variant: "secondary" as const, label: "Applied", icon: FileText },
    response: { variant: "default" as const, label: "Response", icon: MessageSquare },
    interview: { variant: "default" as const, label: "Interview", icon: Calendar },
    rejected: { variant: "destructive" as const, label: "Rejected", icon: AlertCircle },
  };
  
  const config = variants[status as keyof typeof variants] || variants.applied;
  const Icon = config.icon;
  
  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};

export default function Dashboard() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your job applications and progress</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Job Application
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className={`text-xs ${
                  stat.changeType === 'positive' ? 'text-green-600' : 
                  stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Applications List */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Applications
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </CardTitle>
              <CardDescription>
                Your latest job applications and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {app.company.substring(0, 2)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{app.position}</h3>
                        <p className="text-sm text-gray-600">{app.company} • {app.location}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {getStatusBadge(app.status)}
                          <span className="text-xs text-gray-500">
                            Applied {new Date(app.appliedDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          {app.fitScore}% fit
                        </span>
                        <div className="w-16">
                          <Progress value={app.fitScore} className="h-2" />
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{app.salary}</p>
                      {app.nextActionDate && (
                        <p className="text-xs text-blue-600 font-medium">
                          {app.nextAction} - {new Date(app.nextActionDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Analytics */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Add New Job
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Send className="h-4 w-4 mr-2" />
                Send Follow-up
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Find Referrals
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
            </CardContent>
          </Card>

          {/* This Week */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>This Week</CardTitle>
              <CardDescription>Upcoming actions and deadlines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Technical Interview</span>
                </div>
                <span className="text-xs text-gray-500">Jan 22</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Follow-up Email</span>
                </div>
                <span className="text-xs text-gray-500">Jan 21</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">Phone Screen</span>
                </div>
                <span className="text-xs text-gray-500">Jan 20</span>
              </div>
            </CardContent>
          </Card>

          {/* Performance */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Performance</CardTitle>
              <CardDescription>Your job search metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Response Rate</span>
                    <span>42%</span>
                  </div>
                  <Progress value={42} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Interview Rate</span>
                    <span>33%</span>
                  </div>
                  <Progress value={33} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Profile Completeness</span>
                    <span>85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
