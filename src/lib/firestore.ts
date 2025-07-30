
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { initialTools } from './initial-data';
import type { UserProfile } from './types';

export type { UserProfile };
