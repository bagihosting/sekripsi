
import { initializeApp, getApps, getApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : null;

let app;
if (serviceAccount && getApps().length === 0) {
  app = initializeApp({
    credential: cert(serviceAccount),
  });
} else if (getApps().length > 0) {
    app = getApp();
}


const adminAuth = serviceAccount ? getAuth(app) : null;
const adminDb = serviceAccount ? getFirestore(app) : null;

export { adminAuth, adminDb };
