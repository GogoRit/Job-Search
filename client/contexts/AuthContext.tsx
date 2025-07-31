import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  linkedin_enabled: boolean;
  has_api_key: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "job-search-auth-token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    // Load token from localStorage
    const token = localStorage.getItem(TOKEN_KEY);
    return {
      user: null,
      token,
      isAuthenticated: !!token,
      isLoading: true,
    };
  });

  // Check authentication status on mount
  useEffect(() => {
    if (state.token) {
      checkAuth();
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      const token = data.access_token;
      
      // Store token
      localStorage.setItem(TOKEN_KEY, token);
      
      // Reset onboarding state on fresh login
      localStorage.removeItem("job-search-onboarding");
      
      // Force clear any existing onboarding state
      if (typeof window !== "undefined") {
        localStorage.removeItem("job-search-onboarding");
        sessionStorage.removeItem("job-search-onboarding");
      }
      
      // Get user info
      await checkAuth();
      
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const data = await response.json();
      const token = data.access_token;
      
      // Store token
      localStorage.setItem(TOKEN_KEY, token);
      
      // Get user info
      await checkAuth();
      
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const checkAuth = async () => {
    if (!state.token) {
      setState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    try {
      const response = await fetch("/api/auth/me", {
        headers: {
          "Authorization": `Bearer ${state.token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setState(prev => ({
          ...prev,
          user: userData,
          isAuthenticated: true,
          isLoading: false,
        }));
      } else {
        // Token is invalid, clear it
        localStorage.removeItem(TOKEN_KEY);
        setState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (state.user) {
      setState(prev => ({
        ...prev,
        user: { ...prev.user!, ...userData },
      }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        register,
        logout,
        checkAuth,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Hook to get authenticated user
export function useUser() {
  const { state } = useAuth();
  return state.user;
}

// Hook to check if user is authenticated
export function useIsAuthenticated() {
  const { state } = useAuth();
  return state.isAuthenticated;
}

// Hook to get auth token for API calls
export function useAuthToken() {
  const { state } = useAuth();
  return state.token;
} 