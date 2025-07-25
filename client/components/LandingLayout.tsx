import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";

interface LandingLayoutProps {
  children: React.ReactNode;
}

export default function LandingLayout({ children }: LandingLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div>
      <header className="absolute top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">JA</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                JobAI
              </span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                Dashboard
              </Link>
              <Link to="/jobs" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                Features
              </Link>
              <Link to="/settings" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                Pricing
              </Link>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" className="text-gray-600 hover:text-blue-600">
                Sign In
              </Button>
              <Link to="/dashboard">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700">
                  Get Started
                </Button>
              </Link>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
