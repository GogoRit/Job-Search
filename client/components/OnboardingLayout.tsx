import React from "react";
import { Link } from "react-router-dom";

interface OnboardingLayoutProps {
  children: React.ReactNode;
}

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Simple header for onboarding */}
      <header className="py-6 px-4">
        <div className="container mx-auto max-w-4xl">
          <Link to="/" className="flex items-center space-x-2 w-fit">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">JA</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              JobAI
            </span>
          </Link>
        </div>
      </header>

      {/* Centered content area */}
      <main className="flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-lg">
          {children}
        </div>
      </main>
    </div>
  );
}
