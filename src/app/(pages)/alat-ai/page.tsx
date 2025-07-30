
import { getAllTools } from '@/lib/plugins';
import AiToolsClient from '@/components/ai-tools-client';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserProfile } from '@/lib/firestore';
import { cookies } from 'next/headers';
import { auth } from 'firebase-admin';

async function getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            return { uid, ...userSnap.data() } as UserProfile;
        }
        return null;
    } catch (error) {
        console.error("Error fetching user profile on server:", error);
        return null;
    }
}

async function getSession() {
  const sessionCookie = cookies().get('session')?.value;
  if (!sessionCookie) {
    return null;
  }
  try {
    const decodedIdToken = await auth().verifySessionCookie(sessionCookie, true);
    return decodedIdToken;
  } catch (error) {
    console.error('Error verifying session cookie:', error);
    return null;
  }
}

export default async function AiToolsPage() {
  // Fetch all tools on the server
  const allTools = await getAllTools();
  
  // Get user session on the server
  const session = await getSession();
  
  let userProfile: UserProfile | null = null;
  if (session) {
    userProfile = await getUserProfile(session.uid);
  }

  // Pass data to a client component to handle filtering and display logic
  return <AiToolsClient allTools={allTools} initialUserProfile={userProfile} />;
}
