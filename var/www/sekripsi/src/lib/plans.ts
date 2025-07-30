
import type { PricingPlan } from './types';

// This data is used to seed the database if it's empty.
export const defaultPlans: PricingPlan[] = [
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
