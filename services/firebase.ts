import { initializeApp, type FirebaseOptions } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  onAuthStateChanged as onFirebaseAuthStateChanged,
  type User as FirebaseUser
} from 'firebase/auth';

// Firebase configuration is expected to be available in process.env
// Ensure you have set up your environment variables (e.g., in a .env file for local development)
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Basic validation to help developers during setup
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    const message = "Firebase configuration is missing or incomplete. Please ensure FIREBASE_ environment variables are set. The app may not function correctly.";
    console.warn(message);
    // Display a message to the user on the screen
    const root = document.getElementById('root');
    if (root) {
        root.innerHTML = `<div style="color: white; padding: 2rem; text-align: center; font-family: sans-serif; background-color: #5a2d2d; border: 1px solid #ff4d4d; border-radius: 8px; margin: 1rem;"><strong>Configuration Error</strong><p style="margin-top: 0.5rem;">${message}</p></div>`;
    }
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, provider);

export const signOutUser = () => signOut(auth);

export const onAuthStateChanged = (callback: (user: FirebaseUser | null) => void) => {
    return onFirebaseAuthStateChanged(auth, callback);
};
