import { doc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

export interface UserProfile {
  uid: string;
  email: string | null;
  role: 'user' | 'admin';
  plan: 'free' | 'pro';
  createdAt: Timestamp;
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
