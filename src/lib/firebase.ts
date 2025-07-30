// Import the functions you need from the SDKs you need
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeApp as initializeClientApp, getApps as getClientApps, getApp as getClientApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app';

// Client SDK setup (for client-side operations)
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase only if the project ID is set
let clientApp: FirebaseApp | null = null;
if (firebaseConfig.projectId) {
    clientApp = !getClientApps().length ? initializeClientApp(firebaseConfig) : getClientApp();
}

// These are for CLIENT-SIDE operations ONLY.
// For server-side, use the firebase-admin SDK.
const auth = clientApp ? getAuth(clientApp) : null;
const storage = clientApp ? getStorage(clientApp) : null;
const db = clientApp ? getFirestore(clientApp) : null;

export { clientApp as app, db, auth, storage };
