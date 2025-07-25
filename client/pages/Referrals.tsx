import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { 
  Users, 
  UserPlus, 
  MessageCircle, 
  Star,
  Building,
  Search,
  ExternalLink,
  Calendar
} from "lucide-react";

interface Referral {
  id: string;
  name: string;
  title: string;
  company: string;
  connectionStrength: "strong" | "medium" | "weak";
  lastContact: string;
  mutualConnections: number;
  canRefer: boolean;
  notes?: string;
}

const mockReferrals: Referral[] = [
  {
    id: "1",
    name: "Jennifer Walsh",
    title: "Senior Engineering Manager",
    company: "TechCorp Inc.",
    connectionStrength: "strong",
    lastContact: "2025-01-15",
    mutualConnections: 12,
    canRefer: true,
    notes: "Former colleague at StartupABC"
  },
  {
    id: "2",
    name: "David Kim",
    title: "CTO",
    company: "InnovateLabs",
    connectionStrength: "medium",
    lastContact: "2024-12-10",
    mutualConnections: 5,
    canRefer: true,
    notes: "Met at React conference 2024"
  }
];

const strengthConfig = {
  strong: { color: "bg-green-500", label: "Strong", icon: "🟢" },
  medium: { color: "bg-yellow-500", label: "Medium", icon: "🟡" },
  weak: { color: "bg-red-500", label: "Weak", icon: "🔴" }
};

export default function Referrals() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredReferrals = mockReferrals.filter(referral => {
    return referral.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           referral.company.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Referral Network</h1>
            <p className="text-gray-600">
              Manage your professional network and track referral opportunities
            </p>
          </div>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Referrals Grid */}
      <div className="grid gap-4">
        {filteredReferrals.map((referral) => (
          <Card key={referral.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {referral.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <CardTitle className="text-lg mb-1">
                      {referral.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <span>{referral.title}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Building className="h-3 w-3" />
                        {referral.company}
                      </div>
                    </CardDescription>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge>
                    <span>{strengthConfig[referral.connectionStrength].icon}</span>
                    {strengthConfig[referral.connectionStrength].label}
                  </Badge>
                  {referral.canRefer && (
                    <Badge variant="secondary">Can Refer</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                {referral.notes && (
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    {referral.notes}
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Last contact: {new Date(referral.lastContact).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {referral.mutualConnections} mutual connections
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                    {referral.canRefer && (
                      <Button size="sm">
                        <Star className="h-4 w-4 mr-1" />
                        Request Referral
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReferrals.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No contacts found</h3>
            <p className="text-gray-600 mb-4">
              Start building your referral network by adding professional contacts.
            </p>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add First Contact
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
