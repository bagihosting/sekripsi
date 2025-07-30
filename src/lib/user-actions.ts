
'use server';

import { adminDb } from './firebase-admin';
import type { UserProfile } from './firestore';

function processDoc(doc: FirebaseFirestore.DocumentSnapshot): UserProfile | null {
    if (!doc.exists) {
        return null;
    }
    const data = doc.data()!;
    // Firestore Admin SDK returns Timestamps, convert them for client-side usage
    const processedData: any = {};
    for (const key in data) {
        if (data[key] && typeof data[key].toDate === 'function') {
            processedData[key] = data[key].toDate().toISOString();
        } else {
            processedData[key] = data[key];
        }
    }

    return {
        uid: doc.id,
        ...processedData,
    } as UserProfile;
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
    if (!adminDb) {
        console.error("Admin DB not initialized. Cannot get user profile.");
        return null;
    }

    try {
        const userRef = adminDb.collection('users').doc(uid);
        const userSnap = await userRef.get();
        return processDoc(userSnap);
    } catch (error) {
        console.error("Error fetching user profile with Admin SDK:", error);
        return null;
    }
}
