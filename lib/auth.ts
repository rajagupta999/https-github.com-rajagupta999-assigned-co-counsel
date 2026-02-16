// Firebase Authentication for Assigned Co-Counsel
import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updatePassword,
  updateProfile,
  signOut,
  GoogleAuthProvider,
  OAuthProvider,
  FacebookAuthProvider,
  onAuthStateChanged,
  User
} from 'firebase/auth';

// Firebase config for Assigned Co-Counsel
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: "assigned-co-counsel.firebaseapp.com",
  projectId: "assigned-co-counsel",
  storageBucket: "assigned-co-counsel.firebasestorage.app",
  messagingSenderId: "414328331170",
  appId: "1:414328331170:web:f0e7e4d6b8c7a8e9f0a1b2"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

// Providers
const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider('apple.com');
const facebookProvider = new FacebookAuthProvider();

// Add scopes
googleProvider.addScope('email');
googleProvider.addScope('profile');

appleProvider.addScope('email');
appleProvider.addScope('name');

facebookProvider.addScope('email');
facebookProvider.addScope('public_profile');

// ============ AUTH FUNCTIONS ============

export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function signInWithApple(): Promise<User> {
  const result = await signInWithPopup(auth, appleProvider);
  return result.user;
}

export async function signInWithFacebook(): Promise<User> {
  const result = await signInWithPopup(auth, facebookProvider);
  return result.user;
}

export async function signInWithEmail(email: string, password: string): Promise<User> {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function signUpWithEmail(email: string, password: string): Promise<User> {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

export async function changePassword(newPassword: string): Promise<void> {
  if (!auth.currentUser) throw new Error('Not logged in');
  await updatePassword(auth.currentUser, newPassword);
}

export async function updateUserProfile(displayName?: string, photoURL?: string): Promise<void> {
  if (!auth.currentUser) throw new Error('Not logged in');
  await updateProfile(auth.currentUser, { displayName: displayName || null, photoURL: photoURL || null });
}

export async function logOut(): Promise<void> {
  await signOut(auth);
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export { auth };
