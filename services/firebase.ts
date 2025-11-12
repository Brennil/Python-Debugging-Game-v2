import { initializeApp, type FirebaseOptions } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  onAuthStateChanged as onFirebaseAuthStateChanged,
  type User as FirebaseUser
} from 'firebase/auth';

// --- IMPORTANT FOR DEPLOYMENT ---
// For deploying to a static host like GitHub Pages, you cannot use environment variables.
// Paste your Firebase configuration values here directly.
//
// SECURITY NOTE: It is safe to expose these keys in a client-side application.
// Firebase secures your app through "Authorized Domains" in the Firebase Console,
// NOT by keeping these keys secret. Make sure you have added your live URL
// (e.g., "your-username.github.io") to the list of authorized domains in your
// Firebase Authentication settings.

const firebaseConfig = {
  apiKey: "AIzaSyAR16zteadug599v5PvuSSjXrbFUyQcQt8",
  authDomain: "python-debugger.firebaseapp.com",
  projectId: "python-debugger",
  storageBucket: "python-debugger.firebasestorage.app",
  messagingSenderId: "782501406778",
  appId: "1:782501406778:web:e768aad3c984b9dfdead03",
  measurementId: "G-GS3PP7XWQZ"
};

// Basic validation to help developers during setup
if (firebaseConfig.apiKey === "YOUR_API_KEY_HERE" || !firebaseConfig.projectId) {
    const message = "Firebase configuration is missing. Please edit `services/firebase.ts` and replace the placeholder values with your actual Firebase project configuration.";
    console.error(message);
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
