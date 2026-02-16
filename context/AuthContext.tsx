"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User } from 'firebase/auth';
import { 
  signInWithGoogle, 
  signInWithApple, 
  signInWithFacebook, 
  signInWithEmail,
  logOut, 
  onAuthChange 
} from '@/lib/auth';

type UserRole = 'admin' | 'editor' | 'contributor' | 'viewer';

interface AppUser {
  uid: string;
  email: string | null;
  name: string;
  photoURL: string | null;
  provider: string;
  role: UserRole;
}

// Role assignments by email (will move to Firestore later)
const USER_ROLES: Record<string, { name: string; role: UserRole }> = {
  'raja@assignedcocounsel.com': { name: 'Raja Gupta', role: 'admin' },
  'saadya@assignedcocounsel.com': { name: 'Saadya', role: 'editor' },
  'mike@assignedcocounsel.com': { name: 'Michael Lynn', role: 'editor' },
  'demo@assignedcocounsel.com': { name: 'Demo Attorney', role: 'viewer' },
};

function getUserRole(email: string | null): { name: string; role: UserRole } {
  if (!email) return { name: 'User', role: 'contributor' };
  return USER_ROLES[email] || { name: email.split('@')[0], role: 'contributor' };
}

interface AuthContextType {
  user: AppUser | null;
  isLoading: boolean;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  loginWithApple: () => Promise<{ success: boolean; error?: string }>;
  loginWithFacebook: () => Promise<{ success: boolean; error?: string }>;
  loginWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginDemo: () => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Convert Firebase User to AppUser
function toAppUser(firebaseUser: User): AppUser {
  const { name, role } = getUserRole(firebaseUser.email);
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    name: firebaseUser.displayName || name,
    photoURL: firebaseUser.photoURL,
    provider: firebaseUser.providerData[0]?.providerId || 'unknown',
    role,
  };
}

// Demo user for testing
const DEMO_USER: AppUser = {
  uid: 'demo-user',
  email: 'demo@assignedcocounsel.com',
  name: 'Demo Attorney',
  photoURL: null,
  provider: 'demo',
  role: 'viewer',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Listen for auth state changes
  useEffect(() => {
    // Check for demo user in localStorage first
    const storedDemo = localStorage.getItem('acc_demo_user');
    if (storedDemo) {
      setUser(DEMO_USER);
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthChange((firebaseUser) => {
      if (firebaseUser) {
        setUser(toAppUser(firebaseUser));
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const firebaseUser = await signInWithGoogle();
      setUser(toAppUser(firebaseUser));
      return { success: true };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Google sign-in failed';
      console.error('Google login error:', error);
      return { success: false, error: message };
    }
  };

  const loginWithApple = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const firebaseUser = await signInWithApple();
      setUser(toAppUser(firebaseUser));
      return { success: true };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Apple sign-in failed';
      console.error('Apple login error:', error);
      return { success: false, error: message };
    }
  };

  const loginWithFacebook = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const firebaseUser = await signInWithFacebook();
      setUser(toAppUser(firebaseUser));
      return { success: true };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Facebook sign-in failed';
      console.error('Facebook login error:', error);
      return { success: false, error: message };
    }
  };

  const loginWithEmail = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const firebaseUser = await signInWithEmail(email, password);
      setUser(toAppUser(firebaseUser));
      return { success: true };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Email sign-in failed';
      console.error('Email login error:', error);
      return { success: false, error: message };
    }
  };

  const loginDemo = async (): Promise<{ success: boolean; error?: string }> => {
    // Demo login - no Firebase, just localStorage
    localStorage.setItem('acc_demo_user', 'true');
    setUser(DEMO_USER);
    return { success: true };
  };

  const logout = async () => {
    localStorage.removeItem('acc_demo_user');
    try {
      await logOut();
    } catch {
      // Ignore logout errors (e.g., if not logged in via Firebase)
    }
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      loginWithGoogle, 
      loginWithApple, 
      loginWithFacebook,
      loginWithEmail,
      loginDemo,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
