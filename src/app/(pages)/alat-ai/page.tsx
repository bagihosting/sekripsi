
import { getAllTools } from '@/lib/plugins';
import AiToolsClient from '@/components/ai-tools-client';
import { UserProfile } from '@/lib/firestore';
import { cookies } from 'next/headers';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

async function getUserProfile(uid: string): Promise<UserProfile | null> {
    if (!adminDb) return null;
    try {
        const userRef = adminDb.collection('users').doc(uid);
        const userSnap = await userRef.get();
        if (userSnap.exists) {
            const data = userSnap.data();
            // Firestore Admin SDK returns Timestamps, convert them for serialization
            return {
                ...data,
                uid,
                createdAt: data?.createdAt?.toDate().toISOString(),
                upgradedAt: data?.upgradedAt?.toDate().toISOString()
            } as UserProfile;
        }
        return null;
    } catch (error) {
        console.error("Error fetching user profile with Admin SDK:", error);
        return null;
    }
}

async function getSession() {
  const sessionCookie = cookies().get('session')?.value;
  if (!sessionCookie || !adminAuth) {
    return null;
  }
  try {
    const decodedIdToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    return decodedIdToken;
  } catch (error) {
    // Session cookie is invalid or expired.
    // This is an expected error and can be ignored.
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
