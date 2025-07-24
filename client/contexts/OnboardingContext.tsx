import React, { createContext, useContext, useState, useEffect } from "react";

interface OnboardingState {
  apiKeySubmitted: boolean;
  resumeUploaded: boolean;
  linkedinEnabled: boolean;
  onboardingComplete: boolean;
}

interface OnboardingContextType {
  state: OnboardingState;
  setApiKeySubmitted: (submitted: boolean) => void;
  setResumeUploaded: (uploaded: boolean) => void;
  setLinkedinEnabled: (enabled: boolean) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const STORAGE_KEY = "job-search-onboarding";

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<OnboardingState>(() => {
    // Load from localStorage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse onboarding state:", e);
        }
      }
    }
    
    return {
      apiKeySubmitted: false,
      resumeUploaded: false,
      linkedinEnabled: false,
      onboardingComplete: false,
    };
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  const setApiKeySubmitted = (submitted: boolean) => {
    setState(prev => ({ ...prev, apiKeySubmitted: submitted }));
  };

  const setResumeUploaded = (uploaded: boolean) => {
    setState(prev => ({ ...prev, resumeUploaded: uploaded }));
  };

  const setLinkedinEnabled = (enabled: boolean) => {
    setState(prev => ({ ...prev, linkedinEnabled: enabled }));
  };

  const completeOnboarding = () => {
    setState(prev => ({ ...prev, onboardingComplete: true }));
  };

  const resetOnboarding = () => {
    setState({
      apiKeySubmitted: false,
      resumeUploaded: false,
      linkedinEnabled: false,
      onboardingComplete: false,
    });
  };

  return (
    <OnboardingContext.Provider
      value={{
        state,
        setApiKeySubmitted,
        setResumeUploaded,
        setLinkedinEnabled,
        completeOnboarding,
        resetOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}

// Hook to check if user can access main app
export function useCanAccessApp() {
  const { state } = useOnboarding();
  return state.onboardingComplete;
}

// Hook to get the next onboarding step
export function useOnboardingStep() {
  const { state } = useOnboarding();
  
  if (!state.apiKeySubmitted) {
    return "/";
  }
  
  if (!state.resumeUploaded) {
    return "/onboard/resume";
  }
  
  if (!state.onboardingComplete) {
    return "/onboard/linkedin";
  }
  
  return "/dashboard";
}
