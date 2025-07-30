
import { initializeApp, getApps, getApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : null;

if (serviceAccount && getApps().length === 0) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const adminAuth = serviceAccount ? getAuth(getApp()) : null;

export { adminAuth };
