import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

const API_BASE_URL =  import.meta.env.VITE_BASE_URL;
// Define user type
interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

// Define auth context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check for existing session on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  // Login function using Laravel backend
  const login = async (email: string, password: string): Promise<User> => {
    try {
      // Replace the URL with your actual Laravel API endpoint
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email,
        password,
      });

      console.log("API Response:", response.data);
      const { user, token } = response.data;

      // Ensure `roles` exist and has at least one entry
      const role = user?.roles?.length > 0 ? user.roles[0].name : "user"; // Default to "user" if no role is assigned

      const userData: User = {
        id: user.id,
        name: user.name,
        email: user.email,
        role, // Assign extracted role
      };

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);
      setUser(userData);

      return userData;
    } catch (error: any) {
      // You can customize error handling based on your API response
      throw new Error(error.response?.data.message || "Login failed");
    }
  };

  // Register function using Laravel backend
  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<void> => {
    try {
      // Replace the URL with your actual Laravel registration endpoint
      await axios.post(`${API_BASE_URL}/register`, {
        name,
        email,
        password,
      });
      toast({
        title: "Registration successful",
        description: "Your account has been created. You can now log in.",
      });
    } catch (error: any) {
      throw new Error(error.response?.data.message || "Registration failed");
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};