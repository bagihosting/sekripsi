
import { adminDb } from './firebase-admin';
import type { PricingPlan } from './types';

// This data is now primarily for fallback purposes if Firestore is unavailable.
const defaultPlans: PricingPlan[] = [
    {
      id: "free",
      name: "Mahasiswa Gratis",
      price: "Rp 0",
      priceDescription: "selamanya",
      features: [
        "Akses ke semua 12+ alat AI",
        "Penggunaan terbatas harian",
        "Dukungan komunitas",
      ],
      actionType: 'current',
      isRecommended: false,
    },
    {
      id: "pro",
      name: "Pejuang Skripsi Pro",
      price: "Rp 79.000",
      priceDescription: "/bulan",
      features: [
        "Semua yang ada di paket Gratis",
        "Penggunaan tanpa batas",
        "Prioritas pemrosesan AI",
        "Akses ke fitur & alat beta",
        "Dukungan prioritas via email",
      ],
      actionType: 'auth_action',
      buttonText: "Upgrade ke Pro",
      isRecommended: true,
    },
    {
      id: "team",
      name: "Profesor & Tim",
      price: "Hubungi Kami",
      priceDescription: "untuk demo",
      features: [
        "Semua yang ada di paket Pro",
        "Manajemen multi-akun untuk tim",
        "Analitik penggunaan",
        "Dukungan khusus",
        "Kustomisasi model AI (add-on)",
      ],
      actionType: 'link',
      actionLink: '/dukungan',
      buttonText: "Jadwalkan Demo",
      isRecommended: false,
    },
];

// This function is now OBSOLETE as its logic has been moved to a server action in `actions.ts`.
// It is kept here to avoid breaking any potential (though unlikely) remaining imports,
// but it should be considered deprecated and removed in a future refactor.
// The server action `getPricingPlans` in `actions.ts` is the single source of truth.
export async function getPricingPlans(): Promise<PricingPlan[]> {
  console.warn("DEPRECATED: getPricingPlans from /lib/plans.ts is called. Use the server action instead.");
  if (!adminDb) {
    console.warn("Admin DB not initialized. Returning default plans.");
    return defaultPlans;
  }
  try {
    const plansCollection = adminDb.collection('pricingPlans');
    const plansSnapshot = await plansCollection.orderBy('name').get();

    if (plansSnapshot.empty) {
        console.warn("No pricing plans found in Firestore, returning default plans.");
        return defaultPlans;
    }
    
    const plans: PricingPlan[] = [];
    plansSnapshot.forEach((doc) => {
        plans.push({ id: doc.id, ...doc.data() } as PricingPlan);
    });
    
    const order: { [key: string]: number } = { free: 1, pro: 2, team: 3 };
    plans.sort((a, b) => (order[a.id] || 99) - (order[b.id] || 99));

    return plans;
  } catch (error) {
    console.error("Error fetching pricing plans with Admin SDK:", error);
    return defaultPlans;
  }
}
