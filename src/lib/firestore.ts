
import { doc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import { initialTools } from './initial-data';
import type { UserProfile } from './types';

export type { UserProfile };


/**
 * Creates a user profile document in Firestore.
 * This is typically called after a new user signs up.
 * @param uid - The user's unique ID from Firebase Auth.
 * @param email - The user's email.
 */
export const createUserProfile = async (uid: string, email: string | null): Promise<void> => {
  const userRef = doc(db, 'users', uid);
  // New users automatically get all free tools.
  const freeTools = initialTools.filter(tool => tool.price === 0).map(tool => tool.id);

  const newUserProfile: Omit<UserProfile, 'uid' | 'createdAt'> = {
    email,
    displayName: email?.split('@')[0] || 'User',
    photoURL: '',
    role: 'user', // Default role for new users
    plan: 'free', // Default plan for new users
    paymentStatus: 'none', // Default payment status
    activatedTools: freeTools,
    purchasedTools: [],
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
