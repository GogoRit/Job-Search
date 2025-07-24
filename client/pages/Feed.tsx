import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Hash, 
  TrendingUp, 
  Users, 
  MessageSquare,
  Heart,
  Repeat2,
  Share,
  Briefcase,
  MapPin,
  Clock,
  Search,
  Filter
} from "lucide-react";

interface FeedPost {
  id: string;
  author: {
    name: string;
    title: string;
    company: string;
  };
  content: string;
  hashtags: string[];
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
  timestamp: string;
  type: 'hiring' | 'referral' | 'company_update';
}

const mockPosts: FeedPost[] = [
  {
    id: '1',
    author: {
      name: 'Sarah Johnson',
      title: 'Senior Engineering Manager',
      company: 'TechCorp'
    },
    content: "We're hiring a Senior Frontend Engineer to join our platform team! Looking for someone passionate about React, TypeScript, and building scalable user experiences. Remote-friendly with competitive compensation. DM me if interested! 🚀",
    hashtags: ['hiring', 'frontend', 'react', 'typescript', 'remote'],
    engagement: {
      likes: 47,
      comments: 12,
      shares: 8
    },
    timestamp: '2h',
    type: 'hiring'
  },
  {
    id: '2',
    author: {
      name: 'Mike Chen',
      title: 'Head of Talent',
      company: 'StartupXYZ'
    },
    content: "Happy to provide referrals for Backend Engineer positions at our company! We're scaling rapidly and need talented engineers. Drop your resume in my DMs and I'll fast-track you through our process.",
    hashtags: ['referral', 'backend', 'startup', 'engineering'],
    engagement: {
      likes: 23,
      comments: 6,
      shares: 4
    },
    timestamp: '4h',
    type: 'referral'
  },
  {
    id: '3',
    author: {
      name: 'Emily Rodriguez',
      title: 'Product Manager',
      company: 'InnovateLabs'
    },
    content: "Just closed a $50M Series B! This means we're expanding our team across all departments. Particularly looking for PMs, Engineers, and Designers. Amazing time to join our mission. 💪",
    hashtags: ['hiring', 'seriesb', 'productmanager', 'growth'],
    engagement: {
      likes: 156,
      comments: 34,
      shares: 22
    },
    timestamp: '6h',
    type: 'company_update'
  }
];

const hashtags = ['hiring', 'referral', 'jobs', 'frontend', 'backend', 'remote', 'startup', 'engineering'];

export default function Feed() {
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>(['hiring']);
  const [searchQuery, setSearchQuery] = useState("");
  const [posts] = useState<FeedPost[]>(mockPosts);

  const toggleHashtag = (hashtag: string) => {
    setSelectedHashtags(prev => 
      prev.includes(hashtag) 
        ? prev.filter(h => h !== hashtag)
        : [...prev, hashtag]
    );
  };

  const filteredPosts = posts.filter(post => {
    const matchesHashtags = selectedHashtags.length === 0 || 
      post.hashtags.some(tag => selectedHashtags.includes(tag));
    const matchesSearch = searchQuery === "" || 
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.company.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesHashtags && matchesSearch;
  });

  const generateReply = async (post: FeedPost) => {
    // Mock AI reply generation
    const replies = [
      "Very interested! I have 5+ years of React experience and would love to learn more about this opportunity.",
      "This sounds like an amazing opportunity! I'd love to discuss how my background could contribute to your team.",
      "Congrats on the funding! I'm excited about the growth opportunities and would love to be part of the journey."
    ];
    
    const randomReply = replies[Math.floor(Math.random() * replies.length)];
    alert(`Generated reply: "${randomReply}"`);
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'hiring': return 'bg-green-100 text-green-800';
      case 'referral': return 'bg-blue-100 text-blue-800';
      case 'company_update': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Feed</h1>
        <p className="text-gray-600">
          Follow hashtags and discover hiring posts from your network
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Search */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Search className="h-5 w-5" />
                Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </CardContent>
          </Card>

          {/* Hashtag Filter */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Hash className="h-5 w-5" />
                Hashtags
              </CardTitle>
              <CardDescription>
                Follow hashtags to see relevant posts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {hashtags.map((hashtag) => (
                  <Badge
                    key={hashtag}
                    variant={selectedHashtags.includes(hashtag) ? "default" : "secondary"}
                    className="cursor-pointer hover:bg-blue-100"
                    onClick={() => toggleHashtag(hashtag)}
                  >
                    #{hashtag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Feed Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Posts tracked</span>
                <span className="font-medium">247</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Hiring posts</span>
                <span className="font-medium">83</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Referral offers</span>
                <span className="font-medium">34</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feed */}
        <div className="lg:col-span-3 space-y-6">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {post.author.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                      <p className="text-sm text-gray-600">{post.author.title} at {post.author.company}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{post.timestamp}</span>
                        <Badge className={`text-xs ${getPostTypeColor(post.type)}`}>
                          {post.type.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-800 mb-4">{post.content}</p>
                
                {/* Hashtags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.hashtags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>

                {/* Engagement */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      {post.engagement.likes}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      {post.engagement.comments}
                    </div>
                    <div className="flex items-center gap-1">
                      <Repeat2 className="h-4 w-4" />
                      {post.engagement.shares}
                    </div>
                  </div>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => generateReply(post)}
                    className="hover:bg-blue-50"
                  >
                    Generate Reply
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredPosts.length === 0 && (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center text-gray-500">
                  <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No posts match your current filters</p>
                  <p className="text-sm">Try adjusting your hashtag selection</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
