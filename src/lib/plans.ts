
import { adminDb } from './firebase-admin';
import type { PricingPlan } from './types';

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


export async function getPricingPlans(): Promise<PricingPlan[]> {
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
