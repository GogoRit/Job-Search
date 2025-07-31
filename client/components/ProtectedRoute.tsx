import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useOnboarding, useOnboardingStep } from "../contexts/OnboardingContext";
import { useAuth, useIsAuthenticated } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireOnboarding?: boolean;
}

export function ProtectedRoute({ children, requireOnboarding = false }: ProtectedRouteProps) {
  const { state } = useOnboarding();
  const navigate = useNavigate();
  const location = useLocation();
  const nextStep = useOnboardingStep();
  const { state: authState } = useAuth();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated && authState.isLoading === false) {
      navigate('/auth/login');
      return;
    }

    // Only redirect to onboarding if explicitly required and onboarding is incomplete
    if (requireOnboarding && !state.onboardingComplete) {
      // Don't redirect if we're already on an onboarding page
      if (!location.pathname.startsWith('/onboard') && location.pathname !== '/') {
        navigate(nextStep);
      }
    }
    
    // If we're on an onboarding page but onboarding is complete
    if (location.pathname.startsWith('/onboard') && state.onboardingComplete) {
      navigate('/dashboard');
    }
  }, [state.onboardingComplete, location.pathname, navigate, nextStep, requireOnboarding, isAuthenticated, authState.isLoading]);

  // Show loading state while checking authentication
  if (authState.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Component for onboarding flow routing
export function OnboardingRoute({ children }: { children: React.ReactNode }) {
  const { state } = useOnboarding();
  const navigate = useNavigate();
  const location = useLocation();
  const { state: authState } = useAuth();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated && authState.isLoading === false) {
      navigate('/auth/login');
      return;
    }

    // Always allow access to the API key page (root path)
    if (location.pathname === '/') {
      return;
    }

    // Allow users to access dashboard even with incomplete onboarding
    // Only redirect to dashboard if onboarding is explicitly complete
    if (state.onboardingComplete) {
      navigate('/dashboard');
      return;
    }

    // Allow users to navigate freely within onboarding pages
    // They can skip steps and complete them later from the homepage
    
  }, [state, location.pathname, navigate, isAuthenticated, authState.isLoading]);

  // Show loading state while checking authentication
  if (authState.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-50">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
