import "./global.css";

import { Toaster } from "./components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainAppLayout from "./components/MainAppLayout";
import OnboardingLayout from "./components/OnboardingLayout";
import LandingLayout from "./components/LandingLayout";
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
import Profile from "./pages/onboard/Profile";
import LinkedIn from "./pages/onboard/LinkedIn";

// New main pages
import Discover from "./pages/Discover";
import Feed from "./pages/Feed";
import Index from "./pages/Index";

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
            <Routes>
              {/* Landing/Home page with special layout */}
              <Route 
                path="/landing" 
                element={
                  <LandingLayout>
                    <Index />
                  </LandingLayout>
                } 
              />

              {/* Onboarding Routes with minimal layout */}
              <Route 
                path="/" 
                element={
                  <OnboardingRoute>
                    <OnboardingLayout>
                      <ApiKey />
                    </OnboardingLayout>
                  </OnboardingRoute>
                } 
              />
              <Route 
                path="/onboard/resume" 
                element={
                  <OnboardingRoute>
                    <OnboardingLayout>
                      <Resume />
                    </OnboardingLayout>
                  </OnboardingRoute>
                } 
              />
              <Route 
                path="/onboard/profile" 
                element={
                  <OnboardingRoute>
                    <OnboardingLayout>
                      <Profile />
                    </OnboardingLayout>
                  </OnboardingRoute>
                } 
              />
              <Route 
                path="/onboard/linkedin" 
                element={
                  <OnboardingRoute>
                    <OnboardingLayout>
                      <LinkedIn />
                    </OnboardingLayout>
                  </OnboardingRoute>
                } 
              />
              
              {/* Protected Main App Routes with full app layout */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <MainAppLayout>
                      <Dashboard />
                    </MainAppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/discover" 
                element={
                  <ProtectedRoute>
                    <MainAppLayout>
                      <Discover />
                    </MainAppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/feed" 
                element={
                  <ProtectedRoute>
                    <MainAppLayout>
                      <Feed />
                    </MainAppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/jobs" 
                element={
                  <ProtectedRoute>
                    <MainAppLayout>
                      <Jobs />
                    </MainAppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/applications" 
                element={
                  <ProtectedRoute>
                    <MainAppLayout>
                      <Applications />
                    </MainAppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/outreach" 
                element={
                  <ProtectedRoute>
                    <MainAppLayout>
                      <Outreach />
                    </MainAppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/referrals" 
                element={
                  <ProtectedRoute>
                    <MainAppLayout>
                      <Referrals />
                    </MainAppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/alerts" 
                element={
                  <ProtectedRoute>
                    <MainAppLayout>
                      <Alerts />
                    </MainAppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <MainAppLayout>
                      <Settings />
                    </MainAppLayout>
                  </ProtectedRoute>
                } 
              />
              
              {/* 404 page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </OnboardingProvider>
    </QueryClientProvider>
  );
}

export default App;

createRoot(document.getElementById("root")!).render(<App />);
