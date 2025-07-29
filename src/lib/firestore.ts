
import { doc, setDoc, serverTimestamp, Timestamp, collection } from 'firebase/firestore';
import { db } from './firebase';

export interface UserProfile {
  uid: string;
  email: string | null;
  role: 'user' | 'admin';
  plan: 'free' | 'pro';
  paymentStatus: 'none' | 'pending' | 'pro';
  createdAt: Timestamp;
}

export interface Payment {
  userId: string;
  userEmail: string;
  proofUrl: string;
  status: 'pending' | 'confirmed' | 'rejected';
  createdAt: Timestamp;
  processedAt?: Timestamp;
}


/**
 * Creates a user profile document in Firestore.
 * This is typically called after a new user signs up.
 * @param uid - The user's unique ID from Firebase Auth.
 * @param email - The user's email.
 */
export const createUserProfile = async (uid: string, email: string | null): Promise<void> => {
  const userRef = doc(db, 'users', uid);
  const newUserProfile: Omit<UserProfile, 'uid' | 'createdAt'> = {
    email,
    role: 'user', // Default role for new users
    plan: 'free', // Default plan for new users
    paymentStatus: 'none', // Default payment status
  };
  
  try {
    await setDoc(userRef, {
      ...newUserProfile,
      createdAt: serverTimestamp(),
    });
    console.log('User profile created for UID:', uid);
  } catch (error) {
    console.error('Error creating user profile:', error);
    // You might want to handle this error more gracefully
    throw new Error('Could not create user profile.');
  }
};
