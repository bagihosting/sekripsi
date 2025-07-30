// This is a CLIENT-SAFE version of the admin SDK initialization.
// It allows read-only operations like onSnapshot from the client
// for admin-like views, but ONLY if the user is authenticated as an admin.
// It relies on Firestore Security Rules to enforce this.
// For server-side operations, use firebase-admin.ts

import { getFirestore, initializeFirestore } from "firebase/firestore";
import { getApps, getApp, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

let app;
// Check if the "admin-client" app has already been initialized
if (!getApps().some(app => app.name === 'admin-client')) {
    app = initializeApp(firebaseConfig, "admin-client");
} else {
    app = getApp("admin-client");
}

// NOTE: This does NOT have admin privileges. It's just a separate
// client instance for the admin dashboard components. Security is
// still enforced by Firestore Rules.
const adminDb = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? getFirestore(app) : null;
const adminClientAuth = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? getAuth(app) : null;


export { adminDb, adminClientAuth };
