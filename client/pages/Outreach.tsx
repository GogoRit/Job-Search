import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { 
  Send, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  User,
  Building,
  Search,
  Plus
} from "lucide-react";

interface OutreachMessage {
  id: string;
  recipientName: string;
  recipientTitle: string;
  company: string;
  platform: "linkedin" | "email";
  subject: string;
  preview: string;
  status: "draft" | "sent" | "replied" | "viewed";
  sentDate?: string;
  replyDate?: string;
}

const mockOutreach: OutreachMessage[] = [
  {
    id: "1",
    recipientName: "Sarah Johnson",
    recipientTitle: "Engineering Manager",
    company: "TechCorp Inc.",
    platform: "linkedin",
    subject: "Interest in Frontend Developer Role",
    preview: "Hi Sarah, I noticed you're hiring for a Frontend Developer position...",
    status: "replied",
    sentDate: "2025-01-20",
    replyDate: "2025-01-21"
  },
  {
    id: "2",
    recipientName: "Mike Chen",
    recipientTitle: "CTO",
    company: "StartupXYZ", 
    platform: "email",
    subject: "Experienced React Developer - Let's Connect",
    preview: "Hello Mike, I'm a React developer with 5 years of experience...",
    status: "viewed",
    sentDate: "2025-01-19"
  }
];

const statusConfig = {
  draft: { icon: Clock, color: "bg-gray-500", label: "Draft" },
  sent: { icon: Send, color: "bg-blue-500", label: "Sent" },
  viewed: { icon: MessageSquare, color: "bg-yellow-500", label: "Viewed" },
  replied: { icon: CheckCircle, color: "bg-green-500", label: "Replied" }
};

export default function Outreach() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const filteredOutreach = mockOutreach.filter(message => {
    const matchesSearch = message.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || message.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Outreach Manager</h1>
            <p className="text-gray-600">
              Manage your networking messages and track responses
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Message
          </Button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedStatus === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus("all")}
              >
                All ({mockOutreach.length})
              </Button>
              {Object.entries(statusConfig).map(([status, config]) => {
                const count = mockOutreach.filter(msg => msg.status === status).length;
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

      {/* Outreach Messages */}
      <div className="grid gap-4">
        {filteredOutreach.map((message) => {
          const StatusIcon = statusConfig[message.status].icon;
          
          return (
            <Card key={message.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg mb-1">
                        {message.recipientName}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <span>{message.recipientTitle}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Building className="h-3 w-3" />
                          {message.company}
                        </div>
                      </CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge className="flex items-center gap-1">
                      <StatusIcon className="h-3 w-3" />
                      {statusConfig[message.status].label}
                    </Badge>
                    <Badge variant="outline">
                      {message.platform === "linkedin" ? "LinkedIn" : "Email"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="mb-4">
                  <h4 className="font-medium mb-2">{message.subject}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {message.preview}
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {message.sentDate && (
                      <span>Sent {new Date(message.sentDate).toLocaleDateString()}</span>
                    )}
                    {message.replyDate && (
                      <span className="text-green-600">
                        • Replied {new Date(message.replyDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Full
                    </Button>
                    {message.status === "draft" && (
                      <Button size="sm">
                        <Send className="h-4 w-4 mr-1" />
                        Send
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredOutreach.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No messages found</h3>
            <p className="text-gray-600 mb-4">
              Start networking by creating your first outreach message.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Message
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
