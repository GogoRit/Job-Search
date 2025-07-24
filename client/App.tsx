import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import Applications from "./pages/Applications";
import Outreach from "./pages/Outreach";
import Referrals from "./pages/Referrals";
import Alerts from "./pages/Alerts";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

// Onboard pages
import ApiKey from "./pages/onboard/ApiKey";
import Resume from "./pages/onboard/Resume";
import LinkedIn from "./pages/onboard/LinkedIn";

// New main pages
import Discover from "./pages/Discover";
import Feed from "./pages/Feed";

// Context and routing
import { OnboardingProvider } from "./contexts/OnboardingContext";
import { ProtectedRoute, OnboardingRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <OnboardingProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Layout>
              <Routes>
                {/* API Key page as landing page */}
                <Route 
                  path="/" 
                  element={
                    <OnboardingRoute>
                      <ApiKey />
                    </OnboardingRoute>
                  } 
                />
                
                {/* Onboarding Routes */}
                <Route 
                  path="/onboard/resume" 
                  element={
                    <OnboardingRoute>
                      <Resume />
                    </OnboardingRoute>
                  } 
                />
                <Route 
                  path="/onboard/linkedin" 
                  element={
                    <OnboardingRoute>
                      <LinkedIn />
                    </OnboardingRoute>
                  } 
                />
                
                {/* Protected Main App Routes */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/discover" 
                  element={
                    <ProtectedRoute>
                      <Discover />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/feed" 
                  element={
                    <ProtectedRoute>
                      <Feed />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/jobs" 
                  element={
                    <ProtectedRoute>
                      <Jobs />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/applications" 
                  element={
                    <ProtectedRoute>
                      <Applications />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/outreach" 
                  element={
                    <ProtectedRoute>
                      <Outreach />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/referrals" 
                  element={
                    <ProtectedRoute>
                      <Referrals />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/alerts" 
                  element={
                    <ProtectedRoute>
                      <Alerts />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/settings" 
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  } 
                />
                
                {/* 404 page */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </TooltipProvider>
      </OnboardingProvider>
    </QueryClientProvider>
  );
}

export default App;

createRoot(document.getElementById("root")!).render(<App />);
