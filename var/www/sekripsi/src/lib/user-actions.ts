
'use server';

import { adminDb } from '@/lib/firebase-admin';
import type { UserProfile } from './types';

function processUserProfileDoc(doc: FirebaseFirestore.DocumentSnapshot): UserProfile | null {
    if (!doc.exists) {
        return null;
    }
    const data = doc.data()!;
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
        return processUserProfileDoc(userSnap);
    } catch (error) {
        console.error("Error fetching user profile with Admin SDK:", error);
        return null;
    }
}
