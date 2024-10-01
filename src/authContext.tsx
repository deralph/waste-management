import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { auth } from "./firebase"; // Assuming Firebase is configured in firebase.ts
import { onAuthStateChanged, User } from "firebase/auth";

// Define the context type
interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider props interface to accept children
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      console.log("user in context = ", user);
      if (user) {
        // Add your logic to determine if the user is an admin
        // For example, check if the user's email is in the admin list
        const adminEmails = ["jraphael41@gmail.com", "admin@mail.com"]; // Example admin emails
        setIsAdmin(adminEmails.includes(user.email || ""));
      } else {
        setIsAdmin(false);
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
