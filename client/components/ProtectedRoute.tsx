import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useOnboarding, useOnboardingStep } from "@/contexts/OnboardingContext";

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
  const nextStep = useOnboardingStep();

  useEffect(() => {
    // If onboarding is complete, redirect to dashboard
    if (state.onboardingComplete) {
      navigate('/dashboard');
      return;
    }

    // If we're not on the correct step, redirect
    if (location.pathname !== nextStep) {
      navigate(nextStep);
    }
  }, [state, location.pathname, navigate, nextStep]);

  return <>{children}</>;
}
