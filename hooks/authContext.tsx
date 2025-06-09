import React, { useContext, useState, useEffect, ReactNode } from 'react';
import { auth } from '@/firebase/firebase';
import { onAuthStateChanged, GoogleAuthProvider, User } from 'firebase/auth';
import { MotiView } from 'moti';

// Define the shape of the context value
interface AuthContextType {
  userLoggedIn: boolean;
  isEmailUser: boolean;
  isGoogleUser: boolean;
  isAppleUser: boolean;
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  role: string | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

// Create a context for authentication
const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider=({ children }: { children: ReactNode }) => {
  // State variables to manage user authentication and roles
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [isEmailUser, setIsEmailUser] = useState(false);
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [isAppleUser, setIsAppleUser] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return unsubscribe;
  }, []);

  // Function to initialize user state and fetch additional data
  async function initializeUser(user: User | null) {
    try {
      if (user) {
        setCurrentUser(user); // Set the current user
        console.log('User logged in:', user);

        await user.getIdToken(true);
        const idTokenResult = await user.getIdTokenResult();
        const roleFromClaims = typeof idTokenResult.claims.role === 'string' ? idTokenResult.claims.role : null;
        console.log('User role from claims:', roleFromClaims);
        
        // Check the authentication provider (email, Google, Apple)
        setIsEmailUser(user.providerData.some((provider) => provider.providerId === 'password'));
        setIsGoogleUser(user.providerData.some((provider) => provider.providerId === GoogleAuthProvider.PROVIDER_ID));
        setIsAppleUser(user.providerData.some((provider) => provider.providerId === 'apple.com'));
        setRole(roleFromClaims);
        setUserLoggedIn(user.emailVerified); // Mark user as logged in

      } else {
        // Reset state if no user is logged in
        setCurrentUser(null);
        setUserLoggedIn(false);
        setRole(null);
        setIsEmailUser(false);
        setIsGoogleUser(false);
        setIsAppleUser(false);
      }
    } catch (error) {
      console.error('Error initializing user:', error);
    } finally {
      setLoading(false); // Ensure loading state is updated
    }
  };

  // refreshUser function to refresh the user's authentication state and role
  const refreshUser = async () => {
    if (auth.currentUser) {
      try {
        await auth.currentUser.reload(); // Reload the user to get updated claims
        const updatedUser = auth.currentUser;
        await initializeUser(updatedUser);
      } catch (error) {
        console.error('Error refreshing user:', error);
      }
    }
  };

  const value: AuthContextType = {
    userLoggedIn,
    isEmailUser,
    isGoogleUser,
    isAppleUser,
    currentUser,
    setCurrentUser,
    role,
    loading,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        // Show a loading spinner while authentication state is being determined
        <MotiView
        className="flex flex-row gap-3 justify-center items-center h-screen bg-white"
        style={{ flexDirection: 'row' }}
      >
        {[0, 1, 2].map((i) => (
          <MotiView
            key={i}
            from={{ translateY: 0 }}
            animate={{ translateY: -30 }}
            transition={{
              type: 'timing',
              duration: 800,
              repeat: Infinity,
              repeatReverse: true,
              delay: i * 120, // stagger each dot\
            }}
            className="w-5 h-5 rounded-full bg-[#2C3E50]"
          />
        ))}
      </MotiView>
      ) : (
        // Render children components once loading is complete
        children
      )}
    </AuthContext.Provider>
  );
};