import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useOnboarding, useOnboardingStep } from "../contexts/OnboardingContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireOnboarding?: boolean;
}

export function ProtectedRoute({ children, requireOnboarding = true }: ProtectedRouteProps) {
  const { state } = useOnboarding();
  const navigate = useNavigate();
  const location = useLocation();
  const nextStep = useOnboardingStep();

  useEffect(() => {
    // If we require onboarding and user hasn't completed it
    if (requireOnboarding && !state.onboardingComplete) {
      // Don't redirect if we're already on an onboarding page
      if (!location.pathname.startsWith('/onboard')) {
        navigate(nextStep);
      }
    }
    
    // If we're on an onboarding page but onboarding is complete
    if (location.pathname.startsWith('/onboard') && state.onboardingComplete) {
      navigate('/dashboard');
    }
  }, [state.onboardingComplete, location.pathname, navigate, nextStep, requireOnboarding]);

  return <>{children}</>;
}

// Component for onboarding flow routing
export function OnboardingRoute({ children }: { children: React.ReactNode }) {
  const { state } = useOnboarding();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If onboarding is complete, redirect to dashboard
    if (state.onboardingComplete) {
      navigate('/dashboard');
      return;
    }

    // Allow users to navigate freely within onboarding pages
    // Only enforce order when they try to skip required steps WITHOUT actually completing them
    const currentPath = location.pathname;
    
    // Allow direct navigation within onboarding - users can skip steps
    // The individual pages will handle showing appropriate content
    
  }, [state, location.pathname, navigate]);

  return <>{children}</>;
}
