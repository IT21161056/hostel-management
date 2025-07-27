import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "../types";
import { login as loginApi, logout as logoutApi } from "../api/auth";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Role-based permissions mapping
const rolePermissions = {
  admin: [
    "view_dashboard",
    "manage_students",
    "view_students",
    "manage_attendance",
    "view_attendance",
    "manage_meals",
    "view_meals",
    "manage_finance",
    "view_finance",
    "view_reports",
    "manage_settings",
    "manage_users",
    "create_users",
    "edit_users",
    "delete_users",
  ],
  warden: [
    "view_dashboard",
    "view_students",
    "manage_students",
    "manage_attendance",
    "view_attendance",
    "view_reports",
  ],
  accountant: [
    "view_dashboard",
    "view_students",
    "manage_finance",
    "view_finance",
    "view_reports",
  ],
  kitchen: ["view_dashboard", "manage_meals", "view_meals", "view_reports"],
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing user session on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("accessToken");

        if (storedUser && token) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        // Clear invalid data
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
      } finally {
        setLoading(false);
      }
    };

    // Listen for logout events from axios interceptor
    const handleLogout = () => {
      setUser(null);
    };

    window.addEventListener("auth:logout", handleLogout);

    initializeAuth();

    return () => {
      window.removeEventListener("auth:logout", handleLogout);
    };
  }, []);

  // Monitor authentication state changes
  useEffect(() => {
    // Authentication state monitoring removed for production
  }, [user, loading]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await loginApi({ email, password });

      // Ensure the role is one of the expected values
      const userData: User = {
        ...response.user,
        role: response.user.role as
          | "admin"
          | "warden"
          | "accountant"
          | "kitchen",
      };

      // Store user data and token
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("accessToken", response.accessToken);

      setUser(userData);
      return true;
    } catch (error: any) {
      console.error("Login error:", error);

      // Handle specific error messages from backend
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Login failed. Please try again.");
      }
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Call logout API to clear server-side session
      await logoutApi();
    } catch (error) {
      console.error("Logout API error:", error);
      // Continue with client-side logout even if API fails
    } finally {
      // Clear client-side data
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      setUser(null);
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    const userPermissions = rolePermissions[user.role] || [];
    return userPermissions.includes(permission);
  };

  const hasRole = (role: string): boolean => {
    return user?.role === role;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        hasPermission,
        hasRole,
        loading,
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
